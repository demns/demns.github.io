import { DoubleSide, FlatShading, Mesh, MeshPhongMaterial, PlaneGeometry } from 'three';

export default function getPlane() {
	const plane = new Mesh(new PlaneGeometry(200, 200), new MeshPhongMaterial({
		color: 0xbb00aa,
		specular: 0xbb00aa,
		shininess: 100,
		shading: FlatShading,
		side: DoubleSide
	}));

	plane.receiveShadow = true;
	return plane;
}