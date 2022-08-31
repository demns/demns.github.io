require("./styles/app.css");

import * as OrbitControls from 'three-orbit-controls';
import { Object3D } from 'three';
import * as Three from 'three';
import * as VRControls from 'three-vrcontrols';
import VREffect from 'three-vreffects';

import * as webvrui from 'webvr-ui';
import * as webvrPolyfill from 'webvr-polyfill';
import camera from './camera';
import collision from './collision';
import { controlCamera, controlMesh, removeControl } from './controls';
import Cube from './cube';
import getIModel from './meshes/I';
import getLMesh from './meshes/L';
import getTMesh from './meshes/T';
import { getSpotLight } from './light';
import getPlane from './plane';
import ObjectsCount from './objectsCount';
import renderer from './renderer';
import scene from './scene';
import stats from './stats';
import { height, width } from './config';
import { WebVRConfig } from './webVRConfig';

window.WebVRConfig = WebVRConfig;

document.body.appendChild(stats.domElement);

setLights();
const objectsCount = new ObjectsCount();

let currentElement = createNewElement();
const collidableMeshList = [];

const interval = setInterval(down, 1000);

function down() {
	if (currentElement.element.position.y > 0 && !collision(currentElement.element, collidableMeshList, scene)) {
		currentElement.element.position.y -= 1;
	} else {
		collidableMeshList.push(currentElement.element);
		removeControl(currentElement.listener);
		currentElement = createNewElement();
	}
}

const plane = getPlane();
plane.rotation.x = 90 * (Math.PI / 180);
plane.position.y = 0;
scene.add(plane);

camera.position.z = 15; // to avoid camera being into the cube at 0 0 0
camera.position.y = 20;

const enterVR = new webvrui.EnterVRButton(renderer.domElement, {});
document.body.appendChild(enterVR.domElement);

const Controls = OrbitControls(Three);
var orbitControls =  new Controls(camera);

// Store the position of the VR HMD in a dummy camera.
var fakeCamera = new Object3D();
var VrControls = new VRControls(Three);
var vrControls = new VrControls(fakeCamera);
var vrEffect = new VREffect(Three, renderer, function () {});

(function render() {
	orbitControls.update();
	vrControls.update();

	// Temporarily save the orbited camera position
	var orbitPos = camera.position.clone();
	var rotatedPosition = fakeCamera.position.applyQuaternion(
		camera.quaternion);
	camera.position.add(rotatedPosition);
	camera.quaternion.multiply(fakeCamera.quaternion);

	vrEffect.render(scene, camera);

	// Restore the orbit position, so that the OrbitControls can
	// pickup where it left off.
	camera.position.copy(orbitPos);

	stats.begin();
	renderer.render(scene, camera);
	stats.end();
	requestAnimationFrame(render);
})();

function setLights() {
	const light = getSpotLight();
	light.position.x = 5;
	light.position.y = 10;
	scene.add(light);

	const light2 = getSpotLight();
	light2.position.x = -5;
	light2.position.y = 10;
	scene.add(light2);

	const light3 = getSpotLight();
	light3.position.z = 5;
	light3.position.y = 10;
	scene.add(light3);
}

function createNewElement() {
	const elementsCreationFunctions = [getIModel, getLMesh, getTMesh];
	const elementNumber = Math.floor(Math.random() * elementsCreationFunctions.length);
	const newElement = elementsCreationFunctions[elementNumber]();
	newElement.position.y = 10;
	scene.add(newElement);
	const listener = controlMesh(newElement);

	objectsCount.increment();

	return {
		listener: listener,
		element: newElement
	};
}

window.addEventListener('resize', onWindowResize, false);
function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}