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
	moveBlocksDown(completedLines, collidableMeshList);

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
 * Moves individual blocks, not parent groups, to handle partial row clears correctly.
 */
function moveBlocksDown(completedLines, collidableMeshList) {
	if (completedLines.length === 0) return;

	// Sort lines from bottom to top
	completedLines.sort((a, b) => a - b);

	// Collect all blocks and their current world Y positions BEFORE moving anything
	const blocksToMove = [];

	collidableMeshList.forEach((parentGroup) => {
		// Force matrix update for accurate world positions
		parentGroup.updateMatrixWorld(true);

		parentGroup.children.forEach(block => {
			// Get world position - block.position is local to parent
			const worldPos = new Vector3();
			block.getWorldPosition(worldPos);
			const blockY = Math.round(worldPos.y);

			// Count how many completed lines are below this block
			const linesBelow = completedLines.filter(clearedY => clearedY < blockY).length;

			if (linesBelow > 0) {
				blocksToMove.push({ block, linesBelow });
			}
		});
	});

	// Now move all blocks
	blocksToMove.forEach(({ block, linesBelow }) => {
		block.position.y -= linesBelow;
	});
}
