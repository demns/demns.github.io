import { ACHIEVEMENTS, LEVELS } from './achievement-data.js';

const STORAGE_KEY = 'portfolio_achievements';

export class AchievementSystem {
	constructor() {
		this.data = this.loadData();
		this.listeners = [];
	}

	loadData() {
		try {
			const saved = localStorage.getItem(STORAGE_KEY);
			if (saved) return JSON.parse(saved);
		} catch (e) {
			console.error('Failed to load achievement data:', e);
		}

		return {
			achievements: Object.keys(ACHIEVEMENTS).reduce((acc, id) => {
				acc[id] = { unlocked: false, timestamp: null, progress: 0 };
				return acc;
			}, {}),
			stats: {
				firstVisit: Date.now(),
				totalVisits: 1,
				timeOnSite: 0,
				lastVisit: Date.now(),
				xpTotal: 0,
				level: 1
			}
		};
	}

	saveData() {
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
		} catch (e) {
			console.error('Failed to save achievement data:', e);
		}
	}

	on(event, callback) {
		this.listeners.push({ event, callback });
	}

	emit(event, data) {
		this.listeners
			.filter(l => l.event === event)
			.forEach(l => l.callback(data));
	}

	addProgress(achievementId, amount = 1) {
		const achievement = ACHIEVEMENTS[achievementId];
		if (!achievement) {
			console.warn(`Achievement not found: ${achievementId}`);
			return;
		}

		const state = this.data.achievements[achievementId];
		if (state.unlocked) return;

		state.progress = Math.min(state.progress + amount, achievement.maxProgress);

		if (state.progress >= achievement.maxProgress) {
			this.unlock(achievementId);
		} else {
			this.saveData();
			this.emit('progress', { achievementId, progress: state.progress });
		}
	}

	setProgress(achievementId, value) {
		const achievement = ACHIEVEMENTS[achievementId];
		if (!achievement) return;

		const state = this.data.achievements[achievementId];
		if (state.unlocked) return;

		state.progress = Math.min(value, achievement.maxProgress);

		if (state.progress >= achievement.maxProgress) {
			this.unlock(achievementId);
		} else {
			this.saveData();
			this.emit('progress', { achievementId, progress: state.progress });
		}
	}

	unlock(achievementId) {
		const achievement = ACHIEVEMENTS[achievementId];
		if (!achievement) return;

		const state = this.data.achievements[achievementId];
		if (state.unlocked) return;

		state.unlocked = true;
		state.timestamp = Date.now();
		state.progress = achievement.maxProgress;

		this.data.stats.xpTotal += achievement.xp;

		const oldLevel = this.data.stats.level;
		const newLevel = this.calculateLevel(this.data.stats.xpTotal);
		this.data.stats.level = newLevel;

		this.saveData();

		this.emit('unlock', {
			achievement,
			totalXP: this.data.stats.xpTotal,
			unlockedCount: this.getUnlockedCount(),
			totalCount: Object.keys(ACHIEVEMENTS).length
		});

		if (newLevel > oldLevel) {
			const levelData = LEVELS.find(l => l.level === newLevel);
			this.emit('levelup', { level: newLevel, name: levelData?.name || 'Master' });
		}

		this.checkSpecialAchievements();
	}

	checkSpecialAchievements() {
		const unlockedCount = this.getUnlockedCount();
		const totalCount = Object.keys(ACHIEVEMENTS).length;

		if (unlockedCount === totalCount - 1) {
			const completionistState = this.data.achievements['completionist'];
			if (!completionistState.unlocked) {
				this.unlock('completionist');
			}
		}

		const firstVisit = this.data.stats.firstVisit;
		const elapsed = (Date.now() - firstVisit) / 1000 / 60;

		if (elapsed <= 5 && unlockedCount >= totalCount - 1) {
			const speedState = this.data.achievements['speed-runner'];
			if (!speedState.unlocked) {
				this.unlock('speed-runner');
			}
		}
	}

	calculateLevel(xp) {
		for (let i = LEVELS.length - 1; i >= 0; i--) {
			if (xp >= LEVELS[i].xpRequired) {
				return LEVELS[i].level;
			}
		}
		return 1;
	}

	getUnlockedCount() {
		return Object.values(this.data.achievements).filter(a => a.unlocked).length;
	}

	getAllAchievements() {
		return Object.keys(ACHIEVEMENTS).map(id => ({
			...ACHIEVEMENTS[id],
			...this.data.achievements[id]
		}));
	}

	getAchievement(id) {
		return {
			...ACHIEVEMENTS[id],
			...this.data.achievements[id]
		};
	}

	getStats() {
		return { ...this.data.stats };
	}

	incrementTime() {
		this.data.stats.timeOnSite++;
		this.saveData();

		if (this.data.stats.timeOnSite >= 120) {
			this.setProgress('deep-dive', 120);
		} else {
			this.setProgress('deep-dive', this.data.stats.timeOnSite);
		}
	}

	updateVisit() {
		this.data.stats.totalVisits++;
		this.data.stats.lastVisit = Date.now();
		this.saveData();
	}
}
