require("./styles/app.css");

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';
import camera from './camera';
import collision, { isBelowFloor } from './collision';
import { GAME_CONFIG } from './config';
import { controlMesh, removeControl } from './controls';
import getIModel from './meshes/I';
import getLMesh from './meshes/L';
import getJMesh from './meshes/J';
import getTMesh from './meshes/T';
import getOMesh from './meshes/O';
import getSMesh from './meshes/S';
import getZMesh from './meshes/Z';
import { getSpotLight, getAmbientLight } from './light';
import getPlane from './plane';
import renderer from './renderer';
import scene from './scene';
import stats from './stats';
import { checkAndClearLines } from './lineClearing';
import { createBoundaries } from './boundaries';
import { ScoreManager } from './scoreManager';
import { ScoreUI } from './scoreUI';
import { GameOverUI } from './gameOverUI';

document.body.appendChild(stats.domElement);

// Add VR button
document.body.appendChild(VRButton.createButton(renderer));
renderer.xr.enabled = true;

// Initialize scoring system
const scoreManager = new ScoreManager();
const scoreUI = new ScoreUI();
scoreUI.update(scoreManager.getStats());

// Initialize game over UI with restart callback
const gameOverUI = new GameOverUI(() => restartGame());

const DEG_TO_RAD = Math.PI / 180;
const GAME_TICK_INTERVAL = 1000; // milliseconds between piece drops

setLights();

const collidableMeshList = [];
let currentElement = createNewElement();

let interval = setInterval(down, GAME_TICK_INTERVAL);

function down() {
	// Try to move down
	const currentY = currentElement.element.position.y;
	currentElement.element.position.y -= 1;

	// Check if the new position is valid (not below floor and no collision)
	const belowFloor = isBelowFloor(currentElement.element);
	const hasCollision = collision(currentElement.element, collidableMeshList, scene);

	if (belowFloor || hasCollision) {
		// Can't move down - revert and land the piece
		currentElement.element.position.y = currentY;

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
			scoreManager.addRowScore(linesCleared);
			scoreUI.update(scoreManager.getStats());
			scoreUI.flash('currentScore');
		}

		// Create next piece
		currentElement = createNewElement();

		// Check for game over - only if new piece immediately collides at spawn
		const spawnsInCollision = collision(currentElement.element, collidableMeshList, scene);

		if (spawnsInCollision) {
			// Game over! New piece spawned in collision
			clearInterval(interval);
			removeControl(currentElement.listener);

			// Show game over UI with final stats
			gameOverUI.show(scoreManager.getStats());
		}
	}
}

const plane = getPlane();
plane.rotation.x = 90 * DEG_TO_RAD;
plane.position.y = -0.5; // Floor below lowest blocks (blocks at Y=0 have bottoms at -0.5)
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
	const elementsCreationFunctions = [getIModel, getLMesh, getJMesh, getTMesh, getOMesh, getSMesh, getZMesh];
	const elementNumber = Math.floor(Math.random() * elementsCreationFunctions.length);
	const newElement = elementsCreationFunctions[elementNumber]();
	newElement.position.y = 10;
	scene.add(newElement);
	const listener = controlMesh(newElement, collidableMeshList, scene);

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

function restartGame() {
	// Clear all placed pieces from the scene
	collidableMeshList.forEach(mesh => {
		scene.remove(mesh);
	});
	collidableMeshList.length = 0; // Clear the array

	// Remove current element if it exists
	if (currentElement && currentElement.element) {
		removeControl(currentElement.listener);
		scene.remove(currentElement.element);
	}

	// Reset score manager
	scoreManager.resetGame();
	scoreUI.update(scoreManager.getStats());

	// Create new piece
	currentElement = createNewElement();

	// Restart game interval
	interval = setInterval(down, GAME_TICK_INTERVAL);
}
