import * as THREE from "three";

export default function resize(
	canvas: HTMLCanvasElement,
	camera: THREE.PerspectiveCamera,
	renderer: THREE.WebGLRenderer,
) {
	const width = canvas.clientWidth;
	const height = canvas.clientHeight;

	if (width === 0 || height === 0) return;

	camera.aspect = width / height;
	camera.updateProjectionMatrix();
	//renderer.setPixelRatio(Math.min(window.devicePixelRatio, 0.5));
	renderer.setSize(width, height, false);
}
