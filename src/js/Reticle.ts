import * as THREE from 'three'

class Reticle {
  reticle: THREE.Mesh | null
  display: boolean

  constructor() {
    this.reticle = null
    this.display = false
  }

  create() {
    const ringGeometry = new THREE.RingGeometry(0.03, 0.05, 50)
    ringGeometry.rotateX(-0.5 * Math.PI)
    const material = new THREE.MeshBasicMaterial({color: 0xffff00, side: THREE.DoubleSide})
    this.reticle = new THREE.Mesh(ringGeometry, material)
    this.reticle.name = 'reticle'
    this.display = true
    return this.reticle
  }

  updateMatrix(pose: THREE.XRPose) {
    if(!this.reticle) return
    this.reticle.position.set(
      pose.transform.position.x,
      pose.transform.position.y,
      pose.transform.position.z
    )
    this.reticle.quaternion.set(
      pose.transform.orientation.x,
      pose.transform.orientation.y,
      pose.transform.orientation.z,
      pose.transform.orientation.w
    )
    this.reticle.updateMatrix()
  }

  remove(scene: THREE.Scene) {
    const reticle = scene.getObjectByName('reticle')
    reticle && scene.remove(reticle)
    this.display = false
  }
}

export default Reticle
