import { BoxGeometry, MeshLambertMaterial } from 'three';
import { getRandomColor } from '../utils/colors';
import createMeshFromMap from './utils';

export default function getIMesh() {
	const material = new MeshLambertMaterial({
		color: getRandomColor(),
	});

	const meshMap = [
		[0.5, -1.5, 0],
		[0.5, -0.5, 0],
		[0.5, 0.5, 0],
		[0.5, 1.5, 0]
	];

	return createMeshFromMap({
		material,
		meshMap,
	});
};
