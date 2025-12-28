/**
 * Creates and manages the game over screen with restart functionality
 */

export class GameOverUI {
	constructor(onRestart) {
		this.onRestart = onRestart;
		this.container = null;
	}

	/**
	 * Show the game over screen with final stats
	 * @param {Object} stats - Final game stats from ScoreManager
	 */
	show(stats) {
		// Create overlay container
		this.container = document.createElement('div');
		this.container.id = 'game-over-container';
		this.container.style.cssText = `
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background: rgba(0, 0, 0, 0.5);
			display: flex;
			align-items: center;
			justify-content: center;
			z-index: 2000;
			animation: fadeIn 0.3s ease-in;
		`;

		// Create game over panel
		const panel = document.createElement('div');
		panel.style.cssText = `
			background: linear-gradient(135deg, rgba(40, 40, 40, 0.95), rgba(20, 20, 20, 0.95));
			padding: 40px 50px;
			border-radius: 16px;
			border: 3px solid rgba(255, 255, 255, 0.2);
			box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
			text-align: center;
			color: white;
			font-family: 'Courier New', monospace;
			max-width: 400px;
			animation: slideDown 0.4s ease-out;
		`;

		const isNewHighScore = stats.currentScore > 0 && stats.currentScore === stats.highScore;
		const isNewMaxPieces = stats.piecesPlaced > 0 && stats.piecesPlaced === stats.maxPieces;

		// Build panel HTML
		panel.innerHTML = `
			<div style="font-size: 48px; font-weight: bold; color: #FF6B6B; margin-bottom: 20px; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);">
				GAME OVER
			</div>

			${isNewHighScore ? `
				<div style="font-size: 20px; color: #FFD700; margin-bottom: 15px; animation: pulse 1s infinite;">
					🏆 NEW HIGH SCORE! 🏆
				</div>
			` : ''}

			${isNewMaxPieces && !isNewHighScore ? `
				<div style="font-size: 18px; color: #FFD700; margin-bottom: 15px; animation: pulse 1s infinite;">
					⭐ NEW PIECES RECORD! ⭐
				</div>
			` : ''}

			<div style="margin: 25px 0; padding: 20px; background: rgba(0, 0, 0, 0.3); border-radius: 8px;">
				<div style="margin-bottom: 12px; font-size: 18px;">
					<span style="color: #4ECDC4;">Final Score:</span>
					<span style="float: right; font-weight: bold; font-size: 24px; color: ${isNewHighScore ? '#FFD700' : 'white'};">
						${stats.currentScore}
					</span>
				</div>
				<div style="margin-bottom: 12px;">
					<span style="color: #FFE66D;">High Score:</span>
					<span style="float: right; font-weight: bold;">${stats.highScore}</span>
				</div>
				<div style="margin-bottom: 12px;">
					<span style="color: #95E1D3;">Rows Cleared:</span>
					<span style="float: right; font-weight: bold;">${stats.rowsCleared}</span>
				</div>
				<div style="margin-bottom: 12px;">
					<span style="color: #F38181;">Pieces Placed:</span>
					<span style="float: right; font-weight: bold; color: ${isNewMaxPieces ? '#FFD700' : 'white'};">
						${stats.piecesPlaced}
					</span>
				</div>
				<div>
					<span style="color: #AA96DA;">Max Pieces:</span>
					<span style="float: right; font-weight: bold;">${stats.maxPieces}</span>
				</div>
			</div>

			<button id="restart-button" style="
				background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
				color: white;
				border: none;
				padding: 15px 40px;
				font-size: 18px;
				font-weight: bold;
				border-radius: 8px;
				cursor: pointer;
				font-family: 'Courier New', monospace;
				transition: all 0.3s ease;
				box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
				margin-top: 10px;
			">
				RESTART GAME
			</button>
		`;

		this.container.appendChild(panel);
		document.body.appendChild(this.container);

		// Add CSS animations
		this.addAnimations();

		// Add button hover effects and click handler
		const restartButton = document.getElementById('restart-button');

		// Auto-focus the button so Space/Enter work immediately
		restartButton.focus();

		restartButton.addEventListener('mouseenter', () => {
			restartButton.style.transform = 'scale(1.05)';
			restartButton.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.6)';
		});
		restartButton.addEventListener('mouseleave', () => {
			restartButton.style.transform = 'scale(1)';
			restartButton.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
		});
		restartButton.addEventListener('click', () => {
			this.hide();
			if (this.onRestart) {
				this.onRestart();
			}
		});

		// Add keyboard support for quick restart
		const keyHandler = (e) => {
			if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
				e.preventDefault();
				e.stopPropagation();
				e.stopImmediatePropagation();
				this.hide();
				if (this.onRestart) {
					this.onRestart();
				}
			}
		};
		document.addEventListener('keydown', keyHandler, true);

		// Store handler so we can remove it later
		this.keyHandler = keyHandler;
	}

	/**
	 * Hide and remove the game over screen
	 */
	hide() {
		// Remove keyboard event listener
		if (this.keyHandler) {
			document.removeEventListener('keydown', this.keyHandler, true);
			this.keyHandler = null;
		}

		if (this.container) {
			this.container.style.animation = 'fadeOut 0.2s ease-out';
			setTimeout(() => {
				if (this.container && this.container.parentNode) {
					document.body.removeChild(this.container);
				}
				this.container = null;
			}, 200);
		}
	}

	/**
	 * Add CSS animations to the page
	 */
	addAnimations() {
		// Check if animations already exist
		if (document.getElementById('game-over-animations')) {
			return;
		}

		const style = document.createElement('style');
		style.id = 'game-over-animations';
		style.textContent = `
			@keyframes fadeIn {
				from { opacity: 0; }
				to { opacity: 1; }
			}

			@keyframes fadeOut {
				from { opacity: 1; }
				to { opacity: 0; }
			}

			@keyframes slideDown {
				from {
					transform: translateY(-50px);
					opacity: 0;
				}
				to {
					transform: translateY(0);
					opacity: 1;
				}
			}

			@keyframes pulse {
				0%, 100% {
					transform: scale(1);
					opacity: 1;
				}
				50% {
					transform: scale(1.05);
					opacity: 0.8;
				}
			}
		`;
		document.head.appendChild(style);
	}
}
