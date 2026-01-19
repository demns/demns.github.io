import { BoxGeometry, MeshLambertMaterial, Mesh } from 'three';

class Cube {
	constructor(color) {
		const geometry = new BoxGeometry(1, 1, 1);
		const material = new MeshLambertMaterial({ color: color });
		this.cube = new Mesh(geometry, material);
	}
}

export default Cube;