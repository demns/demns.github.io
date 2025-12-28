import { AmbientLight, SpotLight } from 'three';

export function getSpotLight() {
	const spotLight = new SpotLight(0xFF3333, 1, 100, 40) // Red light
	spotLight.castShadow = true;

	return spotLight;
};

export function getAmbientLight() {
	const ambientLight = new AmbientLight(0xFF6666, 0.5) // Soft red ambient
	return ambientLight;
};