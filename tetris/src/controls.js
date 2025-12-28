import * as Three from 'three';
import collision, { isBelowFloor, isOutOfBounds } from './collision';
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
				// Check boundaries and collision using bounding boxes
				const outOfBoundsLeft = isOutOfBounds(mesh);
				const hasCollisionLeft = collision(mesh, collidableObjects, scene);
				console.log(`[CONTROLS] Left key: X=${mesh.position.x}, outOfBounds=${outOfBoundsLeft}, collision=${hasCollisionLeft}`);
				if (outOfBoundsLeft || hasCollisionLeft) {
					mesh.position.x = oldX; // Revert
				}
				break;
			case 'arrowright':
			case 'd':
				mesh.position.x += 1;
				// Check boundaries and collision using bounding boxes
				const outOfBoundsRight = isOutOfBounds(mesh);
				const hasCollisionRight = collision(mesh, collidableObjects, scene);
				console.log(`[CONTROLS] Right key: X=${mesh.position.x}, outOfBounds=${outOfBoundsRight}, collision=${hasCollisionRight}`);
				if (outOfBoundsRight || hasCollisionRight) {
					mesh.position.x = oldX; // Revert
				}
				break;
			case 'arrowdown':
			case 's':
				// Try moving down
				console.log(`[CONTROLS] Down key: oldY=${oldY}, trying newY=${oldY - 1}`);
				mesh.position.y -= 1;
				// Check if below floor or collision
				const belowFloor = isBelowFloor(mesh);
				const hasCollision = collision(mesh, collidableObjects, scene);
				console.log(`[CONTROLS] Down key: belowFloor=${belowFloor}, collision=${hasCollision}`);
				if (belowFloor || hasCollision) {
					mesh.position.y = oldY; // Revert
					console.log(`[CONTROLS] Down key: REVERTED to Y=${oldY}`);
				} else {
					console.log(`[CONTROLS] Down key: MOVED to Y=${mesh.position.y}`);
				}
				break;
			case ' ':
				// Hard drop - move piece down until it would collide or hit floor
				while (true) {
					// Try moving down
					mesh.position.y -= 1;
					// Check if below floor or collision
					const belowFloorSpace = isBelowFloor(mesh);
					const hasCollisionSpace = collision(mesh, collidableObjects, scene);
					// If we hit something or floor, move back up and stop
					if (belowFloorSpace || hasCollisionSpace) {
						mesh.position.y += 1;
						break;
					}
				}
				break;
			case 'arrowup':
			case 'w':
				mesh.rotation.z += 90 * DEG_TO_RAD;
				// Check collision and bounds after rotation
				const outOfBounds = isOutOfBounds(mesh);
				const hasRotationCollision = collision(mesh, collidableObjects, scene);
				if (outOfBounds || hasRotationCollision) {
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
