import * as THREE from 'three'
import { Color } from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import WebGL from './WebGL'

const createReticle = () => {
  const ringGeometry = new THREE.RingGeometry(0.03, 0.05, 50)
  ringGeometry.rotateX(-0.5 * Math.PI)
  const material = new THREE.MeshBasicMaterial({
    color: new Color('#f3f705'),
    side: THREE.DoubleSide
  })
  const reticle = new THREE.Mesh(ringGeometry, material)
  reticle.name = 'reticle'
  return reticle
}

const createGallery = () => {
  const loader = new THREE.TextureLoader()
  const floorTexture = new THREE.MeshStandardMaterial({map: loader.load('images/floor.jpg')})
  const wallTexture = new THREE.MeshStandardMaterial({map: loader.load('images/wall.jpg')})

  const room = new THREE.Group()
  const planeGeometry = new THREE.PlaneGeometry(0.2, 0.2, 0.2)

  const floorGeo = planeGeometry.clone()
  const floor = new THREE.Mesh(floorGeo.rotateX(-0.5 * Math.PI), floorTexture)
  const wallBack = new THREE.Mesh(planeGeometry, wallTexture)
  wallBack.position.set(0, 0.2 / 2, -(0.2 / 2))
  const wallRight = new THREE.Mesh(planeGeometry, wallTexture)
  wallRight.position.set(0.2 / 2, 0.2 / 2, 0)
  wallRight.rotateY(-0.5 * Math.PI)

  const picture01 = createPicture('images/koten_01.jpg')
  picture01.position.set(-0.04, 0.2/2, -(0.2/2) + 0.001)
  const picture02 = createPicture('images/koten_02.jpg')
  picture02.position.set(0.04, 0.2/2, -(0.2/2) + 0.001)
  const picture03 = createPicture('images/koten_03.jpg')
  picture03.position.set(0.2/2 - 0.001, 0.2/2, -0.04)
  picture03.rotateY(-0.5 * Math.PI)
  const picture04 = createPicture('images/koten_04.jpg')
  picture04.position.set(0.2/2 - 0.001, 0.2/2, 0.04)
  picture04.rotateY(-0.5 * Math.PI)

  room.add(floor, wallBack, wallRight, picture01, picture02, picture03, picture04)
  return room
}

const createPicture = (src) => {
  const group = new THREE.Group()
  const picture = new THREE.Mesh(new THREE.PlaneGeometry(0.05, 0.05), new THREE.MeshStandardMaterial({
    map: new THREE.TextureLoader().load(src)
  }))
  const frame = createFrame()
  group.add(picture, frame)
  return group
}

const createFrame = () => {
  const texture = new THREE.TextureLoader().load('images/frame.jpg')
  const group = new THREE.Group()

  const boxGeometry = new THREE.BoxGeometry(0.052, 0.0025, 0.0025)
  const material = new THREE.MeshStandardMaterial({map: texture})
  const base = new THREE.Mesh(boxGeometry, material)

  const top = base.clone()
  top.position.set(0, 0.05/2, 0)
  const right = base.clone()
  right.rotateZ(0.5 * Math.PI)
  right.position.set(0.05/2, 0, 0)
  const bottom = top.clone()
  bottom.position.set(0, -(0.05/2), 0)
  const left = right.clone()
  left.position.set(-(0.05/2), 0, 0)

  group.add(top, right, bottom, left)
  return group
}

const startButton = document.getElementById('start-button') as HTMLButtonElement
startButton.addEventListener('click', async() => {
  const canvas = document.getElementById('webAR') as HTMLCanvasElement
  const webGL = new WebGL(canvas)

  const session = await navigator['xr'].requestSession('immersive-ar', {
    requiredFeatures: ['local', 'hit-test']
  })
  const refSpace = await session.requestReferenceSpace('viewer')
  const xrHitTestSource = await session.requestHitTestSource({space: refSpace})
  const xrRefSpace = await session.requestReferenceSpace('local')

  const context: any = webGL.context
  await context.makeXRCompatible()

  webGL.renderer.xr.setReferenceSpaceType('local')
  webGL.renderer.xr.setSession(session)
  session.addEventListener('end', () => location.reload())

  const reticle = createReticle()
  webGL.scene.add(reticle)

  let pose
  const onXRFrame = (_, frame) => {
    const hitTestResults = frame.getHitTestResults(xrHitTestSource)
    if(hitTestResults.length > 0) {
      pose = hitTestResults[0].getPose(xrRefSpace)
      const { position, orientation } = pose.transform
      reticle.position.set(position.x, position.y, position.z)
      reticle.quaternion.set(orientation.x, orientation.y, orientation.z, orientation.w)
      reticle.updateMatrix()

    }
    session.requestAnimationFrame((_, frame) => onXRFrame(_, frame))
  }
  session.requestAnimationFrame((_, frame) => {
    onXRFrame(_, frame)
  })

  const controller = webGL.renderer.xr.getController(0)
  controller.addEventListener('selectend', () => handleController(pose.transform))

  const handleController = ({position, orientation}) => {
    const reticle = webGL.scene.getObjectByName('reticle')
    if(!reticle) return

    webGL.scene.remove(reticle)
    const room = createGallery()
    room.position.set(position.x, position.y, position.z)
    room.quaternion.set(orientation.x, orientation.y, orientation.z, orientation.w)
    room.rotateY(0.25 * Math.PI)
    webGL.scene.add(room)

    new GLTFLoader().load('model/host.gltf', (gltf) => {
      const model = gltf.scene
      model.scale.set(0.025, 0.025, 0.025)
      model.position.set(position.x, position.y, position.z)
      model.quaternion.set(orientation.x, orientation.y, orientation.z, orientation.w)
      webGL.scene.add(model)
    })

    const light = new THREE.DirectionalLight(new Color('#ffffff'))
    light.position.set(position.x, position.y + 10, position.z + 15)
    light.quaternion.set(orientation.x, orientation.y, orientation.z, orientation.w)
    webGL.scene.add(light)
  }
})

window.onload = () => {
  const xr = navigator['xr']
  if(!xr) {
    startButton.innerText = 'WebXR not available'
    startButton.disabled = true
    return
  }
  startButton.innerText = 'START WebAR'
}
