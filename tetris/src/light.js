import { AmbientLight, SpotLight } from 'three';

export function getSpotLight() {
	const spotLight = new SpotLight(0xFFFFFF, 10.0, 100, Math.PI / 3); // Very bright white spotlight
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
	const ambientLight = new AmbientLight(0xFFFFFF, 0.8); // Reduced ambient light for darker, denser shadows
	return ambientLight;
};