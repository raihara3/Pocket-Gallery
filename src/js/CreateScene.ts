import * as THREE from 'three'

const fov = 70;
const aspect = window.innerWidth/window.innerHeight
const near = 0.01
const far = 20

export const renderer: any = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true
})
export const scene: any = new THREE.Scene()
export const camera = new THREE.PerspectiveCamera(fov,aspect, near, far)

const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1)
const controller = renderer.xr.getController(0)

const CreateScene = () => {
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.xr.enabled = true
  document.body.appendChild(renderer.domElement)

  light.position.set(0, 1, 0)
  scene.add(light)

  const geometry = new THREE.PlaneGeometry( 1, 1, 1 )
  const material = new THREE.MeshBasicMaterial({color: 0x00ff00})
  const cube = new THREE.Mesh( geometry, material )
  cube.position.set(0, 0, -1)
  scene.add(cube)

  controller.addEventListener('selectend', () => {
    controller.userData.isSelecting = true
  })
  renderer.setAnimationLoop(() => {
    renderer.render(scene, camera)
  })
}

export default CreateScene
