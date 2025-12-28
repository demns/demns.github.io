import { Box3 } from 'three';

/**
 * Detects if a Tetris piece mesh collides with existing objects using 3D bounding box intersection.
 * Checks if the mesh is sitting directly on top of any existing pieces.
 * @param {Three.Mesh} mesh - The Tetris piece to check for collision
 * @param {Array<Three.Mesh>} objects - Array of existing meshes to check against
 * @param {Three.Scene} scene - The Three.js scene (unused but kept for API compatibility)
 * @returns {boolean} True if collision detected, false otherwise
 */
export default function collision(mesh, objects, scene) {
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
 * Checks if a bounding box intersects with any objects in ANY direction.
 * Returns true if the boxes overlap at all (collision detected).
 * @param {Three.Box3} box - The bounding box to check
 * @param {Array<Three.Mesh>} objects - Array of objects to check intersection against
 * @returns {boolean} True if box intersects any object
 */
function isIntersecting(box, objects) {
	for (let i = objects.length - 1; i >= 0; i--) {
		const secondBox = new Box3().setFromObject(objects[i]);
		if (box.intersectsBox(secondBox)) {
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
		if (!object.children || !object.children.length) {
			newObjects.push(object);
		}

		newObjects = newObjects.concat(object.children);
	});

	return newObjects;
}