require("./styles/app.css");

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import camera from './camera';
import collision from './collision';
import { controlMesh, removeControl } from './controls';
import getIModel from './meshes/I';
import getLMesh from './meshes/L';
import getTMesh from './meshes/T';
import { getSpotLight } from './light';
import getPlane from './plane';
import ObjectsCount from './objectsCount';
import renderer from './renderer';
import scene from './scene';
import stats from './stats';
import { checkAndClearLines } from './lineClearing';

document.body.appendChild(stats.domElement);

const DEG_TO_RAD = Math.PI / 180;
const GAME_TICK_INTERVAL = 1000; // milliseconds between piece drops

setLights();
const objectsCount = new ObjectsCount();

const collidableMeshList = [];
let currentElement = createNewElement();

const interval = setInterval(down, GAME_TICK_INTERVAL);

function down() {
	if (currentElement.element.position.y > 0 && !collision(currentElement.element, collidableMeshList, scene)) {
		currentElement.element.position.y -= 1;
	} else {
		// Piece has landed - add to collidable list
		collidableMeshList.push(currentElement.element);
		removeControl(currentElement.listener);

		// Check and clear completed lines
		const linesCleared = checkAndClearLines(collidableMeshList, scene);
		if (linesCleared > 0) {
			console.log(`Cleared ${linesCleared} line(s)!`);
		}

		// Create next piece
		currentElement = createNewElement();

		// Check for game over
		if (collision(currentElement.element, collidableMeshList, scene)) {
			// Game over! New piece spawned in collision
			clearInterval(interval);
			alert('Game Over!');
		}
	}
}

const plane = getPlane();
plane.rotation.x = 90 * DEG_TO_RAD;
plane.position.y = 0;
scene.add(plane);

camera.position.z = 15; // to avoid camera being into the cube at 0 0 0
camera.position.y = 20;

const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.enableDamping = true;
orbitControls.dampingFactor = 0.05;

(function render() {
	orbitControls.update();

	stats.begin();
	renderer.render(scene, camera);
	stats.end();
	requestAnimationFrame(render);
})();

// Cleanup interval on page unload to prevent memory leak
window.addEventListener('beforeunload', () => {
	clearInterval(interval);
});

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
	const listener = controlMesh(newElement, collidableMeshList, scene);

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
