import { createTetrisMesh } from './baseMesh';

export default function getOMesh() {
	return createTetrisMesh([
		[-0.5, -0.5, 0],
		[0.5, -0.5, 0],
		[-0.5, 0.5, 0],
		[0.5, 0.5, 0]
	]);
}
