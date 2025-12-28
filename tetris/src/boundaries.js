import { BoxGeometry, MeshBasicMaterial, Mesh, EdgesGeometry, LineSegments, LineBasicMaterial } from 'three';
import { GAME_CONFIG } from './config';

/**
 * Creates visible boundary markers for the Tetris play area
 * @returns {Array<Three.Mesh>} Array of boundary meshes
 */
export function createBoundaries() {
	const boundaries = [];
	const wallMaterial = new MeshBasicMaterial({
		color: 0xCCCCCC,
		transparent: true,
		opacity: 0.3
	});
	const edgeMaterial = new LineBasicMaterial({ color: 0xFFFFFF, linewidth: 2 });

	// Left wall
	const leftWall = new BoxGeometry(0.2, GAME_CONFIG.BOARD_HEIGHT, 0.2);
	const leftMesh = new Mesh(leftWall, wallMaterial);
	leftMesh.position.x = GAME_CONFIG.MIN_X - 0.6;
	leftMesh.position.y = GAME_CONFIG.MIN_Y + GAME_CONFIG.BOARD_HEIGHT / 2; // Sit on floor
	const leftEdges = new EdgesGeometry(leftWall);
	const leftLines = new LineSegments(leftEdges, edgeMaterial);
	leftMesh.add(leftLines);
	boundaries.push(leftMesh);

	// Right wall
	const rightWall = new BoxGeometry(0.2, GAME_CONFIG.BOARD_HEIGHT, 0.2);
	const rightMesh = new Mesh(rightWall, wallMaterial);
	rightMesh.position.x = GAME_CONFIG.MAX_X + 0.6;
	rightMesh.position.y = GAME_CONFIG.MIN_Y + GAME_CONFIG.BOARD_HEIGHT / 2;
	const rightEdges = new EdgesGeometry(rightWall);
	const rightLines = new LineSegments(rightEdges, edgeMaterial);
	rightMesh.add(rightLines);
	boundaries.push(rightMesh);

	// Back wall
	const backWall = new BoxGeometry(GAME_CONFIG.BOARD_WIDTH, GAME_CONFIG.BOARD_HEIGHT, 0.2);
	const backMesh = new Mesh(backWall, wallMaterial);
	backMesh.position.x = (GAME_CONFIG.MIN_X + GAME_CONFIG.MAX_X) / 2 + 0.5;
	backMesh.position.z = -1;
	backMesh.position.y = GAME_CONFIG.MIN_Y + GAME_CONFIG.BOARD_HEIGHT / 2;
	const backEdges = new EdgesGeometry(backWall);
	const backLines = new LineSegments(backEdges, edgeMaterial);
	backMesh.add(backLines);
	boundaries.push(backMesh);

	// Top boundary indicator (horizontal frame at maximum height)
	const topFrame = new BoxGeometry(GAME_CONFIG.BOARD_WIDTH, 0.1, 1);
	const topMesh = new Mesh(topFrame, wallMaterial);
	topMesh.position.x = (GAME_CONFIG.MIN_X + GAME_CONFIG.MAX_X) / 2 + 0.5;
	topMesh.position.y = GAME_CONFIG.MAX_Y + 0.5; // Sit on top of highest block position
	topMesh.position.z = 0;
	const topEdges = new EdgesGeometry(topFrame);
	const topLines = new LineSegments(topEdges, edgeMaterial);
	topMesh.add(topLines);
	boundaries.push(topMesh);

	return boundaries;
}
