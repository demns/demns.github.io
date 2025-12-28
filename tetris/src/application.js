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
import perf from './stats';
import { checkAndClearLines } from './lineClearing';
import { createBoundaries } from './boundaries';
import { ScoreManager } from './scoreManager';
import { ScoreUI } from './scoreUI';
import { GameOverUI } from './gameOverUI';
import { createControlsUI, createMobileControls } from './controlsUI';
import { createGhostPiece, updateGhostPiece } from './ghostPiece';
import { createLineCleaningParticles, updateParticles, createLandingFlash, updateLandingFlashes } from './particleEffects';

document.body.appendChild(perf.dom);
perf.renderer = renderer;

// Add VR button - VRButton.createButton() handles WebXR availability internally
try {
	document.body.appendChild(VRButton.createButton(renderer));
	renderer.xr.enabled = true;
} catch (error) {
	// VR not supported, silently skip
	console.log('WebXR not available');
}

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
let ghostPiece = createGhostPiece(currentElement.element, collidableMeshList, scene);
scene.add(ghostPiece);
updateGhostPiece(ghostPiece, currentElement.element, collidableMeshList, scene);

// Visual effects arrays
const particles = [];
const landingFlashes = [];
let frameCount = 0;
let isInDanger = false; // Cached danger state
let isPaused = false;

let interval = setInterval(down, GAME_TICK_INTERVAL);

// Pause functionality
window.addEventListener('keydown', (e) => {
	if (e.key.toLowerCase() === 'p') {
		isPaused = !isPaused;
		if (isPaused) {
			clearInterval(interval);
			// Show pause overlay
			const pauseOverlay = document.createElement('div');
			pauseOverlay.id = 'pause-overlay';
			pauseOverlay.style.cssText = `
				position: fixed;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
				background: rgba(0, 0, 0, 0.9);
				color: #4df;
				padding: 30px 50px;
				border-radius: 15px;
				font-size: 32px;
				font-weight: bold;
				z-index: 1000;
				border: 2px solid rgba(77, 221, 255, 0.5);
			`;
			pauseOverlay.textContent = 'PAUSED';
			document.body.appendChild(pauseOverlay);
		} else {
			interval = setInterval(down, GAME_TICK_INTERVAL);
			// Remove pause overlay
			const pauseOverlay = document.getElementById('pause-overlay');
			if (pauseOverlay) pauseOverlay.remove();
		}
	}
});

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

		// Create landing flash effect
		landingFlashes.push(createLandingFlash(currentElement.element));

		// Increment pieces counter and update UI
		scoreManager.incrementPieces();
		scoreUI.update(scoreManager.getStats());
		scoreUI.flash('piecesPlaced');

		// Check and clear completed lines
		const clearResult = checkAndClearLines(collidableMeshList, scene);
		if (clearResult.count > 0) {
			scoreManager.addRowScore(clearResult.count);
			scoreUI.update(scoreManager.getStats());
			scoreUI.flash('currentScore');

			// Create particle explosion for cleared lines
			const newParticles = createLineCleaningParticles(clearResult.lines, scene, GAME_CONFIG);
			particles.push(...newParticles);
		}

		// Create next piece
		currentElement = createNewElement();

		// Update ghost piece for new current piece
		scene.remove(ghostPiece);
		ghostPiece = createGhostPiece(currentElement.element, collidableMeshList, scene);
		scene.add(ghostPiece);
		updateGhostPiece(ghostPiece, currentElement.element, collidableMeshList, scene);

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
const boundaryData = createBoundaries();
boundaryData.boundaries.forEach(boundary => scene.add(boundary));
const dangerLine = boundaryData.dangerLine;

camera.position.z = 15; // to avoid camera being into the cube at 0 0 0
camera.position.y = 20;

const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.enableDamping = true;
orbitControls.dampingFactor = 0.05;

// Use setAnimationLoop for VR compatibility instead of requestAnimationFrame
renderer.setAnimationLoop(function render() {
	frameCount++;
	orbitControls.update();

	// Check if any blocks are near danger zone (Y >= 7) - throttled to every 10 frames
	if (frameCount % 10 === 0) {
		isInDanger = false;
		const dangerZoneThreshold = 7;
		for (const group of collidableMeshList) {
			if (group.children) {
				for (const block of group.children) {
					const worldPos = block.getWorldPosition(block.position.clone());
					if (Math.round(worldPos.y) >= dangerZoneThreshold) {
						isInDanger = true;
						break;
					}
				}
				if (isInDanger) break;
			}
		}
	}

	// Animate danger line pulsing only when blocks are near
	if (isInDanger) {
		const time = Date.now() * 0.002;
		dangerLine.material.opacity = 0.5 + Math.sin(time * 2) * 0.3; // Pulse between 0.2 and 0.8
		dangerLine.scale.y = 1 + Math.sin(time * 3) * 0.15; // Slight scale pulse
	} else {
		// Static when safe
		dangerLine.material.opacity = 0.5;
		dangerLine.scale.y = 1.0;
	}

	// Update ghost piece position
	if (ghostPiece && currentElement) {
		updateGhostPiece(ghostPiece, currentElement.element, collidableMeshList, scene);
	}

	// Update particle effects
	updateParticles(particles, scene);

	// Update landing flash animations
	updateLandingFlashes(landingFlashes);

	perf.begin();
	renderer.render(scene, camera);
	perf.end();
});

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

	// Main directional light (like sun) - ONLY shadow caster for performance
	const dirLight = getDirectionalLight();
	dirLight.position.set(10, 25, 10);
	dirLight.target.position.set(0, 5, 0);
	scene.add(dirLight);
	scene.add(dirLight.target);

	// Single spotlight for dramatic effect (no shadows for performance)
	const spotlight = getSpotLight();
	spotlight.castShadow = false; // Disable shadows for performance
	spotlight.position.set(0, 25, 2);
	spotlight.target.position.set(0, 10, 0);
	scene.add(spotlight);
	scene.add(spotlight.target);
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
			case 'drop':
				// Hard drop - move piece down until it hits something
				while (!isBelowFloor(mesh) && !collision(mesh, collidableMeshList, scene)) {
					mesh.position.y -= 1;
				}
				mesh.position.y += 1; // Move back up one step
				// Trigger immediate placement by calling down()
				setTimeout(() => down(), 50);
				break;
		}
	}

	// Add touch event listeners with haptic feedback
	mobileUI.buttons.left.addEventListener('touchstart', (e) => {
		e.preventDefault();
		if (navigator.vibrate) navigator.vibrate(10);
		triggerMove('left');
	});

	mobileUI.buttons.right.addEventListener('touchstart', (e) => {
		e.preventDefault();
		if (navigator.vibrate) navigator.vibrate(10);
		triggerMove('right');
	});

	mobileUI.buttons.down.addEventListener('touchstart', (e) => {
		e.preventDefault();
		if (navigator.vibrate) navigator.vibrate(10);
		triggerMove('down');
	});

	mobileUI.buttons.rotate.addEventListener('touchstart', (e) => {
		e.preventDefault();
		if (navigator.vibrate) navigator.vibrate(15);
		triggerMove('rotate');
	});

	mobileUI.buttons.drop.addEventListener('touchstart', (e) => {
		e.preventDefault();
		if (navigator.vibrate) navigator.vibrate(25);
		triggerMove('drop');
	});

	// Also support click for testing on desktop
	mobileUI.buttons.left.addEventListener('click', () => triggerMove('left'));
	mobileUI.buttons.right.addEventListener('click', () => triggerMove('right'));
	mobileUI.buttons.down.addEventListener('click', () => triggerMove('down'));
	mobileUI.buttons.rotate.addEventListener('click', () => triggerMove('rotate'));
	mobileUI.buttons.drop.addEventListener('click', () => triggerMove('drop'));
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

	// Recreate ghost piece
	scene.remove(ghostPiece);
	ghostPiece = createGhostPiece(currentElement.element, collidableMeshList, scene);
	scene.add(ghostPiece);
	updateGhostPiece(ghostPiece, currentElement.element, collidableMeshList, scene);

	// Restart game interval
	interval = setInterval(down, GAME_TICK_INTERVAL);
}
