// tells how to display a content

import { PCFSoftShadowMap, WebGLRenderer } from 'three'; // most performant and feature-rich
import { height, width } from './config';

const renderer = new WebGLRenderer({antialias: true});
renderer.setSize(width, height);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

export default renderer;