import * as Stats from 'stats-js';

const stats = new Stats();
stats.setMode(0);
stats.domElement.style.position = 'fixed';
stats.domElement.style.left = '10px';
stats.domElement.style.top = '10px';
stats.domElement.style.bottom = 'auto';
stats.domElement.style.right = 'auto';
stats.domElement.style.zIndex = '100';

export default stats;