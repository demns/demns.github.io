import { DoubleSide, Mesh, MeshStandardMaterial, PlaneGeometry, GridHelper, Group } from 'three';
import { GAME_CONFIG } from './config';

export default function getPlane() {
	const group = new Group();

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
	group.add(plane);

	// Grid helper for gameplay area (10x20 grid)
	const gridHelper = new GridHelper(
		GAME_CONFIG.BOARD_WIDTH, // size
		GAME_CONFIG.BOARD_WIDTH, // divisions
		0x444444, // center line color
		0x333333  // grid color
	);
	gridHelper.rotation.x = 0;
	gridHelper.position.y = 0.01; // Slightly above floor to prevent z-fighting
	gridHelper.position.x = (GAME_CONFIG.MIN_X + GAME_CONFIG.MAX_X) / 2 + 0.5;
	gridHelper.position.z = GAME_CONFIG.BOARD_HEIGHT / 2;
	gridHelper.material.opacity = 0.3;
	gridHelper.material.transparent = true;
	group.add(gridHelper);

	return group;
}