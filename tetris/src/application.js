require("./styles/app.css");

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';
import camera from './camera';
import collision, { isBelowFloor, isOutOfBounds } from './collision';
import { GAME_CONFIG } from './config';
import { controlMesh, removeControl } from './controls';
import getIModel from './meshes/I';
import getLMesh from './meshes/L';
import getJMesh from './meshes/J';
import getTMesh from './meshes/T';
import getOMesh from './meshes/O';
import getSMesh from './meshes/S';
import getZMesh from './meshes/Z';
import { getSpotLight, getAmbientLight, getPointLight, getHemisphereLight, getDirectionalLight } from './light';
import getPlane from './plane';
import renderer from './renderer';
import scene from './scene';
import stats from './stats';
import { checkAndClearLines } from './lineClearing';
import { createBoundaries } from './boundaries';
import { ScoreManager } from './scoreManager';
import { ScoreUI } from './scoreUI';
import { GameOverUI } from './gameOverUI';
import { createControlsUI, createMobileControls } from './controlsUI';

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

// Create controls UI
createControlsUI();

const DEG_TO_RAD = Math.PI / 180;
const GAME_TICK_INTERVAL = 1000; // milliseconds between piece drops

setLights();

const collidableMeshList = [];
let currentElement = createNewElement();

let interval = setInterval(down, GAME_TICK_INTERVAL);

// Setup mobile controls
setupMobileControls();

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
	// Hemisphere light for natural sky/ground lighting
	const hemiLight = getHemisphereLight();
	scene.add(hemiLight);

	// Soft ambient for base illumination
	const ambient = getAmbientLight();
	scene.add(ambient);

	// Main directional light (like sun)
	const dirLight = getDirectionalLight();
	dirLight.position.set(10, 25, 10);
	dirLight.target.position.set(0, 5, 0);
	scene.add(dirLight);
	scene.add(dirLight.target);

	// Dramatic spotlights for highlights and shadows
	const spotlight1 = getSpotLight();
	spotlight1.position.set(6, 18, 6);
	spotlight1.target.position.set(0, 10, 0);
	scene.add(spotlight1);
	scene.add(spotlight1.target);

	const spotlight2 = getSpotLight();
	spotlight2.position.set(-6, 18, -3);
	spotlight2.target.position.set(0, 10, 0);
	scene.add(spotlight2);
	scene.add(spotlight2.target);

	// Top key light
	const topLight = getSpotLight();
	topLight.position.set(0, 25, 2);
	topLight.target.position.set(0, 10, 0);
	scene.add(topLight);
	scene.add(topLight.target);

	// Point lights for vibrant fill and highlights
	const fillLight1 = getPointLight();
	fillLight1.position.set(10, 12, 4);
	scene.add(fillLight1);

	const fillLight2 = getPointLight();
	fillLight2.position.set(-10, 12, 4);
	scene.add(fillLight2);

	const fillLight3 = getPointLight();
	fillLight3.position.set(0, 15, 6);
	scene.add(fillLight3);
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

function setupMobileControls() {
	const mobileUI = createMobileControls();

	// Helper function to trigger movement
	function triggerMove(direction) {
		if (!currentElement || !currentElement.element) return;

		const mesh = currentElement.element;
		const oldX = mesh.position.x;
		const oldY = mesh.position.y;
		const oldRotation = mesh.rotation.z;

		switch(direction) {
			case 'left':
				mesh.position.x -= 1;
				if (isOutOfBounds(mesh) || collision(mesh, collidableMeshList, scene)) {
					mesh.position.x = oldX;
				}
				break;
			case 'right':
				mesh.position.x += 1;
				if (isOutOfBounds(mesh) || collision(mesh, collidableMeshList, scene)) {
					mesh.position.x = oldX;
				}
				break;
			case 'down':
				mesh.position.y -= 1;
				if (isBelowFloor(mesh) || collision(mesh, collidableMeshList, scene)) {
					mesh.position.y = oldY;
				}
				break;
			case 'rotate':
				mesh.rotation.z += 90 * DEG_TO_RAD;
				if (isOutOfBounds(mesh) || collision(mesh, collidableMeshList, scene)) {
					mesh.rotation.z = oldRotation;
				}
				break;
		}
	}

	// Add touch event listeners
	mobileUI.buttons.left.addEventListener('touchstart', (e) => {
		e.preventDefault();
		triggerMove('left');
	});

	mobileUI.buttons.right.addEventListener('touchstart', (e) => {
		e.preventDefault();
		triggerMove('right');
	});

	mobileUI.buttons.down.addEventListener('touchstart', (e) => {
		e.preventDefault();
		triggerMove('down');
	});

	mobileUI.buttons.rotate.addEventListener('touchstart', (e) => {
		e.preventDefault();
		triggerMove('rotate');
	});

	// Also support click for testing on desktop
	mobileUI.buttons.left.addEventListener('click', () => triggerMove('left'));
	mobileUI.buttons.right.addEventListener('click', () => triggerMove('right'));
	mobileUI.buttons.down.addEventListener('click', () => triggerMove('down'));
	mobileUI.buttons.rotate.addEventListener('click', () => triggerMove('rotate'));
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
