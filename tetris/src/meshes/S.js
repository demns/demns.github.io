import { createTetrisMesh } from './baseMesh';

export default function getSMesh() {
	return createTetrisMesh([
		[0, 0, 0],
		[1, 0, 0],
		[0, 1, 0],
		[-1, 1, 0]
	], 'S');
}
