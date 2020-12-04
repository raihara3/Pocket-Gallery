import * as THREE from 'three'
import PictureFrame from './PictureFrame'

enum PlaneType {
  Floor,
  WallLeft,
  WallRight,
  WallBack
}

class Gallery {
  planeWidth: number
  planeHeight: number
  planeSegment: number

  constructor() {
    this.planeWidth = 0.2
    this.planeHeight = 0.2
    this.planeSegment = 0.2
  }

  createRoom() {
    const mesh = new THREE.Group()
    mesh.add(
      this.createPlane(PlaneType.Floor),
      this.createPlane(PlaneType.WallRight),
      this.createPlane(PlaneType.WallBack)
    )

    const pictureFrame = new PictureFrame(this.planeWidth, this.planeHeight)
    mesh.add(
      pictureFrame.create(
        PlaneType.WallBack,
        this.getPosition(PlaneType.WallBack),
        this.getRotation(PlaneType.WallBack),
        'left'
      ),
      pictureFrame.create(
        PlaneType.WallBack,
        this.getPosition(PlaneType.WallBack),
        this.getRotation(PlaneType.WallBack),
        'right'
      ),
      pictureFrame.create(
        PlaneType.WallRight,
        this.getPosition(PlaneType.WallRight),
        this.getRotation(PlaneType.WallRight),
        'left'
      ),
      pictureFrame.create(
        PlaneType.WallRight,
        this.getPosition(PlaneType.WallRight),
        this.getRotation(PlaneType.WallRight),
        'right'
      ),
    )
    return mesh
  }

  private getPosition(type: PlaneType) {
    switch(type) {
      case PlaneType.WallLeft:
        return {
          x: -(this.planeWidth/2),
          y: this.planeHeight/2,
          z: 0
        }
      case PlaneType.WallRight:
        return {
          x: this.planeWidth/2,
          y: this.planeHeight/2,
          z: 0
        }
      case PlaneType.WallBack:
        return {
          x: 0,
          y: this.planeHeight/2,
          z: -(this.planeWidth/2)
        }
      case PlaneType.Floor:
      default:
        return {
          x: 0,
          y: 0,
          z: 0
        }
    }
  }

  private getRotation(type: PlaneType) {
    switch(type) {
      case PlaneType.WallLeft:
        return {
          x: 0,
          y: Math.PI / 2,
          z: 0
        }
      case PlaneType.WallRight:
        return {
          x: 0,
          y: -(Math.PI / 2),
          z: 0
        }
      case PlaneType.Floor:
      case PlaneType.WallBack:
      default:
        return {
          x: 0,
          y: 0,
          z: 0
        }
    }
  }

  private createPlane(type: PlaneType) {
    const planeGeometry = new THREE.PlaneGeometry(this.planeWidth, this.planeHeight, this.planeSegment)
    type === PlaneType.Floor && planeGeometry.rotateX(-0.5 * Math.PI)
    const material = this.getMaterial(type)
    const mesh = new THREE.Mesh(planeGeometry, material)

    const position = this.getPosition(type)
    const rotation = this.getRotation(type)
    mesh.position.set(position.x, position.y, position.z)
    mesh.rotation.set(rotation.x, rotation.y, rotation.z)
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
