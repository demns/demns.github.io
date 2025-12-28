import { DoubleSide, Mesh, MeshPhongMaterial, PlaneGeometry } from 'three';

export default function getPlane() {
	const plane = new Mesh(new PlaneGeometry(200, 200), new MeshPhongMaterial({
		color: 0x880000, // Red floor
		specular: 0xCC0000, // Red specular
		shininess: 30,
		flatShading: false,
		side: DoubleSide
	}));

	plane.receiveShadow = true;
	return plane;
}