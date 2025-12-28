import { ThreePerf } from 'three-perf';

const perf = new ThreePerf({
	position: 'top-left',
	minimal: true,
	renderer: null, // Will be set in application.js
	logsPerSecond: 20,
	customData: {
		fps: {
			show: true
		}
	}
});

// Style the container to be small
perf.dom.style.cssText = `
	position: fixed !important;
	left: 10px !important;
	top: 10px !important;
	z-index: 100 !important;
	width: 80px !important;
	height: 48px !important;
	opacity: 0.9 !important;
`;

export default perf;