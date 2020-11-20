import * as THREE from 'three';
import { ARButton } from 'three/examples/jsm/webxr/ARButton';

let camera, scene, renderer;
let controller;

init();
animate();

function init() {

  // 1. レンダラーのalphaオプションをtrueにする
  renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  // 2. レンダラーのXR機能を有効にする
  renderer.xr.enabled = true;

  document.body.appendChild(renderer.domElement);

  // 3. AR表示を有効にするためのボタンを画面に追加する
  document.body.appendChild(ARButton.createButton(renderer, {requiredFeatures: ['local', 'hit-test']}));

  scene = new THREE.Scene();
  let light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
  light.position.set(0, 1, 0);
  scene.add(light);

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

function makeArrow(color) {
  const geometry = new THREE.ConeGeometry(0.03, 0.1, 32)
  const material = new THREE.MeshStandardMaterial({
    color: color,
    roughness: 0.9,
    metalness: 0.0,
    side: THREE.DoubleSide
  });
  const localMesh = new THREE.Mesh(geometry, material);
  localMesh.rotation.x = -Math.PI / 2
  const mesh = new THREE.Group()
  mesh.add(localMesh)
  return mesh
}

function handleController(controller) {
  if (!controller.userData.isSelecting) return;

  const mesh = makeArrow(Math.floor(Math.random() * 0xffffff))

  // 5. コントローラーのposition, rotationプロパティを使用して
  //    AR空間内での端末の姿勢を取得し、メッシュに適用する
  mesh.position.copy(controller.position)
  mesh.rotation.copy(controller.rotation)

  scene.add(mesh)

  controller.userData.isSelecting = false
}

function animate() {
  renderer.setAnimationLoop(render);
}

function render() {
  handleController(controller);
  renderer.render(scene, camera);
}
