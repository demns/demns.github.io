/**
 * Creates and manages the score display UI overlay
 */

export class ScoreUI {
	constructor() {
		this.createUI();
	}

	/**
	 * Creates the HTML elements for the score display
	 */
	createUI() {
		// Create container
		this.container = document.createElement('div');
		this.container.id = 'score-container';
		this.container.style.cssText = `
			position: fixed;
			top: 20px;
			left: 20px;
			color: white;
			font-family: 'Courier New', monospace;
			font-size: 16px;
			background: rgba(0, 0, 0, 0.7);
			padding: 15px 20px;
			border-radius: 8px;
			border: 2px solid rgba(255, 255, 255, 0.3);
			z-index: 1000;
			user-select: none;
			pointer-events: none;
		`;

		// Create score elements
		this.container.innerHTML = `
			<div style="margin-bottom: 10px; font-size: 18px; font-weight: bold; border-bottom: 1px solid rgba(255,255,255,0.3); padding-bottom: 8px;">
				TETRIS SCORE
			</div>
			<div style="margin-bottom: 6px;">
				<span style="color: #4ECDC4;">Score:</span>
				<span id="current-score" style="float: right; font-weight: bold;">0</span>
			</div>
			<div style="margin-bottom: 6px;">
				<span style="color: #FFE66D;">High Score:</span>
				<span id="high-score" style="float: right; font-weight: bold;">0</span>
			</div>
			<div style="margin-bottom: 10px; padding-bottom: 8px; border-bottom: 1px solid rgba(255,255,255,0.2);">
				<span style="color: #95E1D3;">Rows:</span>
				<span id="rows-cleared" style="float: right; font-weight: bold;">0</span>
			</div>
			<div style="margin-bottom: 6px;">
				<span style="color: #F38181;">Pieces:</span>
				<span id="pieces-placed" style="float: right; font-weight: bold;">0</span>
			</div>
			<div>
				<span style="color: #AA96DA;">Max Pieces:</span>
				<span id="max-pieces" style="float: right; font-weight: bold;">0</span>
			</div>
		`;

		document.body.appendChild(this.container);

		// Cache element references
		this.elements = {
			currentScore: document.getElementById('current-score'),
			highScore: document.getElementById('high-score'),
			rowsCleared: document.getElementById('rows-cleared'),
			piecesPlaced: document.getElementById('pieces-placed'),
			maxPieces: document.getElementById('max-pieces')
		};
	}

	/**
	 * Update the display with current stats
	 * @param {Object} stats - Stats object from ScoreManager
	 */
	update(stats) {
		this.elements.currentScore.textContent = stats.currentScore;
		this.elements.highScore.textContent = stats.highScore;
		this.elements.rowsCleared.textContent = stats.rowsCleared;
		this.elements.piecesPlaced.textContent = stats.piecesPlaced;
		this.elements.maxPieces.textContent = stats.maxPieces;

		// Highlight when breaking records
		if (stats.currentScore > 0 && stats.currentScore === stats.highScore) {
			this.elements.highScore.style.color = '#FFD700'; // Gold
		} else {
			this.elements.highScore.style.color = 'white';
		}

		if (stats.piecesPlaced > 0 && stats.piecesPlaced === stats.maxPieces) {
			this.elements.maxPieces.style.color = '#FFD700'; // Gold
		} else {
			this.elements.maxPieces.style.color = 'white';
		}
	}

	/**
	 * Flash the score display briefly (for visual feedback)
	 * @param {string} elementId - ID of element to flash
	 */
	flash(elementId) {
		const element = this.elements[elementId];
		if (!element) return;

		element.style.transition = 'transform 0.1s';
		element.style.transform = 'scale(1.2)';

		setTimeout(() => {
			element.style.transform = 'scale(1)';
		}, 100);
	}
}
