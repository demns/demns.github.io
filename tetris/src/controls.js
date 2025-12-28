import * as Three from 'three';
import collision from './collision';
import { GAME_CONFIG } from './config';

const DEG_TO_RAD = Math.PI / 180;

/**
 * Attaches keyboard controls to a Three.js mesh for Tetris piece movement.
 * Controls: Arrow keys or WASD for movement, Space for instant drop, Up/W for rotation.
 * @param {Three.Mesh} mesh - The Three.js mesh to control
 * @param {Array<Three.Mesh>} collidableObjects - Array of placed pieces to check collision against
 * @param {Three.Scene} scene - The Three.js scene
 * @returns {Function} The event listener function (needed for cleanup via removeControl)
 */
export function controlMesh(mesh, collidableObjects, scene) {
	window.addEventListener('keydown', move, false);

	function move(event) {
		const key = event.key.toLowerCase();
		const oldX = mesh.position.x;
		const oldY = mesh.position.y;
		const oldRotation = mesh.rotation.z;

		switch (key) {
			case 'arrowleft':
			case 'a':
				mesh.position.x -= 1;
				// Check boundaries and collision
				if (mesh.position.x < GAME_CONFIG.MIN_X || collision(mesh, collidableObjects, scene)) {
					mesh.position.x = oldX; // Revert
				}
				break;
			case 'arrowright':
			case 'd':
				mesh.position.x += 1;
				// Check boundaries and collision
				if (mesh.position.x > GAME_CONFIG.MAX_X || collision(mesh, collidableObjects, scene)) {
					mesh.position.x = oldX; // Revert
				}
				break;
			case 'arrowdown':
			case 's':
				if (mesh.position.y > GAME_CONFIG.MIN_Y) {
					mesh.position.y -= 1;
					// Check collision
					if (collision(mesh, collidableObjects, scene)) {
						mesh.position.y = oldY; // Revert
					}
				}
				break;
			case ' ':
				// Hard drop - move piece down until it would collide
				while (mesh.position.y > GAME_CONFIG.MIN_Y) {
					// Try moving down
					mesh.position.y -= 1;
					// If we hit something, move back up and stop
					if (collision(mesh, collidableObjects, scene)) {
						mesh.position.y += 1;
						break;
					}
				}
				break;
			case 'arrowup':
			case 'w':
				mesh.rotation.z += 90 * DEG_TO_RAD;
				// Check collision after rotation
				if (collision(mesh, collidableObjects, scene)) {
					mesh.rotation.z = oldRotation; // Revert rotation
				}
				break;
		}
	}

	return move;
}

/**
 * Removes keyboard controls from a mesh by removing the event listener.
 * @param {Function} listener - The event listener function returned by controlMesh
 */
export function removeControl(listener) {
	window.removeEventListener('keydown', listener, false);
}
