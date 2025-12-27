import { MeshLambertMaterial } from 'three';
import { getRandomColor } from '../utils/colors';
import createMeshFromMap from './utils';

export function createTetrisMesh(meshMap) {
	const material = new MeshLambertMaterial({
		color: getRandomColor(),
	});

	return createMeshFromMap({
		material,
		meshMap,
	});
}
