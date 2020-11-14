class WebXR {
  async supportedCheck() {
    const supported = await navigator['xr'].isSessionSupported('immersive-ar')
    if(!supported) {
      console.error(`WebXR support: ${supported}`)
    }
    return supported
  }
}

const startWebXR = () => {
  console.log('start')
}

const app = async() => {
  const webXR = new WebXR()
  const supported = await webXR.supportedCheck()

  const startButton: HTMLButtonElement = <HTMLButtonElement> document.getElementById('start-button')
  if(!supported) {
    startButton.disabled = true
    return
  }
  startButton.addEventListener('click', startWebXR)
}

app()
