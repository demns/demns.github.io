// scene's main purpose is a container for camera/lights/objects

import { Scene, Color } from 'three';

const scene = new Scene();
scene.background = new Color(0x505050); // Medium gray background

export default scene;