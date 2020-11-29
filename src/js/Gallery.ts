import * as THREE from 'three'

class Gallery {
  constructor() {}

  createRoom() {
    const mesh = new THREE.Group()
    const floor = this.createFloor()
    const wallLeft = this.createWallLeft()
    const wallRight = this.createWallRight()
    const wallBack = this.createWallBack()
    mesh.add(floor, wallLeft, wallRight, wallBack)
    return mesh
  }

  private createFloor() {
    const planeGeometry = new THREE.PlaneGeometry(0.1, 0.1, 0.1)
    planeGeometry.rotateX(-0.5 * Math.PI)
    const material = new THREE.MeshBasicMaterial({
      color: 0xffff00
    })
    const floor = new THREE.Mesh(planeGeometry, material)
    floor.position.set(0, 0, 0)
    return floor
  }

  private createWallLeft() {
    const planeGeometry = new THREE.PlaneGeometry(0.1, 0.1, 0.1)
    const material = new THREE.MeshBasicMaterial({
      color: 0xffffff
    })
    const wallLeft = new THREE.Mesh(planeGeometry, material)
    wallLeft.position.set(-0.05, 0.05, 0)
    wallLeft.rotation.set(0, Math.PI / 2, 0)
    return wallLeft
  }

  private createWallRight() {
    const planeGeometry = new THREE.PlaneGeometry(0.1, 0.1, 0.1)
    const material = new THREE.MeshBasicMaterial({
      color: 0xffffff
    })
    const wallRight = new THREE.Mesh(planeGeometry, material)
    wallRight.position.set(0.05, 0.05, 0)
    wallRight.rotation.set(0, -Math.PI / 2, 0)
    return wallRight
  }

  private createWallBack() {
    const planeGeometry = new THREE.PlaneGeometry(0.1, 0.1, 0.1)
    const material = new THREE.MeshBasicMaterial({
      color: 0xffffff
    })
    const wallBack = new THREE.Mesh(planeGeometry, material)
    wallBack.position.set(0, 0.05, -0.05)
    wallBack.rotation.set(0, 0, 0)
    return wallBack
  }
}

export default Gallery
