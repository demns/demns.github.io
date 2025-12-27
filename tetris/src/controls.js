import * as Three from 'three';

const DEG_TO_RAD = Math.PI / 180;

/**
 * Attaches keyboard controls to a Three.js mesh for Tetris piece movement.
 * Controls: Arrow keys or WASD for movement, Space for instant drop, Up/W for rotation.
 * @param {Three.Mesh} mesh - The Three.js mesh to control
 * @returns {Function} The event listener function (needed for cleanup via removeControl)
 */
export function controlMesh(mesh) {
	window.addEventListener('keydown', move, false);

	function move(event) {
		const key = event.key.toLowerCase();

		switch (key) {
			case 'arrowleft':
			case 'a':
				mesh.position.x -= 1;
				break;
			case 'arrowright':
			case 'd':
				mesh.position.x += 1;
				break;
			case 'arrowdown':
			case 's':
				if (mesh.position.y > 0) {
					mesh.position.y -= 1;
				}
				break;
			case ' ':
				if (mesh.position.y > 0) {
					mesh.position.y = 0;
				}
				break;
			case 'arrowup':
			case 'w':
				mesh.rotation.z += 90 * DEG_TO_RAD;
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
