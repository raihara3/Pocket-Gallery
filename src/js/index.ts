import CreateScene, { renderer } from './CreateScene'

class WebAR {
  static mode = 'immersive-ar'

  async supportedCheck() {
    const supported = await navigator['xr'].isSessionSupported(WebAR.mode)
    if(!supported) {
      console.error(`WebXR support: ${supported}`)
    }
    return supported
  }

  async requestSession() {
    CreateScene()

    const session = await navigator['xr'].requestSession(WebAR.mode)
    renderer.xr.setReferenceSpaceType('local')
    renderer.xr.setSession(session)
  }
}

const webXR = new WebAR()

const startWebXR = () => {
  console.debug('webXR start')
  webXR.requestSession()
}

const app = async() => {
  const supported = await webXR.supportedCheck()

  const startButton: HTMLButtonElement = <HTMLButtonElement> document.getElementById('start-button')
  if(!supported) {
    startButton.disabled = true
    return
  }
  startButton.addEventListener('click', startWebXR)
}

app()
