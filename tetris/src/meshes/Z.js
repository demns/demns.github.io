import { createTetrisMesh } from './baseMesh';

export default function getZMesh() {
	return createTetrisMesh([
		[0, 0, 0],
		[-1, 0, 0],
		[0, 1, 0],
		[1, 1, 0]
	]);
}
