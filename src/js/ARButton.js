import * as THREE from 'three';
import { MathUtils } from 'three';
import { convertTypeAcquisitionFromJson } from 'typescript';

let xrHitTestSource = null
let xrRefSpace = null
let scene = null

class ARButton {

	static createButton( renderer, sessionInit = {}, hoge ) {
		scene = hoge

		const button = document.createElement( 'button' );

		function showStartAR( /*device*/ ) {

			let currentSession = null;

			function onSessionStarted( session ) {

				session.addEventListener( 'end', onSessionEnded );

				// session.addEventListener('select', (event) => {
				// 	handleController(renderer, scene)
				// })

				renderer.xr.setReferenceSpaceType( 'local' );
				renderer.xr.setSession( session );
				button.textContent = 'STOP AR';

				currentSession = session;

			}

			function onSessionEnded( /*event*/ ) {

				currentSession.removeEventListener( 'end', onSessionEnded );

				button.textContent = 'START AR';

				currentSession = null;

			}

			//

			button.style.display = '';

			button.style.cursor = 'pointer';
			button.style.left = 'calc(50% - 50px)';
			button.style.width = '100px';

			button.textContent = 'START AR';

			button.onmouseenter = function () {

				button.style.opacity = '1.0';

			};

			button.onmouseleave = function () {

				button.style.opacity = '0.5';

			};

			button.onclick = async function () {

				if ( currentSession === null ) {

					const session = await navigator.xr.requestSession( 'immersive-ar', sessionInit )
					onSessionStarted(session)

					session.requestReferenceSpace('viewer').then((refSpace) => {
						session.requestHitTestSource({ space: refSpace }).then((hitTestSource) => {
							xrHitTestSource = hitTestSource;
						});
					});

					session.requestReferenceSpace('local').then((refSpace) => {
						xrRefSpace = refSpace;
						session.requestAnimationFrame(onXRFrame);
					});

				} else {

					currentSession.end();

				}

			};

		}

		function onXRFrame(t, frame) {
			let session = frame.session;
			let pose = frame.getViewerPose(xrRefSpace);

			// reticle.visible = false;

			// If we have a hit test source, get its results for the frame
			// and use the pose to display a reticle in the scene.
			if (xrHitTestSource && pose) {
				let hitTestResults = frame.getHitTestResults(xrHitTestSource);
				if (hitTestResults.length > 0) {
					let pose = hitTestResults[0].getPose(xrRefSpace);
					handleController(renderer, scene, pose.transform.matrix)
					// reticle.visible = true;
					// reticle.matrix = pose.transform.matrix;
				}
			}

			// scene.startFrame();

			session.requestAnimationFrame(onXRFrame);

			// scene.drawXRFrame(frame, pose);

			// scene.endFrame();
		}

		function disableButton() {

			button.style.display = '';

			button.style.cursor = 'auto';
			button.style.left = 'calc(50% - 75px)';
			button.style.width = '150px';

			button.onmouseenter = null;
			button.onmouseleave = null;

			button.onclick = null;

		}

		function showARNotSupported() {

			disableButton();

			button.textContent = 'AR NOT SUPPORTED';

		}

		function stylizeElement( element ) {

			element.style.position = 'absolute';
			element.style.bottom = '20px';
			element.style.padding = '12px 6px';
			element.style.border = '1px solid #fff';
			element.style.borderRadius = '4px';
			element.style.background = 'rgba(0,0,0,0.1)';
			element.style.color = '#fff';
			element.style.font = 'normal 13px sans-serif';
			element.style.textAlign = 'center';
			element.style.opacity = '0.5';
			element.style.outline = 'none';
			element.style.zIndex = '999';

		}

		if ( 'xr' in navigator ) {

			button.id = 'ARButton';
			button.style.display = 'none';

			stylizeElement( button );

			navigator.xr.isSessionSupported( 'immersive-ar' ).then( function ( supported ) {

				supported ? showStartAR() : showARNotSupported();

			} ).catch( showARNotSupported );

			return button;

		} else {

			const message = document.createElement( 'a' );

			if ( window.isSecureContext === false ) {

				message.href = document.location.href.replace( /^http:/, 'https:' );
				message.innerHTML = 'WEBXR NEEDS HTTPS'; // TODO Improve message

			} else {

				message.href = 'https://immersiveweb.dev/';
				message.innerHTML = 'WEBXR NOT AVAILABLE';

			}

			message.style.left = 'calc(50% - 90px)';
			message.style.width = '180px';
			message.style.textDecoration = 'none';

			stylizeElement( message );

			return message;

		}

	}

}

export { ARButton };

function handleController(renderer, scene, matrix) {
	const controller = renderer.xr.getController(0);
  if (!controller.userData.isSelecting) return;

  const mesh = makeArrow(Math.floor(Math.random() * 0xffffff), matrix)

  // 5. コントローラーのposition, rotationプロパティを使用して
  //    AR空間内での端末の姿勢を取得し、メッシュに適用する
  // mesh.position.copy(controller.position)
  // mesh.rotation.copy(controller.rotation)

  scene.add(mesh)

  controller.userData.isSelecting = false
}

function makeArrow(color, matrix) {
  const geometry = new THREE.ConeGeometry(0.03, 0.1, 32)
  const material = new THREE.MeshStandardMaterial({
    color: color,
    roughness: 0.9,
    metalness: 0.0,
    side: THREE.DoubleSide
	});

	const localMesh = new THREE.Mesh(geometry, material);
	localMesh.rotation.x = -Math.PI / 2
  const mesh = new THREE.Group()
	mesh.add(localMesh)

	const m = new THREE.Matrix4().set(matrix)
	mesh.matrix.set(m)
	// mesh.position.set(0, 0, -1)
	console.log(mesh)
  return mesh
}
