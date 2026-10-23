import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { shallowRef } from "vue";
import createObjectMap from "../createObjectMap";
import modelLoader, { type ModelLoadProgress } from "../api/modelLoader";
import createSceneRuntime, { disposeObject } from "./createSceneRuntime";

export type InitHomeSceneOptions = {
	onProgress?: ModelLoadProgress;
	mode?: "draft" | "published";
};

function addStudioLighting(scene: THREE.Scene, renderer: THREE.WebGLRenderer) {
	const hemisphere = new THREE.HemisphereLight(0xdde7ff, 0x090706, 0.25);

	const keyLight = new THREE.DirectionalLight(0xfff4e8, 1.6);
	keyLight.position.set(-4, 7, 6);
	keyLight.target.position.set(0, 0, 0);
	keyLight.castShadow = true;
	keyLight.shadow.mapSize.set(2048, 2048);
	keyLight.shadow.bias = -0.0002;
	keyLight.shadow.normalBias = 0.025;
	keyLight.shadow.camera.left = -4;
	keyLight.shadow.camera.right = 4;
	keyLight.shadow.camera.top = 4;
	keyLight.shadow.camera.bottom = -4;
	keyLight.shadow.camera.near = 1;
	keyLight.shadow.camera.far = 20;

	const fillLight = new THREE.RectAreaLight(0xb8ccff, 1.2, 5, 4);
	fillLight.position.set(5, 3, 4);
	fillLight.lookAt(0, 0, 0);

	const topLight = new THREE.RectAreaLight(0xffffff, 1.4, 5, 3);
	topLight.position.set(-1, 5, 1);
	topLight.lookAt(0, 0, 0);

	const rimLight = new THREE.RectAreaLight(0xff5a16, 2, 4, 3);
	rimLight.position.set(-4, 2, -3);
	rimLight.lookAt(0, 0, 0);

	scene.add(
		hemisphere,
		keyLight,
		keyLight.target,
		fillLight,
		topLight,
		rimLight,
	);

	const environmentScene = new RoomEnvironment();
	const pmremGenerator = new THREE.PMREMGenerator(renderer);
	const environment = pmremGenerator.fromScene(environmentScene, 0.04).texture;
	scene.environment = environment;
	scene.environmentIntensity = 0.35;

	environmentScene.dispose();
	pmremGenerator.dispose();

	return () => environment.dispose();
}

function prepareCarForStudio(model: THREE.Object3D, scene: THREE.Scene) {
	model.traverse((object) => {
		if (!(object instanceof THREE.Mesh)) return;
		object.castShadow = true;
		object.receiveShadow = true;
	});

	model.updateMatrixWorld(true);
	const bounds = new THREE.Box3().setFromObject(model);
	if (bounds.isEmpty()) return;

	const floor = new THREE.Mesh(
		new THREE.PlaneGeometry(12, 12),
		new THREE.ShadowMaterial({
			color: 0x000000,
			opacity: 0.35,
			transparent: true,
		}),
	);
	floor.rotation.x = -Math.PI / 2;
	floor.position.y = bounds.min.y - 0.015;
	floor.receiveShadow = true;
	scene.add(floor);
}

export default function initHomeScene(
	canvas: HTMLCanvasElement,
	options: InitHomeSceneOptions = {},
) {
	const runtime = createSceneRuntime(canvas, {
		cameraPosition: [0, 3, 5],
		defaultLights: false,
	});

	const modelObject = shallowRef<THREE.Object3D | null>(null);

	runtime.renderer.shadowMap.enabled = true;
	runtime.renderer.shadowMap.type = THREE.PCFShadowMap;
	runtime.renderer.toneMappingExposure = 0.85;
	runtime.renderer.outputColorSpace = THREE.SRGBColorSpace;

	runtime.onDispose(addStudioLighting(runtime.scene, runtime.renderer));

	const mode = options.mode ?? "published";

	const modelReady = modelLoader(options.onProgress, mode).then((model) => {
		if (runtime.isDisposed()) {
			disposeObject(model);
			return;
		}

		const map = createObjectMap(model);
		console.log(map);

		prepareCarForStudio(model, runtime.scene);

		runtime.scene.add(model);
		modelObject.value = model;
	});

	return {
		...runtime,
		modelObject,
		modelReady,
	};
}
