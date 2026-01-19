/**
 * Manages game scoring and high score persistence using localStorage
 */

const STORAGE_KEY = 'tetris_high_scores';

// Scoring system: bonus for clearing multiple rows at once
const SCORE_TABLE = {
	1: 100,   // Single line
	2: 300,   // Double lines
	3: 500,   // Triple lines
	4: 800    // Tetris (4 lines)
};

export class ScoreManager {
	constructor() {
		this.currentScore = 0;
		this.piecesPlaced = 0;
		this.rowsCleared = 0;
		this.loadHighScores();
	}

	/**
	 * Load high scores from localStorage
	 */
	loadHighScores() {
		try {
			const saved = localStorage.getItem(STORAGE_KEY);
			if (saved) {
				const data = JSON.parse(saved);
				this.highScore = data.highScore || 0;
				this.maxPieces = data.maxPieces || 0;
			} else {
				this.highScore = 0;
				this.maxPieces = 0;
			}
		} catch (e) {
			console.error('Failed to load high scores:', e);
			this.highScore = 0;
			this.maxPieces = 0;
		}
	}

	/**
	 * Save high scores to localStorage
	 */
	saveHighScores() {
		try {
			const data = {
				highScore: this.highScore,
				maxPieces: this.maxPieces
			};
			localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
		} catch (e) {
			console.error('Failed to save high scores:', e);
		}
	}

	/**
	 * Add score for clearing rows
	 * @param {number} rowCount - Number of rows cleared (1-4)
	 * @returns {number} Points earned
	 */
	addRowScore(rowCount) {
		if (rowCount < 1 || rowCount > 4) return 0;

		const points = SCORE_TABLE[rowCount];
		this.currentScore += points;
		this.rowsCleared += rowCount;

		// Update high score if beaten
		if (this.currentScore > this.highScore) {
			this.highScore = this.currentScore;
			this.saveHighScores();
		}

		// Notify achievement system (if on main portfolio page)
		this.notifyAchievements(rowCount);

		return points;
	}

	/**
	 * Notify achievement system about game progress
	 */
	notifyAchievements(linesCleared) {
		try {
			// Check if running in parent window (portfolio page)
			if (window.parent && window.parent !== window && window.parent.portfolioAchievements) {
				window.parent.postMessage({
					type: 'tetris-score',
					data: {
						score: this.currentScore,
						linesCleared: linesCleared
					}
				}, window.location.origin);
			}

			// Also store high score flag for achievement system
			if (this.currentScore >= 1000) {
				localStorage.setItem('tetris_highscore', this.currentScore.toString());
			}

			// Store 4-line clear flag (Tetris achievement)
			if (linesCleared === 4) {
				localStorage.setItem('tetris_4line_cleared', 'true');
			}
		} catch (e) {
			// Silently fail if postMessage not available
		}
	}

	/**
	 * Increment pieces placed counter
	 */
	incrementPieces() {
		this.piecesPlaced++;

		// Update max pieces if beaten
		if (this.piecesPlaced > this.maxPieces) {
			this.maxPieces = this.piecesPlaced;
			this.saveHighScores();
		}
	}

	/**
	 * Reset current game stats (but keep high scores)
	 */
	resetGame() {
		this.currentScore = 0;
		this.piecesPlaced = 0;
		this.rowsCleared = 0;
	}

	/**
	 * Get all score data for display
	 */
	getStats() {
		return {
			currentScore: this.currentScore,
			highScore: this.highScore,
			piecesPlaced: this.piecesPlaced,
			maxPieces: this.maxPieces,
			rowsCleared: this.rowsCleared
		};
	}
}
