import { isBelowFloor } from './collision';

/**
 * Creates a ghost (preview) piece showing where the current piece will land
 * @param {THREE.Group} currentPiece - The current falling piece
 * @param {Array} collidableMeshList - List of placed pieces
 * @param {THREE.Scene} scene - The scene
 * @returns {THREE.Group} The ghost piece mesh
 */
export function createGhostPiece(currentPiece, collidableMeshList, scene) {
	// Clone the current piece
	const ghost = currentPiece.clone();

	// Make it semi-transparent with a different color
	ghost.children.forEach(child => {
		child.material = child.material.clone();
		child.material.transparent = true;
		child.material.opacity = 0.3;
		child.material.color.setHex(0x888888); // Gray ghost
		child.material.emissive.setHex(0x222222);
		child.material.emissiveIntensity = 0.1;
	});

	return ghost;
}

/**
 * Updates ghost piece position to show landing spot
 * @param {THREE.Group} ghost - The ghost piece
 * @param {THREE.Group} currentPiece - The current piece
 * @param {Array} collidableMeshList - List of placed pieces
 * @param {THREE.Scene} scene - The scene
 */
export function updateGhostPiece(ghost, currentPiece, collidableMeshList, scene) {
	if (!ghost || !currentPiece) return;

	// Import collision function
	const collision = require('./collision').default;

	// Copy position and rotation from current piece
	ghost.position.copy(currentPiece.position);
	ghost.rotation.copy(currentPiece.rotation);

	// Move ghost down until it collides
	while (!isBelowFloor(ghost) && !collision(ghost, collidableMeshList, scene)) {
		ghost.position.y -= 1;
	}

	// Move back up one step (since we went one too far)
	ghost.position.y += 1;
}
