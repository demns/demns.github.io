import { createTetrisMesh } from './baseMesh';

export default function getJMesh() {
	return createTetrisMesh([
		[1, 0, 0],
		[1, 1, 0],
		[0, 1, 0],
		[-1, 1, 0]
	]);
}
