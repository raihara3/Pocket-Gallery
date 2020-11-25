import XR from './Navigator'

class WebXR {

  static isSupported() {
    return XR.isSessionSupported('immersive-ar')
  }
}

export default WebXR
