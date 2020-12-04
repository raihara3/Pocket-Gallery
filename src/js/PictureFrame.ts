import * as THREE from 'three'

enum PlaneType {
  Floor,
  WallLeft,
  WallRight,
  WallBack
}

class PictureFrame {
  width: number
  height: number
  parentWidth: number
  parentHeight: number
  type: PlaneType | null
  position: any
  rotation: any
  placement: 'left' | 'right'

  constructor(parentWidth, parentHeight) {
    this.width = 0.05
    this.height = 0.05
    this.parentWidth = parentWidth
    this.parentHeight = parentHeight
    this.type = null
    this.position = {}
    this.rotation = {}
    this.placement = 'left'
  }

  create(type: PlaneType, position: any, rotation: any, placement: 'left' | 'right') {
    const mesh = new THREE.Group()
    mesh.add(
      this.createPicture(type, placement),
      this.createFrame()
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

  private createFrame() {
    const mesh = new THREE.Group()
    const setMaterial = (geometry) => {
      const loader = new THREE.TextureLoader()
      const material = new THREE.MeshStandardMaterial({
        map: loader.load('/images/frame.jpg')
      })
      return new THREE.Mesh(geometry, material)
    }

    const depth = this.height / 20
    const top = new THREE.BoxGeometry(this.width, depth, depth)
    top.translate(0, this.height/2, 0)
    mesh.add(setMaterial(top))

    const right = new THREE.BoxGeometry(depth, this.height, depth)
    right.translate((this.width/2) - (depth/2), 0, 0)
    mesh.add(setMaterial(right))

    const bottom = new THREE.BoxGeometry(this.width, depth, depth)
    bottom.translate(0, -(this.height/2), 0)
    mesh.add(setMaterial(bottom))

    const left = new THREE.BoxGeometry(depth, this.height, depth)
    left.translate(-(this.width/2) + (depth/2), 0, 0)
    mesh.add(setMaterial(left))

    return mesh
  }
}

export default PictureFrame
