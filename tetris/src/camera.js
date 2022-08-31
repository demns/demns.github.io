import { Scene, PerspectiveCamera, WebGLRenderer } from 'three';
import { height, width } from './config';

const camera = new PerspectiveCamera(75, width / height, 0.1, 1000);
// FOV for VR needs to be around 80°
// aspect ratio
// near/far 
export default camera;
