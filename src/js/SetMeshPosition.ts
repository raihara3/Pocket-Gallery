import * as THREE from 'three'

class SetMeshPosition {
  transform: THREE.XRRigidTransform

  constructor(transform) {
    this.transform = transform
  }

  set(mesh, rotateY = 0, ajustment = {x:0, y:0, z:0}) {
    mesh.position.set(
      this.transform.position.x + ajustment.x,
      this.transform.position.y + ajustment.y,
      this.transform.position.z + ajustment.z
    )
    mesh.quaternion.set(
      this.transform.orientation.x,
      this.transform.orientation.y,
      this.transform.orientation.z,
      this.transform.orientation.w
    )
    mesh.rotateY(rotateY)
    return mesh
  }
}

export default SetMeshPosition
