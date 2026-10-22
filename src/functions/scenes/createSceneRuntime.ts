import * as THREE from "three";
import resize, { type ResizeCallback } from "../resize";

type SceneRuntimeOptions = {
	cameraPosition: [number, number, number];
	cameraTarget?: [number, number, number];
	fov?: number;
	defaultLights?: boolean;
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
	const camera = new THREE.PerspectiveCamera(options.fov ?? 75, 1, 0.2, 1000);
	const cameraTarget = options.cameraTarget ?? [0, 0, 0];
	camera.position.set(...options.cameraPosition);
	camera.lookAt(...cameraTarget);

	const renderer = new THREE.WebGLRenderer({
		canvas,
		antialias: true,
		powerPreference: "high-performance",
		alpha: true,
	});
	renderer.setPixelRatio(1);

	renderer.outputColorSpace = THREE.SRGBColorSpace;
	renderer.toneMapping = THREE.ACESFilmicToneMapping;

	if (options.defaultLights !== false) {
		const ambient = new THREE.AmbientLight(0xffffff, 1);
		const dirLight = new THREE.DirectionalLight(0xffffff, 3);
		const accentLight = new THREE.PointLight(0xff6a00, 30, 10);

		accentLight.position.set(-4, 3, 2);
		dirLight.position.set(1, -2, 2);
		scene.add(ambient, dirLight, accentLight);
	}

	const frameCallbacks = new Set<FrameCallback>();
	const resizeCallbacks = new Set<ResizeCallback>();
	const cleanupCallbacks = new Set<() => void>();
	let animationFrameId = 0;
	let disposed = false;
	let running = false;

	const animate = () => {
		if (disposed || !running) return;
		frameCallbacks.forEach((callback) => callback());
		renderer.render(scene, camera);
		animationFrameId = requestAnimationFrame(animate);
	};

	const startRendering = () => {
		if (disposed || running) return;
		running = true;
		animate();
	};

	const stopRendering = () => {
		if (!running) return;
		running = false;
		cancelAnimationFrame(animationFrameId);
	};

	resize(canvas, camera, renderer, resizeCallbacks);
	const handleResize = () => resize(canvas, camera, renderer, resizeCallbacks);
	const handleVisibilityChange = () => {
		if (document.hidden) stopRendering();
		else startRendering();
	};
	const resizeObserver = new ResizeObserver(handleResize);

	resizeObserver.observe(canvas);
	document.addEventListener("visibilitychange", handleVisibilityChange);
	if (!document.hidden) startRendering();

	const dispose = () => {
		if (disposed) return;
		disposed = true;
		stopRendering();
		resizeObserver.disconnect();
		document.removeEventListener("visibilitychange", handleVisibilityChange);
		cleanupCallbacks.forEach((callback) => callback());
		cleanupCallbacks.clear();
		frameCallbacks.clear();
		resizeCallbacks.clear();
		disposeObject(scene);
		renderer.dispose();
	};

	return {
		scene,
		camera,
		renderer,
		dispose,
		isDisposed: () => disposed,
		onFrame: (callback: FrameCallback) => {
			frameCallbacks.add(callback);
			return () => frameCallbacks.delete(callback);
		},
		onResize: (callback: ResizeCallback) => {
			resizeCallbacks.add(callback);

			const width = canvas.clientWidth;
			const height = canvas.clientHeight;
			if (width > 0 && height > 0) callback(width, height);

			return () => resizeCallbacks.delete(callback);
		},
		onDispose: (callback: () => void) => {
			cleanupCallbacks.add(callback);
		},
	};
}
