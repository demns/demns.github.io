import * as Stats from 'stats-js';

const stats = new Stats();
stats.setMode(0);
stats.domElement.style.position = 'absolute';
stats.domElement.style.right = '0px';
stats.domElement.style.bottom = '0px';
stats.domElement.style.top = 'auto';
stats.domElement.style.left = 'auto';

export default stats;