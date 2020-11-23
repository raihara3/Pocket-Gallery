import * as THREE from 'three';
import { ARButton } from './ARButton';

let camera, scene, renderer;
let controller;

init();
animate();

class ARObject {
  camera: THREE.Camera
  scene: THREE.Scene
  renderer: THREE.WebGLRenderer

  constructor() {
    const fov = 70
    const aspect = window.innerWidth / window.innerHeight
    const near = 0.01
    const far = 20

    this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
    this.scene = new THREE.Scene()
    this.renderer = new THREE.WebGLRenderer({antialias: true, alpha: true})
  }

  init() {
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.xr.enabled = true
    document.body.appendChild(this.renderer.domElement)
  }
}

function init() {

  // 1. レンダラーのalphaオプションをtrueにする
  renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  // 2. レンダラーのXR機能を有効にする
  renderer.xr.enabled = true;

  document.body.appendChild(renderer.domElement);

  scene = new THREE.Scene();
  let light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
  light.position.set(0, 1, 0);
  scene.add(light);

  // 3. AR表示を有効にするためのボタンを画面に追加する
  document.body.appendChild(ARButton.createButton(renderer, {requiredFeatures: ['local', 'hit-test']}, scene));

  camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 20);
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }, false);

  // 4. XRセッションにアクセスするためコントローラーを取得する
  controller = renderer.xr.getController(0);
  controller.addEventListener('selectend', () => {
    controller.userData.isSelecting = true;
  });
}

function animate() {
  renderer.setAnimationLoop(render);
}

function render() {
  // handleController(controller);
  renderer.render(scene, camera);
}
