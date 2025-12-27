import { Box3 } from 'three';

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

function isIntersecting(box, objects) {
	for (let i = objects.length - 1; i >= 0; i--) {
		const secondBox = new Box3().setFromObject(objects[i]);
		if (box.intersectsBox(secondBox)) {
			if (box.min.y === secondBox.max.y &&
				box.min.x === secondBox.min.x &&
				box.max.x === secondBox.max.x) {
				return true;
			}
		}
	}
	return false;
}

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