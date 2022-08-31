import * as Three from 'three';

export function controlMesh(mesh) {
	window.addEventListener('keydown', move, false);

	function move(event) {
		const key = event.which ? event.which : event.keyCode;

		switch (key) {
			case 37: // left
			case 65: // a
				mesh.position.x -= 1;
				break;
			case 39:
			case 68: // d
				mesh.position.x += 1;
				break;
			case 40: // down
			case 83: // s
				if (mesh.position.y > 0) {
					mesh.position.y -= 1;
				}
				break;
			case 32: // space
				if (mesh.position.y > 0) {
					mesh.position.y = 0;
				}
				break;
			case 38:
			case 87: // w
				mesh.rotation.z += 90 * (Math.PI / 180);
		}
	}

	return move;
}

export function removeControl(listener) {
	window.removeEventListener('keydown', listener, false);
}
