import { createTetrisMesh } from './baseMesh';

export default function getLMesh() {
	return createTetrisMesh([
		[-1, 0, 0],
		[-1, 1, 0],
		[0, 1, 0],
		[1, 1, 0]
	]);
}
