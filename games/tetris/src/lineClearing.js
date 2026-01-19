import { Vector3 } from 'three';
import { GAME_CONFIG } from './config';

/**
 * Checks for complete lines and clears them from the game.
 * Returns object with count and Y positions of cleared lines.
 * @param {Array<Three.Mesh>} collidableMeshList - Array of all placed piece meshes
 * @param {Three.Scene} scene - The Three.js scene
 * @returns {Object} { count: number, lines: Array<number> }
 */
export function checkAndClearLines(collidableMeshList, scene) {
	const grid = buildGrid(collidableMeshList);
	const completedLines = findCompletedLines(grid);

	if (completedLines.length === 0) {
		return { count: 0, lines: [] };
	}

	// Remove blocks from completed lines
	removeBlocks(completedLines, collidableMeshList, scene, grid);

	// Move blocks down
	moveBlocksDown(completedLines, collidableMeshList, grid);

	return { count: completedLines.length, lines: completedLines };
}

/**
 * Builds a 2D grid representation of the play area.
 * Each cell contains a reference to the mesh occupying it, or null if empty.
 */
function buildGrid(collidableMeshList) {
	const grid = {};

	// Flatten all meshes to individual blocks
	collidableMeshList.forEach((group) => {
		if (group.children) {
			group.children.forEach((block) => {
				const worldPos = block.getWorldPosition(block.position.clone());
				// All pieces now use integer coordinates, so simple rounding works
				const x = Math.round(worldPos.x);
				const y = Math.round(worldPos.y);
				const key = `${x},${y}`;
				grid[key] = block;
			});
		}
	});

	return grid;
}

/**
 * Finds Y coordinates of all completed lines.
 */
function findCompletedLines(grid) {
	const completedLines = [];

	// Check integer Y values where blocks actually land (0, 1, 2, ...)
	for (let y = 0; y <= GAME_CONFIG.MAX_Y; y++) {
		let blocksInLine = 0;

		for (let x = Math.ceil(GAME_CONFIG.MIN_X); x <= Math.floor(GAME_CONFIG.MAX_X); x++) {
			const key = `${x},${y}`;
			if (grid[key]) {
				blocksInLine++;
			}
		}

		if (blocksInLine === GAME_CONFIG.BOARD_WIDTH) {
			completedLines.push(y);
		}
	}

	return completedLines;
}

/**
 * Removes blocks from completed lines.
 */
function removeBlocks(completedLines, collidableMeshList, scene, grid) {
	const parentsToCheck = new Set(); // Track parent groups that had blocks removed

	completedLines.forEach(y => {
		for (let x = Math.ceil(GAME_CONFIG.MIN_X); x <= Math.floor(GAME_CONFIG.MAX_X); x++) {
			const key = `${x},${y}`;
			const block = grid[key];

			if (block && block.parent) {
				const parent = block.parent; // Store parent reference before removing
				parentsToCheck.add(parent);
				parent.remove(block);
			}
		}
	});

	// Check all affected parent groups and remove empty ones
	parentsToCheck.forEach(parent => {
		if (parent.children.length === 0) {
			scene.remove(parent);
			const index = collidableMeshList.indexOf(parent);
			if (index > -1) {
				collidableMeshList.splice(index, 1);
			}
		}
	});
}

/**
 * Moves all blocks above cleared lines down.
 */
function moveBlocksDown(completedLines, collidableMeshList, grid) {
	if (completedLines.length === 0) return;

	// Sort lines from bottom to top
	completedLines.sort((a, b) => a - b);

	// Calculate how far down each parent group needs to move
	// Key insight: We move entire parent groups, not individual blocks
	const parentsToMove = new Map(); // Map of parent group -> distance to move down

	// Iterate through all remaining parent groups
	collidableMeshList.forEach((parentGroup) => {
		// Get the lowest Y position of any block in this group (in world coordinates)
		let minWorldY = Infinity;

		parentGroup.children.forEach(block => {
			const worldPos = block.getWorldPosition(new Vector3());
			const worldY = Math.round(worldPos.y);
			minWorldY = Math.min(minWorldY, worldY);
		});

		// Count how many completed lines are below this group's lowest block
		const linesBelow = completedLines.filter(clearedY => clearedY < minWorldY).length;

		if (linesBelow > 0) {
			parentsToMove.set(parentGroup, linesBelow);
		}
	});

	// Move each parent group down by the calculated distance
	parentsToMove.forEach((distance, parentGroup) => {
		parentGroup.position.y -= distance;
	});
}
