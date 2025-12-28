import { MeshStandardMaterial, Color } from 'three';
import { getRandomColor } from '../utils/colors';
import createMeshFromMap from './utils';

export function createTetrisMesh(meshMap) {
	const baseColor = getRandomColor();
	const color = new Color(baseColor);

	// Brighten the color for more vibrant appearance
	const hsl = {};
	color.getHSL(hsl);
	color.setHSL(hsl.h, Math.min(hsl.s * 1.2, 1), Math.min(hsl.l * 1.1, 0.6));

	const material = new MeshStandardMaterial({
		color: color,
		metalness: 0.5, // Increased metallic look
		roughness: 0.3, // Smoother for glass-like reflections
		emissive: color,
		emissiveIntensity: 0.15, // Stronger inner glow
		flatShading: false,
		envMapIntensity: 1.5, // Enhanced environment reflections
	});

	return createMeshFromMap({
		material,
		meshMap,
	});
}
