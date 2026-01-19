import { AmbientLight, SpotLight, PointLight, DirectionalLight, HemisphereLight } from 'three';

export function getSpotLight() {
	const spotLight = new SpotLight(0xFFFFFF, 15.0, 100, Math.PI / 4, 0.3, 1); // 25% less from 20.0
	spotLight.castShadow = true;

	// Shadow settings for better quality and visibility
	spotLight.shadow.mapSize.width = 2048;
	spotLight.shadow.mapSize.height = 2048;
	spotLight.shadow.camera.near = 0.5;
	spotLight.shadow.camera.far = 50;
	spotLight.shadow.bias = -0.0001;

	return spotLight;
};

export function getAmbientLight() {
	const ambientLight = new AmbientLight(0xFFFFFF, 0.45); // 25% less from 0.6
	return ambientLight;
};

export function getPointLight() {
	const pointLight = new PointLight(0xFFFFFF, 4.0, 50); // Increased since we only use one now
	pointLight.castShadow = false; // Point lights for fill, no shadows
	return pointLight;
};

export function getHemisphereLight() {
	// Sky color (top) and ground color (bottom) for natural lighting
	const hemiLight = new HemisphereLight(0xFFEEDD, 0x4455AA, 0.75); // 25% less from 1.0
	return hemiLight;
};

export function getDirectionalLight() {
	const dirLight = new DirectionalLight(0xFFFFFF, 0.6); // 25% less from 0.8
	dirLight.castShadow = true;
	dirLight.shadow.mapSize.width = 1024; // Reduced from 2048 for performance
	dirLight.shadow.mapSize.height = 1024;
	return dirLight;
};