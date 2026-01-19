import { BoxGeometry, MeshBasicMaterial, Mesh, EdgesGeometry, LineSegments, LineBasicMaterial, CylinderGeometry } from 'three';
import { GAME_CONFIG } from './config';

/**
 * Creates visible boundary markers for the Tetris play area
 * @returns {Object} Object containing boundaries array and dangerLine mesh for animation
 */
export function createBoundaries() {
	const boundaries = [];
	const wallMaterial = new MeshBasicMaterial({
		color: 0x999999,
		transparent: true,
		opacity: 0.15 // More subtle
	});
	const edgeMaterial = new LineBasicMaterial({
		color: 0xCCCCFF, // Slight blue tint
		linewidth: 2
	});

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

	// Back wall - width needs to cover from MIN_X to MAX_X + 1 (11 units total)
	const backWall = new BoxGeometry(GAME_CONFIG.BOARD_WIDTH + 1, GAME_CONFIG.BOARD_HEIGHT, 0.2);
	const backMesh = new Mesh(backWall, wallMaterial);
	backMesh.position.x = (GAME_CONFIG.MIN_X + GAME_CONFIG.MAX_X) / 2;
	backMesh.position.z = -1;
	backMesh.position.y = GAME_CONFIG.MIN_Y + GAME_CONFIG.BOARD_HEIGHT / 2;
	const backEdges = new EdgesGeometry(backWall);
	const backLines = new LineSegments(backEdges, edgeMaterial);
	backMesh.add(backLines);
	boundaries.push(backMesh);

	// Danger line at spawn height - pulsing animated indicator
	const dangerLineMaterial = new MeshBasicMaterial({
		color: 0xFF3333, // Bright red
		transparent: true,
		opacity: 0.8,
	});
	const dangerLine = new CylinderGeometry(0.08, 0.08, GAME_CONFIG.BOARD_WIDTH + 1, 8);
	const dangerMesh = new Mesh(dangerLine, dangerLineMaterial);
	dangerMesh.rotation.z = Math.PI / 2; // Rotate to horizontal
	dangerMesh.position.x = (GAME_CONFIG.MIN_X + GAME_CONFIG.MAX_X) / 2;
	dangerMesh.position.y = GAME_CONFIG.SPAWN_Y; // At spawn height
	dangerMesh.position.z = 0.5; // Slightly in front
	boundaries.push(dangerMesh);

	return {
		boundaries,
		dangerLine: dangerMesh
	};
}
