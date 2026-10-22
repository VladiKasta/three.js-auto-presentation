import * as THREE from "three";

export type ResizeCallback = (width: number, height: number) => void;

export default function resize(
	canvas: HTMLCanvasElement,
	camera: THREE.PerspectiveCamera,
	renderer: THREE.WebGLRenderer,
	callbacks: Iterable<ResizeCallback> = [],
) {
	const width = canvas.clientWidth;
	const height = canvas.clientHeight;

	if (width === 0 || height === 0) return;

	camera.aspect = width / height;
	camera.updateProjectionMatrix();
	//renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
	renderer.setSize(width, height, false);

	for (const callback of callbacks) {
		callback(width, height);
	}
}
