import * as THREE from 'three'
import SettingAR, { renderer, scene, camera, controller } from './SettingAR'

const setImage = () => {
  const loader = new THREE.TextureLoader();
  var geometry = new THREE.PlaneGeometry( 1, 1, 1 );
  var material = new THREE.MeshBasicMaterial({
    color: 0xFFFFFF,
    map: loader.load('images/koten_02.jpg'),
  })
  var plane = new THREE.Mesh( geometry, material )
  plane.position.copy({x: 0, y: 0, z: -1})
  plane.rotation.copy(controller.rotation)
  scene.add( plane )
}

navigator.xr.isSessionSupported('immersive-ar').then(supported => {
  const startButton = document.getElementById('start-button')

  if(!supported) {
    // alert('対応してないよ')
    startButton.classList.add('disable')
    return
  }

  startButton.addEventListener('click', () => {
    SettingAR()
    const onSessionStarted = (session) => {
      renderer.xr.setReferenceSpaceType('local')
      renderer.xr.setSession(session);
    }
    navigator.xr.requestSession('immersive-ar').then(onSessionStarted)

    setImage()
  })
})
