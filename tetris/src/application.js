require("./styles/app.css");

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';
import camera from './camera';
import collision, { isBelowFloor } from './collision';
import { GAME_CONFIG } from './config';
import { controlMesh, removeControl } from './controls';
import getIModel from './meshes/I';
import getLMesh from './meshes/L';
import getTMesh from './meshes/T';
import { getSpotLight, getAmbientLight } from './light';
import getPlane from './plane';
import ObjectsCount from './objectsCount';
import renderer from './renderer';
import scene from './scene';
import stats from './stats';
import { checkAndClearLines } from './lineClearing';
import { createBoundaries } from './boundaries';
import { ScoreManager } from './scoreManager';
import { ScoreUI } from './scoreUI';

document.body.appendChild(stats.domElement);

// Add VR button
document.body.appendChild(VRButton.createButton(renderer));
renderer.xr.enabled = true;

// Initialize scoring system
const scoreManager = new ScoreManager();
const scoreUI = new ScoreUI();
scoreUI.update(scoreManager.getStats());

const DEG_TO_RAD = Math.PI / 180;
const GAME_TICK_INTERVAL = 1000; // milliseconds between piece drops

setLights();
const objectsCount = new ObjectsCount();

const collidableMeshList = [];
let currentElement = createNewElement();

const interval = setInterval(down, GAME_TICK_INTERVAL);

function down() {
	// Try to move down
	const currentY = currentElement.element.position.y;
	currentElement.element.position.y -= 1;

	// Check if the new position is valid (not below floor and no collision)
	const belowFloor = isBelowFloor(currentElement.element);
	const hasCollision = collision(currentElement.element, collidableMeshList, scene);

	console.log(`Down tick: currentY=${currentY}, newY=${currentElement.element.position.y}, belowFloor=${belowFloor}, collision=${hasCollision}`);

	if (belowFloor || hasCollision) {
		// Can't move down - revert and land the piece
		currentElement.element.position.y = currentY;
		console.log(`LANDED at Y=${currentElement.element.position.y}`);

		// Add to collidable list
		collidableMeshList.push(currentElement.element);
		removeControl(currentElement.listener);

		// Increment pieces counter and update UI
		scoreManager.incrementPieces();
		scoreUI.update(scoreManager.getStats());
		scoreUI.flash('piecesPlaced');

		// Check and clear completed lines
		const linesCleared = checkAndClearLines(collidableMeshList, scene);
		if (linesCleared > 0) {
			const points = scoreManager.addRowScore(linesCleared);
			console.log(`Cleared ${linesCleared} line(s) for ${points} points!`);
			scoreUI.update(scoreManager.getStats());
			scoreUI.flash('currentScore');
		}

		// Create next piece
		currentElement = createNewElement();

		// Check for game over - only if new piece immediately collides at spawn
		// This means the stack has reached the spawn height
		const spawnsInCollision = collision(currentElement.element, collidableMeshList, scene);
		console.log(`New piece spawned at Y=${currentElement.element.position.y}, collision=${spawnsInCollision}, collidableCount=${collidableMeshList.length}`);

		// Detailed debug: check positions of all pieces
		if (spawnsInCollision) {
			console.log('COLLISION DETECTED AT SPAWN! Piece positions:');
			console.log(`New piece Y: ${currentElement.element.position.y}`);
			collidableMeshList.forEach((piece, idx) => {
				console.log(`Piece ${idx}: Y=${piece.position.y}, X=${piece.position.x}`);
			});
		}

		if (spawnsInCollision) {
			// Game over! New piece spawned in collision
			clearInterval(interval);
			removeControl(currentElement.listener);
			console.log('Game Over! Stack reached spawn height.');
			alert('Game Over!');
		}
	}
}

const plane = getPlane();
plane.rotation.x = 90 * DEG_TO_RAD;
plane.position.y = 0;
scene.add(plane);

// Add boundary walls
const boundaries = createBoundaries();
boundaries.forEach(boundary => scene.add(boundary));

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
	// Add ambient light for overall illumination
	const ambient = getAmbientLight();
	scene.add(ambient);

	// Add spotlights for dramatic effect - pointing at the play area center
	const light = getSpotLight();
	light.position.set(5, 10, 5);
	light.target.position.set(0, 5, 0); // Point at middle of play area
	scene.add(light);
	scene.add(light.target);

	const light2 = getSpotLight();
	light2.position.set(-5, 10, -5);
	light2.target.position.set(0, 5, 0);
	scene.add(light2);
	scene.add(light2.target);

	const light3 = getSpotLight();
	light3.position.set(0, 15, 0);
	light3.target.position.set(0, 5, 0);
	scene.add(light3);
	scene.add(light3.target);
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
