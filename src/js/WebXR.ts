import * as THREE from 'three';
import XR from './Navigator'

class WebXR {
  currentSession: THREE.XRSession | null
  renderer: THREE.WebGLRenderer
  sessionInit: THREE.XRSessionInit
  scene: THREE.Scene
  session: THREE.XRSession | null
  xrHitTestSource: THREE.XRHitTestSource | null
  xrRefSpace: THREE.XRReferenceSpace | null
  xrPlaneObject: THREE.Mesh | null

  constructor(renderer, sessionInit, scene) {
    this.currentSession = null
    this.renderer = renderer
    this.sessionInit = sessionInit
    this.scene = scene
    this.session = null
    this.xrHitTestSource = null
    this.xrRefSpace = null
    this.xrPlaneObject = null
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

    const xrPlaneGeometry = new THREE.PlaneBufferGeometry( 100, 100, 100, 100 );
    xrPlaneGeometry.rotateX( -0.5 * Math.PI );
    const xrPlaneMaterial = new THREE.MeshBasicMaterial( { wireframe: true, side: THREE.DoubleSide } );
    this.xrPlaneObject = new THREE.Mesh( xrPlaneGeometry, xrPlaneMaterial );
    this.scene.add( this.xrPlaneObject )
  }

  private onSessionEnded() {
    if(!this.currentSession) return
    this.currentSession.removeEventListener('end', this.onSessionEnded)
    this.currentSession = null
  }

  private onXRFrame(_, frame: THREE.XRFrame) {
    this.session = frame.session
    let pose: THREE.XRViewerPose | undefined
    if(this.xrRefSpace) {
      pose = frame.getViewerPose(this.xrRefSpace)
    }

    if(this.xrHitTestSource && pose && this.xrRefSpace) {
      let hitTestResults = frame.getHitTestResults(this.xrHitTestSource)
      if(hitTestResults.length > 0) {
        let pose = hitTestResults[0].getPose(this.xrRefSpace)
        pose && this.handleController(pose.transform.matrix, pose.transform.position)
        if(pose && this.xrPlaneObject) {
          this.xrPlaneObject.position.set(
            pose.transform.position.x,
            pose.transform.position.y,
            pose.transform.position.z
          )
          this.xrPlaneObject.quaternion.set(
            pose.transform.orientation.x,
            pose.transform.orientation.y,
            pose.transform.orientation.z,
            pose.transform.orientation.w
          )
          this.xrPlaneObject.updateMatrix()
        }
      }
    }

    this.session.requestAnimationFrame((_, frame) => this.onXRFrame(_, frame))
  }

  private handleController(matrix, position) {
    const controller = this.renderer.xr.getController(0)
    if(!controller.userData.isSelecting) return

    const mesh = this.makeArrow(Math.floor(Math.random() * 0xffffff), matrix)
    mesh.position.set(
      position.x,
      position.y,
      position.z
    )
    this.scene.add(mesh)
    controller.userData.isSelecting = false
  }

  private makeArrow(color, matrix) {
    // const geometry = new THREE.BufferGeometry()
    // geometry.setAttribute('position', new THREE.BufferAttribute(matrix, 4))
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
}

export default WebXR
