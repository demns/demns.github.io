const GAME_PATHS = {
	'./games/ttt': 'ttt',
	'./games/santa': 'santa',
	'./games/tetris/www': 'tetris'
};

const STORAGE_KEYS = {
	GAMES_VISITED: 'games_visited',
	EASTER_EGGS: 'easterEggProgress',
	TETRIS_SCORE: 'tetris_highscore',
	TETRIS_4LINE: 'tetris_4line_cleared',
	TTT_WINS: 'ttt_wins',
	SANTA_COMPLETE: 'santa_complete'
};

const THRESHOLDS = {
	SCROLL_DEPTH: 0.3,
	TIME_INTERVAL: 1000,
	POLL_INTERVAL: 3000,
	EASTER_EGG_POLL: 2000
};

export class AchievementTracker {
	constructor(achievementSystem) {
		this.system = achievementSystem;
		this.projectLinksClicked = new Set();
		this.gamesVisited = new Set();
		this.timeInterval = null;

		this.init();
	}

	init() {
		this.system.unlock('first-contact');

		this.checkTheme();
		this.checkNightOwl();
		this.checkReturnVisitor();
		this.trackScroll();
		this.trackSocialLinks();
		this.trackProjectLinks();
		this.trackGameLinks();
		this.trackDevTools();
		this.startTimeTracking();
		this.checkEasterEggProgress();
		this.listenForGameEvents();
	}

	checkNightOwl() {
		const hour = new Date().getHours();
		if (hour >= 0 && hour < 5) {
			this.system.unlock('night-owl');
		}
	}

	checkReturnVisitor() {
		const stats = this.system.getStats();
		if (stats.totalVisits > 1) {
			this.system.unlock('return-visitor');
		}
	}

	trackDevTools() {
		const threshold = 160;
		const check = () => {
			if (window.outerWidth - window.innerWidth > threshold ||
			    window.outerHeight - window.innerHeight > threshold) {
				this.system.unlock('code-hunter');
			}
		};
		window.addEventListener('resize', check);
		check();
	}

	checkTheme() {
		const hasThemePreference = window.matchMedia('(prefers-color-scheme: dark)').matches ||
		                          window.matchMedia('(prefers-color-scheme: light)').matches;
		if (hasThemePreference) this.system.unlock('theme-master');
	}

	trackScroll() {
		const handleScroll = () => {
			this.system.unlock('curious-observer');
			window.removeEventListener('scroll', handleScroll);
		};
		window.addEventListener('scroll', handleScroll, { passive: true });
	}

	trackSocialLinks() {
		document.querySelectorAll('.nav-link').forEach(link => {
			link.addEventListener('click', () => this.system.unlock('connector'));
		});
	}

	trackProjectLinks() {
		const projectSection = document.querySelector('#projects-title')?.closest('.section');
		if (!projectSection) return;

		projectSection.querySelectorAll('.link').forEach(link => {
			link.addEventListener('click', () => {
				const href = link.getAttribute('href');
				if (href) {
					this.projectLinksClicked.add(href);
					this.system.setProgress('investigator', this.projectLinksClicked.size);
				}
			});
		});
	}

	trackGameLinks() {
		this.loadVisitedGames();

		Object.entries(GAME_PATHS).forEach(([href, gameName]) => {
			document.querySelectorAll(`a[href="${href}"], a[href="${href}/"]`).forEach(link => {
				link.addEventListener('click', () => this.recordGameVisit(gameName));
			});
		});
	}

	recordGameVisit(gameName) {
		this.gamesVisited.add(gameName);
		this.system.setProgress('gamer', this.gamesVisited.size);

		try {
			const visited = JSON.parse(localStorage.getItem(STORAGE_KEYS.GAMES_VISITED) || '[]');
			if (!visited.includes(gameName)) {
				visited.push(gameName);
				localStorage.setItem(STORAGE_KEYS.GAMES_VISITED, JSON.stringify(visited));
			}
		} catch (e) {
			console.error('Failed to store game visit:', e);
		}
	}

	loadVisitedGames() {
		try {
			const visited = JSON.parse(localStorage.getItem(STORAGE_KEYS.GAMES_VISITED) || '[]');
			visited.forEach(game => this.gamesVisited.add(game));
			if (this.gamesVisited.size > 0) {
				this.system.setProgress('gamer', this.gamesVisited.size);
			}
		} catch (e) {
			console.error('Failed to load game visits:', e);
		}
	}

	startTimeTracking() {
		this.timeInterval = setInterval(() => this.system.incrementTime(), THRESHOLDS.TIME_INTERVAL);
		window.addEventListener('beforeunload', () => clearInterval(this.timeInterval));
	}

	checkEasterEggProgress() {
		const checkEggs = () => {
			try {
				const data = JSON.parse(localStorage.getItem(STORAGE_KEYS.EASTER_EGGS) || '{}');
				const count = data.foundCount || 0;
				if (count > 0) this.system.setProgress('easter-egg-hunter', count);
			} catch (e) {}
		};

		checkEggs();
		setInterval(checkEggs, THRESHOLDS.EASTER_EGG_POLL);
	}

	listenForGameEvents() {
		window.addEventListener('message', (event) => {
			if (event.origin !== window.location.origin) return;
			this.handleGameMessage(event.data);
		});

		this.pollGameScores();
	}

	handleGameMessage({ type, data }) {
		if (type === 'tetris-score') {
			const { score, linesCleared } = data;
			if (score >= 1000 || linesCleared === 4) {
				this.system.unlock('tetris-master');
			} else {
				this.system.setProgress('tetris-master', Math.min(score, 999));
			}
		}

		if (type === 'ttt-result' && data.result === 'draw') {
			const current = this.system.getAchievement('tic-tac-pro').progress;
			this.system.setProgress('tic-tac-pro', current + 1);
		}

		if (type === 'santa-complete') {
			this.system.unlock('santa-helper');
		}
	}

	pollGameScores() {
		setInterval(() => {
			try {
				this.checkTetrisScore();
				this.checkTicTacToeWins();
				this.checkSantaComplete();
			} catch (e) {}
		}, THRESHOLDS.POLL_INTERVAL);
	}

	checkTetrisScore() {
		const score = parseInt(localStorage.getItem(STORAGE_KEYS.TETRIS_SCORE), 10);
		const fourLine = localStorage.getItem(STORAGE_KEYS.TETRIS_4LINE) === 'true';

		if (score >= 1000 || fourLine) {
			this.system.unlock('tetris-master');
		}
	}

	checkTicTacToeWins() {
		const wins = parseInt(localStorage.getItem(STORAGE_KEYS.TTT_WINS), 10);
		if (wins >= 3) {
			this.system.unlock('tic-tac-pro');
		} else if (wins > 0) {
			this.system.setProgress('tic-tac-pro', wins);
		}
	}

	checkSantaComplete() {
		if (localStorage.getItem(STORAGE_KEYS.SANTA_COMPLETE) === 'true') {
			this.system.unlock('santa-helper');
		}
	}
}
