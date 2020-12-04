import * as THREE from 'three'

enum PlaneType {
  Floor,
  WallLeft,
  WallRight,
  WallBack
}

// enum FrameType {
//   Left,
//   Top,
//   Right,
//   Bottom
// }

class PictureFrame {
  width: number
  height: number
  parentWidth: number
  parentHeight: number

  constructor(parentWidth, parentHeight) {
    this.width = 0.05
    this.height = 0.05
    this.parentWidth = parentWidth
    this.parentHeight = parentHeight
  }

  create(type: PlaneType, position: any, rotation: any, placement: 'left' | 'right') {
    const mesh = new THREE.Group()
    mesh.add(
      this.createPicture(type, placement)
    )

    const ajustment = placement === 'left' ? -1 : 1
    switch(type) {
      case PlaneType.WallBack:
        mesh.position.set(
          (this.parentWidth / 5) * ajustment,
          position.y,
          position.z + 0.001
        )
        break
      case PlaneType.WallRight:
        mesh.position.set(
          position.x - 0.001,
          position.y,
          (this.parentWidth / 5) * ajustment
        )
        break
    }

    mesh.rotation.set(
      rotation.x,
      rotation.y,
      rotation.z
    )
    return mesh
  }

  // private createPictureFrame() {
  //   const mesh = new THREE.Group()
  //   const picture = this.createPicture()
  //   const frame = this.createFrame()
  //   mesh.add()
  // }

  private createPicture(type: PlaneType, placement: 'left' | 'right') {
    const planeGeometry = new THREE.PlaneGeometry(this.width, this.height)
    const loader = new THREE.TextureLoader()

    const image = this.getImage(type, placement)
    const material = new THREE.MeshStandardMaterial({
      map: loader.load(image)
    })
    return new THREE.Mesh(planeGeometry, material)
  }

  private getImage(type: PlaneType, placement: 'left' | 'right') {
    switch(type) {
      case PlaneType.WallBack:
        return placement === 'left'
          ? '/images/koten_01.jpg'
          : '/images/koten_02.jpg'
      case PlaneType.WallRight:
        return placement === 'left'
          ? '/images/koten_03.jpg'
          : '/images/koten_04.jpg'
    }
    return ''
  }

  // private createFrame(type: FrameType) {
  //   const boxGeometry = new THREE.BoxGeometry()
  //   switch (type) {
  //     case FrameType.Left:
  //     case FrameType.Top:
  //       boxGeometry.parameters.width = this.width / 10
  //       boxGeometry.parameters.height = this.height
  //       break
  //     case FrameType.Top:
  //     case FrameType.Bottom:
  //       boxGeometry.parameters.width = this.width
  //       boxGeometry.parameters.height = this.width / 10
  //       break
  //   }
  //   const loader = new THREE.TextureLoader()
  //   const material = new THREE.MeshStandardMaterial({
  //     map: loader.load('/images/frame.jpg')
  //   })
  //   return new THREE.Mesh(boxGeometry, material)
  // }
}

export default PictureFrame
