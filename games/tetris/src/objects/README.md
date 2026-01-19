I is from https://threejs.org/editor/

Usage
```
import { ObjectLoader } from 'three';
import * as I from '../objects/I';

export default function getIModel() {
	const loader = new ObjectLoader();
	const model = loader.parse(I);
	model.castShadow = true;
	model.receiveShadow = true;

	return model;
};
```