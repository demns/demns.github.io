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
			top: 10px;
			right: 20px;
			color: white;
			font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
			font-size: 14px;
			background: rgba(0, 0, 0, 0.7);
			backdrop-filter: blur(10px);
			padding: 15px 20px;
			border-radius: 8px;
			border: 1px solid rgba(255, 255, 255, 0.1);
			box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
			z-index: 100;
			user-select: none;
			pointer-events: none;
		`;

		// Create desktop version (detailed)
		this.container.innerHTML = `
			<div class="desktop-score">
				<div style="margin: 0 0 12px 0; font-size: 16px; font-weight: 600; color: #4df; text-transform: uppercase; letter-spacing: 1px; padding-bottom: 8px; border-bottom: 1px solid rgba(255,255,255,0.2);">
					Tetris Score
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
			</div>
			<div class="mobile-score" style="display: none; font-size: 16px; font-weight: bold; color: #4df;">
				<span id="mobile-pieces">0</span> / <span id="mobile-rows">0</span> / <span id="mobile-score">0</span>
			</div>
		`;

		document.body.appendChild(this.container);

		// Cache element references
		this.elements = {
			currentScore: document.getElementById('current-score'),
			highScore: document.getElementById('high-score'),
			rowsCleared: document.getElementById('rows-cleared'),
			piecesPlaced: document.getElementById('pieces-placed'),
			maxPieces: document.getElementById('max-pieces'),
			mobileScore: document.getElementById('mobile-score'),
			mobileRows: document.getElementById('mobile-rows'),
			mobilePieces: document.getElementById('mobile-pieces')
		};

		// Detect mobile and switch display
		this.updateDisplayMode();
		window.addEventListener('resize', () => this.updateDisplayMode());
	}

	/**
	 * Switch between mobile and desktop display
	 */
	updateDisplayMode() {
		const isMobile = window.innerWidth <= 768;
		const desktopScore = this.container.querySelector('.desktop-score');
		const mobileScore = this.container.querySelector('.mobile-score');

		if (isMobile) {
			desktopScore.style.display = 'none';
			mobileScore.style.display = 'block';
		} else {
			desktopScore.style.display = 'block';
			mobileScore.style.display = 'none';
		}
	}

	/**
	 * Update the display with current stats
	 * @param {Object} stats - Stats object from ScoreManager
	 */
	update(stats) {
		// Update desktop display
		this.elements.currentScore.textContent = stats.currentScore;
		this.elements.highScore.textContent = stats.highScore;
		this.elements.rowsCleared.textContent = stats.rowsCleared;
		this.elements.piecesPlaced.textContent = stats.piecesPlaced;
		this.elements.maxPieces.textContent = stats.maxPieces;

		// Update mobile display (pieces / rows / score)
		this.elements.mobilePieces.textContent = stats.piecesPlaced;
		this.elements.mobileRows.textContent = stats.rowsCleared;
		this.elements.mobileScore.textContent = stats.currentScore;

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
