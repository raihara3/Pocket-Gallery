import * as THREE from 'three'

enum PlaneType {
  Floor,
  WallLeft,
  WallRight,
  wallBack
}

class Gallery {
  planeWidth: number
  planeHeight: number
  planeSegment: number

  constructor() {
    this.planeWidth = 0.1
    this.planeHeight = 0.1
    this.planeSegment = 0.1
  }

  createRoom() {
    const mesh = new THREE.Group()
    mesh.add(
      this.createPlane(PlaneType.Floor),
      // this.createPlane(PlaneType.WallLeft),
      this.createPlane(PlaneType.WallRight),
      this.createPlane(PlaneType.wallBack)
    )
    return mesh
  }

  private createPlane(type: PlaneType) {
    const planeGeometry = new THREE.PlaneGeometry(this.planeWidth, this.planeHeight, this.planeSegment)
    type === PlaneType.Floor && planeGeometry.rotateX(-0.5 * Math.PI)
    const material = this.getMaterial(type)
    const mesh = new THREE.Mesh(planeGeometry, material)

    switch(type) {
      case PlaneType.Floor:
        mesh.position.set(0, 0, 0)
        break
      case PlaneType.WallLeft:
        mesh.position.set(-(this.planeWidth/2), this.planeHeight/2, 0)
        mesh.rotation.set(0, Math.PI / 2, 0)
        mesh.receiveShadow = true
        mesh.castShadow = true
        break
      case PlaneType.WallRight:
        mesh.position.set(this.planeWidth/2, this.planeHeight/2, 0)
        mesh.rotation.set(0, -Math.PI / 2, 0)
        mesh.receiveShadow = true
        mesh.castShadow = true
        break
      case PlaneType.wallBack:
        mesh.position.set(0, this.planeHeight/2, -(this.planeWidth/2))
        mesh.rotation.set(0, 0, 0)
        mesh.receiveShadow = true
        mesh.castShadow = true
        break
    }
    return mesh
  }

  private getMaterial(type: PlaneType) {
    const loader = new THREE.TextureLoader()
    const texture = type === PlaneType.Floor
    ? loader.load('/images/floor.jpg')
    : loader.load('/images/wall.jpg')
    const material = new THREE.MeshStandardMaterial({
      map: texture
    })
    return material
  }
}

export default Gallery
