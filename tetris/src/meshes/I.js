import { createTetrisMesh } from './baseMesh';

export default function getIMesh() {
	return createTetrisMesh([
		[0, -2, 0],
		[0, -1, 0],
		[0, 0, 0],
		[0, 1, 0]
	]);
}
