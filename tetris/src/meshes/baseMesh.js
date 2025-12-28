import { MeshPhongMaterial } from 'three';
import { getRandomColor } from '../utils/colors';
import createMeshFromMap from './utils';

export function createTetrisMesh(meshMap) {
	const color = getRandomColor();
	const material = new MeshPhongMaterial({
		color: color,
		specular: 0x444444, // Subtle white specular highlights
		shininess: 60, // Moderate shininess for nice reflections
		flatShading: false, // Smooth shading for better light reflections
	});

	return createMeshFromMap({
		material,
		meshMap,
	});
}
