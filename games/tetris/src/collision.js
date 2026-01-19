import { Box3 } from 'three';
import { GAME_CONFIG } from './config';

/**
 * Detects if a Tetris piece mesh collides with existing objects using 3D bounding box intersection.
 * Checks if the mesh is sitting directly on top of any existing pieces.
 * @param {Three.Mesh} mesh - The Tetris piece to check for collision
 * @param {Array<Three.Mesh>} objects - Array of existing meshes to check against
 * @param {Three.Scene} scene - The Three.js scene (unused but kept for API compatibility)
 * @returns {boolean} True if collision detected, false otherwise
 */
export default function collision(mesh, objects, scene) {
	// Update world matrices to ensure bounding boxes are calculated with current positions
	mesh.updateMatrixWorld(true);
	objects.forEach(obj => obj.updateMatrixWorld(true));

	const fullObjects = getAllObjects(objects);
	const fullMesh = getAllObjects([mesh]);

	for (let i = fullMesh.length - 1; i >= 0; i--) {
		const box = new Box3().setFromObject(fullMesh[i]);
		if (isIntersecting(box, fullObjects)) {
			return true;
		}
	}

	return false;
}

/**
 * Checks if any part of the piece would be below the floor
 * @param {Three.Mesh} mesh - The Tetris piece to check
 * @returns {boolean} True if any child cube is below MIN_Y
 */
export function isBelowFloor(mesh) {
	mesh.updateMatrixWorld(true);
	const children = getAllObjects([mesh]);
	const EPSILON = -0.01; // Small negative threshold for floating point errors

	for (let child of children) {
		const box = new Box3().setFromObject(child);
		if (box.min.y < GAME_CONFIG.MIN_Y + EPSILON) {
			return true;
		}
	}
	return false;
}

/**
 * Checks if any part of the piece is outside the play area boundaries
 * @param {Three.Mesh} mesh - The Tetris piece to check
 * @returns {boolean} True if any child cube is outside boundaries
 */
export function isOutOfBounds(mesh) {
	mesh.updateMatrixWorld(true);
	const children = getAllObjects([mesh]);
	const EPSILON = -0.01; // Small negative threshold for floating point errors

	for (let child of children) {
		const box = new Box3().setFromObject(child);
		// Cubes are 1 unit wide, so min/max extend 0.5 units from center
		// MIN_X/MAX_X represent center positions, so subtract/add 0.5 for the actual bounds
		if (box.min.x < GAME_CONFIG.MIN_X - 0.5 || box.max.x > GAME_CONFIG.MAX_X + 0.5 || box.min.y < GAME_CONFIG.MIN_Y + EPSILON) {
			return true;
		}
	}
	return false;
}

/**
 * Checks if a bounding box intersects with any objects in ANY direction.
 * Returns true if the boxes overlap at all (collision detected).
 * @param {Three.Box3} box - The bounding box to check
 * @param {Array<Three.Mesh>} objects - Array of objects to check intersection against
 * @returns {boolean} True if box intersects any object
 */
function isIntersecting(box, objects) {
	const EPSILON = 0.01; // Small threshold to ignore edge touching

	for (let i = objects.length - 1; i >= 0; i--) {
		const secondBox = new Box3().setFromObject(objects[i]);

		// Check if boxes actually overlap (not just touching at edges)
		// Boxes overlap if they intersect with some margin
		const overlapX = Math.min(box.max.x, secondBox.max.x) - Math.max(box.min.x, secondBox.min.x);
		const overlapY = Math.min(box.max.y, secondBox.max.y) - Math.max(box.min.y, secondBox.min.y);
		const overlapZ = Math.min(box.max.z, secondBox.max.z) - Math.max(box.min.z, secondBox.min.z);

		// Real collision requires overlap in all 3 dimensions with margin
		if (overlapX > EPSILON && overlapY > EPSILON && overlapZ > EPSILON) {
			return true;
		}
	}
	return false;
}

/**
 * Flattens a hierarchy of Three.js objects into a single array including all children.
 * @param {Array<Three.Object3D>} objects - Array of Three.js objects (may have children)
 * @returns {Array<Three.Object3D>} Flattened array of all objects and their children
 */
function getAllObjects(objects) {
	let newObjects = [];
	objects.forEach(object => {
		// If object has children (like a Group), use the children (actual meshes)
		// Otherwise use the object itself
		if (object.children && object.children.length > 0) {
			newObjects = newObjects.concat(object.children);
		} else {
			newObjects.push(object);
		}
	});

	return newObjects;
}