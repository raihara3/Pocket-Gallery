import * as THREE from 'three';
import { ARButton } from './ARButton';

class ARObject {
  camera: THREE.PerspectiveCamera
  scene: THREE.Scene
  renderer: THREE.WebGLRenderer
  aspect: number
  controller: THREE.Group

  constructor() {
    const fov = 70
    const aspect = window.innerWidth / window.innerHeight
    const near = 0.01
    const far = 20

    this.aspect = aspect
    this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
    this.scene = new THREE.Scene()
    this.renderer = new THREE.WebGLRenderer({antialias: true, alpha: true})
    this.controller = new THREE.Group()
  }

  init() {
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.xr.enabled = true
    document.body.appendChild(this.renderer.domElement)

    let light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1)
    light.position.set(0, 1, 0)
    this.scene.add(light)

    document.body.appendChild(ARButton.createButton(this.renderer,
      {requiredFeatures: ['local', 'hit-test']}, this.scene)
    )

    window.addEventListener('resize', () => {
      this.camera.aspect = this.aspect
      this.camera.updateProjectionMatrix()
      this.renderer.setSize(window.innerWidth, window.innerHeight)
    }, false)

    this.controller = this.renderer.xr.getController(0)
    this.controller.addEventListener('selectend', () => {
      this.controller.userData.isSelecting = true
    })

    this.animate()
  }

  animate() {
    this.renderer.setAnimationLoop(() =>
      this.renderer.render(this.scene, this.camera)
    )
  }
}

const arObject = new ARObject()
arObject.init()
