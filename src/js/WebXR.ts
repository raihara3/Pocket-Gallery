import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import XR from './Navigator'
import Reticle from './Reticle'
import Gallery from './Gallery'

class WebXR {
  currentSession: THREE.XRSession | null
  renderer: THREE.WebGLRenderer
  sessionInit: THREE.XRSessionInit
  scene: THREE.Scene
  session: THREE.XRSession | null
  xrHitTestSource: THREE.XRHitTestSource | null
  xrRefSpace: THREE.XRReferenceSpace | null
  xrPlaneObject: THREE.Mesh | null
  reticle: Reticle

  constructor(renderer, sessionInit, scene) {
    this.currentSession = null
    this.renderer = renderer
    this.sessionInit = sessionInit
    this.scene = scene
    this.session = null
    this.xrHitTestSource = null
    this.xrRefSpace = null
    this.xrPlaneObject = null
    this.reticle = new Reticle()
  }

  static isSupported() {
    return XR.isSessionSupported('immersive-ar')
  }

  async setSession() {
    if(this.currentSession) {
      this.currentSession.end()
      return
    }

    this.session = await XR.requestSession('immersive-ar', this.sessionInit)
    this.onSessionStarted()

    if(!this.session) return
    const refSpace = await this.session.requestReferenceSpace('viewer')
    this.xrHitTestSource = await this.session.requestHitTestSource({space: refSpace})
    this.xrRefSpace = await this.session.requestReferenceSpace('local')
    this.session.requestAnimationFrame((_, frame) => this.onXRFrame(_, frame))
  }

  private onSessionStarted() {
    if(!this.session) return
    this.session.addEventListener('end', this.onSessionEnded)
    this.renderer.xr.setReferenceSpaceType('local')
    this.renderer.xr.setSession(this.session)
    this.currentSession = this.session

    const reticle = this.reticle.create()
    this.scene.add(reticle)
  }

  private onSessionEnded() {
    if(!this.currentSession) return
    this.currentSession.removeEventListener('end', this.onSessionEnded)
    this.currentSession = null
  }

  private onXRFrame(_, frame: THREE.XRFrame) {
    if(!this.reticle.display) return

    this.session = frame.session
    let pose: THREE.XRViewerPose | undefined
    if(this.xrRefSpace) {
      pose = frame.getViewerPose(this.xrRefSpace)
    }

    if(this.xrHitTestSource && pose && this.xrRefSpace) {
      let hitTestResults = frame.getHitTestResults(this.xrHitTestSource)
      if(hitTestResults.length > 0) {
        let pose = hitTestResults[0].getPose(this.xrRefSpace)
        pose && this.handleController(pose.transform)
        pose && this.reticle.updateMatrix(pose)
      }
    }

    this.session.requestAnimationFrame((_, frame) => this.onXRFrame(_, frame))
  }

  private handleController(transform: THREE.XRRigidTransform) {
    const controller = this.renderer.xr.getController(0)
    if(!controller.userData.isSelecting) return

    const light = new THREE.DirectionalLight(0xffffff)
    // light.castShadow = true
    light.position.set(
      transform.position.x,
      transform.position.y + 10,
      transform.position.z + 15
    )
    light.quaternion.set(
      transform.orientation.x,
      transform.orientation.y,
      transform.orientation.z,
      transform.orientation.w
    )
    // light.shadow.mapSize.width = 1024
    // light.shadow.mapSize.height = 1024

    const gallery = new Gallery()
    const room = gallery.createRoom()
    room.position.set(
      transform.position.x,
      transform.position.y,
      transform.position.z
    )
    room.quaternion.set(
      transform.orientation.x,
      transform.orientation.y,
      transform.orientation.z,
      transform.orientation.w
    )
    room.rotateY(0.25 * Math.PI)

    new GLTFLoader().load('/model/host.gltf', (gltf) => {
      const model = gltf.scene
      model.scale.set(0.025, 0.025, 0.025)
      model.position.set(
        transform.position.x,
        transform.position.y,
        transform.position.z
      )
      model.quaternion.set(
        transform.orientation.x,
        transform.orientation.y,
        transform.orientation.z,
        transform.orientation.w
      )
      this.scene.add(light, room, model)
    })
    controller.userData.isSelecting = false

    this.reticle.remove(this.scene)
  }
}

export default WebXR
