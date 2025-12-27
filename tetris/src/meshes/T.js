import { createTetrisMesh } from './baseMesh';

export default function getTMesh() {
	return createTetrisMesh([
		[0.5, 1.5, 0],
		[0.5, 0.5, 0],
		[-0.5, 0.5, 0],
		[1.5, 0.5, 0]
	]);
}
