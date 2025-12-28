import { MeshStandardMaterial, Color } from 'three';
import createMeshFromMap from './utils';

// Classic Tetris color scheme - each piece type has its own color
const TETROMINO_COLORS = {
	I: 0x00F0F0, // Cyan
	O: 0xF0F000, // Yellow
	T: 0xA000F0, // Purple
	S: 0x00F000, // Green
	Z: 0xF00000, // Red
	J: 0x0000F0, // Blue
	L: 0xF0A000, // Orange
};

export function createTetrisMesh(meshMap, pieceType = 'I') {
	const baseColor = TETROMINO_COLORS[pieceType] || 0x00F0F0;
	const color = new Color(baseColor);

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
