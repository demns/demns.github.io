import { DoubleSide, Mesh, MeshStandardMaterial, PlaneGeometry } from 'three';

export default function getPlane() {
	// Main floor plane
	const plane = new Mesh(new PlaneGeometry(200, 200, 50, 50), new MeshStandardMaterial({
		color: 0x880000, // Red floor
		metalness: 0.5, // Reflective surface
		roughness: 0.5, // Smooth but not mirror-like
		emissive: 0x440000, // Deep red glow
		emissiveIntensity: 0.15,
		flatShading: false,
		side: DoubleSide
	}));
	plane.receiveShadow = true;

	return plane;
}