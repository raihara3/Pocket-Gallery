import * as THREE from 'three'
import WebXR from './WebXR'

class ARButton {
  renderer: THREE.WebGLRenderer
  scene: THREE.Scene
  sessionInit?: any
  button: HTMLButtonElement

  constructor(renderer, scene, sessionInit = {}) {
    this.renderer = renderer
    this.scene = scene
    this.sessionInit = sessionInit
    this.button = document.createElement('button')
  }

  async createButton() {
    if('xr' in navigator === false) {
      const message = document.createElement('a')
      message.classList.add('not-available')
      message.href = 'https://immersiveweb.dev/'
      message.innerHTML = 'WEBXR NOT AVAILABLE'
      return message
    }

    this.button.classList.add('ar-button')
    // this.button.style.display = 'none'
    this.button.textContent = 'START AR'
    const isSupported = await WebXR.isSupported()
    if(!isSupported) return this.button

    const webXR = new WebXR(
      this.renderer,
      this.sessionInit,
      this.scene
    )
    this.button.onclick = () => webXR.setSession()
    return this.button
  }
}

export default ARButton