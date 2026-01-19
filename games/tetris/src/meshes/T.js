import { createTetrisMesh } from './baseMesh';

export default function getTMesh() {
	return createTetrisMesh([
		[0, 1, 0],
		[0, 0, 0],
		[-1, 0, 0],
		[1, 0, 0]
	], 'T');
}
