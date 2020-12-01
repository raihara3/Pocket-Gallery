import * as THREE from 'three'

enum FrameType {
  Left,
  Top,
  Right,
  Bottom
}

class PictureFrame {
  width: number
  height: number

  constructor(width, height) {
    this.width = width
    this.height = height
  }

  create() {
    const mesh = new THREE.Group()
  }

  private createPictureFrame() {
    const mesh = new THREE.Group()
    const picture = this.createPicture()
    const frame = this.createFrame()
    mesh.add()
  }

  private createPicture() {
    const planeGeometry = new THREE.PlaneGeometry(this.width, this.height)
    const loader = new THREE.TextureLoader()
    const material = new THREE.MeshStandardMaterial({
      map: loader.load('/images/koten_03.jpg')
    })
    return new THREE.Mesh(planeGeometry, material)
  }

  private createFrame(type: FrameType) {
    const boxGeometry = new THREE.BoxGeometry()
    switch (type) {
      case FrameType.Left:
      case FrameType.Top:
        boxGeometry.parameters.width = this.width / 10
        boxGeometry.parameters.height = this.height
        break
      case FrameType.Top:
      case FrameType.Bottom:
        boxGeometry.parameters.width = this.width
        boxGeometry.parameters.height = this.width / 10
        break
    }
    const loader = new THREE.TextureLoader()
    const material = new THREE.MeshStandardMaterial({
      map: loader.load('/images/frame.jpg')
    })
    return new THREE.Mesh(boxGeometry, material)
  }
}

export default PictureFrame
