import { createTetrisMesh } from './baseMesh';

export default function getIMesh() {
	return createTetrisMesh([
		[0.5, -1.5, 0],
		[0.5, -0.5, 0],
		[0.5, 0.5, 0],
		[0.5, 1.5, 0]
	]);
}
