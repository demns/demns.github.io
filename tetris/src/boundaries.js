import { BoxGeometry, MeshBasicMaterial, Mesh, EdgesGeometry, LineSegments, LineBasicMaterial } from 'three';
import { GAME_CONFIG } from './config';

/**
 * Creates visible boundary markers for the Tetris play area
 * @returns {Array<Three.Mesh>} Array of boundary meshes
 */
export function createBoundaries() {
	const boundaries = [];
	const wallMaterial = new MeshBasicMaterial({
		color: 0xff0000,
		transparent: true,
		opacity: 0.1
	});
	const edgeMaterial = new LineBasicMaterial({ color: 0xff3333 });

	// Left wall
	const leftWall = new BoxGeometry(0.2, GAME_CONFIG.BOARD_HEIGHT, 0.2);
	const leftMesh = new Mesh(leftWall, wallMaterial);
	leftMesh.position.x = GAME_CONFIG.MIN_X - 0.6;
	leftMesh.position.y = GAME_CONFIG.BOARD_HEIGHT / 2;
	const leftEdges = new EdgesGeometry(leftWall);
	const leftLines = new LineSegments(leftEdges, edgeMaterial);
	leftMesh.add(leftLines);
	boundaries.push(leftMesh);

	// Right wall
	const rightWall = new BoxGeometry(0.2, GAME_CONFIG.BOARD_HEIGHT, 0.2);
	const rightMesh = new Mesh(rightWall, wallMaterial);
	rightMesh.position.x = GAME_CONFIG.MAX_X + 0.6;
	rightMesh.position.y = GAME_CONFIG.BOARD_HEIGHT / 2;
	const rightEdges = new EdgesGeometry(rightWall);
	const rightLines = new LineSegments(rightEdges, edgeMaterial);
	rightMesh.add(rightLines);
	boundaries.push(rightMesh);

	// Back wall
	const backWall = new BoxGeometry(GAME_CONFIG.BOARD_WIDTH + 1, GAME_CONFIG.BOARD_HEIGHT, 0.2);
	const backMesh = new Mesh(backWall, wallMaterial);
	backMesh.position.z = -1;
	backMesh.position.y = GAME_CONFIG.BOARD_HEIGHT / 2;
	const backEdges = new EdgesGeometry(backWall);
	const backLines = new LineSegments(backEdges, edgeMaterial);
	backMesh.add(backLines);
	boundaries.push(backMesh);

	return boundaries;
}
