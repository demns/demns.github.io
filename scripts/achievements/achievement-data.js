export const ACHIEVEMENTS = {
	'first-contact': {
		id: 'first-contact',
		title: 'First Contact',
		description: 'Welcome to my portfolio!',
		icon: '🎯',
		xp: 10,
		tier: 'easy',
		maxProgress: 1
	},
	'curious-observer': {
		id: 'curious-observer',
		title: 'Curious Observer',
		description: 'You scrolled! There\'s more to see.',
		icon: '👀',
		xp: 10,
		tier: 'easy',
		maxProgress: 1
	},
	'connector': {
		id: 'connector',
		title: 'Connector',
		description: 'Connected with me on social media',
		icon: '🔗',
		xp: 15,
		tier: 'easy',
		maxProgress: 1
	},
	'investigator': {
		id: 'investigator',
		title: 'Investigator',
		description: 'Explored at least 3 of my projects',
		icon: '🔍',
		xp: 20,
		tier: 'medium',
		maxProgress: 3
	},
	'gamer': {
		id: 'gamer',
		title: 'Gamer',
		description: 'Played all my games',
		icon: '🎮',
		xp: 30,
		tier: 'medium',
		maxProgress: 3
	},
	'deep-dive': {
		id: 'deep-dive',
		title: 'Deep Dive',
		description: 'Spent quality time exploring',
		icon: '📚',
		xp: 25,
		tier: 'medium',
		maxProgress: 120
	},
	'easter-egg-hunter': {
		id: 'easter-egg-hunter',
		title: 'Easter Egg Hunter',
		description: 'Discovered all hidden secrets',
		icon: '🕵️',
		xp: 40,
		tier: 'medium',
		maxProgress: 5
	},
	'theme-master': {
		id: 'theme-master',
		title: 'Theme Master',
		description: 'Appreciated the theme support',
		icon: '🌓',
		xp: 15,
		tier: 'medium',
		maxProgress: 1
	},
	'tetris-master': {
		id: 'tetris-master',
		title: 'Tetris Master',
		description: 'Score 1000+ points OR clear 4 lines at once',
		icon: '🏆',
		xp: 50,
		tier: 'hard',
		maxProgress: 1000
	},
	'tic-tac-pro': {
		id: 'tic-tac-pro',
		title: 'Tic Tac Pro',
		description: 'Draw 3 games against optimal strategy',
		icon: '🎯',
		xp: 35,
		tier: 'hard',
		maxProgress: 3
	},
	'santa-helper': {
		id: 'santa-helper',
		title: 'Santa Helper',
		description: 'Reach distance 1000 in Deer Santa',
		icon: '🎅',
		xp: 30,
		tier: 'hard',
		maxProgress: 1
	},
	'speed-runner': {
		id: 'speed-runner',
		title: 'Speed Runner',
		description: 'Unlock all achievements within 5 minutes',
		icon: '⏱️',
		xp: 100,
		tier: 'elite',
		maxProgress: 1
	},
	'completionist': {
		id: 'completionist',
		title: 'Completionist',
		description: 'You found everything! I\'m impressed.',
		icon: '💯',
		xp: 150,
		tier: 'elite',
		maxProgress: 12
	}
};

export const LEVELS = [
	{ level: 1, name: 'Visitor', xpRequired: 0 },
	{ level: 2, name: 'Explorer', xpRequired: 30 },
	{ level: 3, name: 'Enthusiast', xpRequired: 80 },
	{ level: 4, name: 'Completionist', xpRequired: 150 },
	{ level: 5, name: 'Master', xpRequired: 300 }
];

export const TOTAL_XP = Object.values(ACHIEVEMENTS).reduce((sum, ach) => sum + ach.xp, 0);
