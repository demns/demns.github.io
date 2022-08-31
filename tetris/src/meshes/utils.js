import { BoxGeometry, Group, Mesh } from 'three';

export default function createMeshFromMap({ material, meshMap }) {
	const box = new BoxGeometry(1, 1, 1);

	return meshMap.reduce((group, item) => {
		const part = new Mesh(box, material);
		part.position.x = item[0];
		part.position.y = item[1];
		part.position.z = item[2];
		part.castShadow = true;
		group.add(part);

		return group;
	}, new Group());
}