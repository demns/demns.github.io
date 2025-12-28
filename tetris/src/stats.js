import * as Stats from 'stats-js';

const stats = new Stats();
stats.setMode(0); // 0: fps, 1: ms, 2: mb
stats.domElement.style.position = 'fixed';
stats.domElement.style.left = '10px';
stats.domElement.style.bottom = '10px';
stats.domElement.style.top = 'auto';
stats.domElement.style.right = 'auto';
stats.domElement.style.zIndex = '100';

export default stats;