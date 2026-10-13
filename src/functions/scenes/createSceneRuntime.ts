import * as THREE from "three";
import resize from "../resize";

type SceneRuntimeOptions = {
	cameraPosition: [number, number, number];
};

type FrameCallback = () => void;

export function disposeObject(object: THREE.Object3D) {
	object.traverse((child) => {
		const renderable = child as THREE.Object3D & {
			geometry?: THREE.BufferGeometry;
			material?: THREE.Material | THREE.Material[];
		};

		renderable.geometry?.dispose();
		if (!renderable.material) return;

		const materials = Array.isArray(renderable.material)
			? renderable.material
			: [renderable.material];

		for (const material of materials) {
			for (const value of Object.values(material)) {
				if (value instanceof THREE.Texture) value.dispose();
			}
			material.dispose();
		}
	});
}

export default function createSceneRuntime(
	canvas: HTMLCanvasElement,
	options: SceneRuntimeOptions,
) {
	const scene = new THREE.Scene();
	const camera = new THREE.PerspectiveCamera(75, 1, 0.2, 1000);
	camera.position.set(...options.cameraPosition);
	camera.lookAt(0, 0, 0);

	const renderer = new THREE.WebGLRenderer({
		canvas,
		antialias: true,
		powerPreference: "high-performance",
		alpha: true,
	});
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

	renderer.outputColorSpace = THREE.SRGBColorSpace;
	renderer.toneMapping = THREE.ACESFilmicToneMapping;

	const ambient = new THREE.AmbientLight(0xffffff, 1);
	const dirLight = new THREE.DirectionalLight(0xffffff, 3);
	const accentLight = new THREE.PointLight(0xff6a00, 30, 10);

	accentLight.position.set(-4, 3, 2);

	scene.add(accentLight);
	dirLight.position.set(1, -2, 2);
	scene.add(ambient, dirLight);

	const frameCallbacks = new Set<FrameCallback>();
	const cleanupCallbacks = new Set<() => void>();
	let animationFrameId = 0;
	let disposed = false;

	const animate = () => {
		if (disposed) return;
		animationFrameId = requestAnimationFrame(animate);
		frameCallbacks.forEach((callback) => callback());
		renderer.render(scene, camera);
	};

	resize(canvas, camera, renderer);
	const handleResize = () => resize(canvas, camera, renderer);
	window.addEventListener("resize", handleResize);
	animate();

	const dispose = () => {
		if (disposed) return;
		disposed = true;
		window.removeEventListener("resize", handleResize);
		cancelAnimationFrame(animationFrameId);
		cleanupCallbacks.forEach((callback) => callback());
		cleanupCallbacks.clear();
		frameCallbacks.clear();
		disposeObject(scene);
		renderer.dispose();
	};

	return {
		scene,
		camera,
		renderer,
		animate,
		dispose,
		isDisposed: () => disposed,
		onFrame: (callback: FrameCallback) => {
			frameCallbacks.add(callback);
			return () => frameCallbacks.delete(callback);
		},
		onDispose: (callback: () => void) => {
			cleanupCallbacks.add(callback);
		},
	};
}
