import { AmbientLight, SpotLight } from 'three';

export function getSpotLight() {
	const spotLight = new SpotLight(0x88FF00, 1, 100, 40)
	spotLight.castShadow = true;

	return spotLight;
};

export function getAmbientLight() {
	const ambientLight = new AmbientLight(0x88FF00, 1, 100, 40)
	ambientLight.castShadow = true;

	return ambientLight;
};