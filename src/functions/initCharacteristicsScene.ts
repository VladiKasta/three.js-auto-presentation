import { CSS2DRenderer } from "three/addons/renderers/CSS2DRenderer.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RectAreaLight } from "three";
import * as THREE from "three";
import createSceneRuntime from "./scenes/createSceneRuntime";

const CAMERA_TARGET = new THREE.Vector3(0.8, -1.5, 0);
const LIGHT_TARGET = new THREE.Vector3(3, -1.5, 0);

function addStudioLighting(scene: THREE.Scene) {
	const hemisphere = new THREE.HemisphereLight(0xe8eefc, 0x080a0f, 0.7);

	const keyLight = new THREE.DirectionalLight(0xfff2df, 4.2);
	keyLight.position.set(-6, 10, 12);
	keyLight.target.position.copy(LIGHT_TARGET);
	keyLight.castShadow = true;
	keyLight.shadow.mapSize.set(2048, 2048);
	keyLight.shadow.bias = -0.0004;
	keyLight.shadow.camera.left = -10;
	keyLight.shadow.camera.right = 10;
	keyLight.shadow.camera.top = 10;
	keyLight.shadow.camera.bottom = -10;
	keyLight.shadow.camera.near = 1;
	keyLight.shadow.camera.far = 40;

	const fillLight = new RectAreaLight(0xaec4ff, 2.8, 9, 8);
	fillLight.position.set(10, 5, 10);
	fillLight.lookAt(LIGHT_TARGET);

	const rimLight = new RectAreaLight(0xff6a00, 4, 7, 8);
	rimLight.position.set(4, 6, -7);
	rimLight.lookAt(LIGHT_TARGET);

	scene.add(
		hemisphere,
		keyLight,
		keyLight.target,
		fillLight,
		rimLight,
	);
}

export default function initCharacteristicsScene(canvas: HTMLCanvasElement) {
	const runtime = createSceneRuntime(canvas, {
		cameraPosition: [3.5, 3.8, 23],
		cameraTarget: [CAMERA_TARGET.x, CAMERA_TARGET.y, CAMERA_TARGET.z],
		fov: 34,
		defaultLights: false,
	});
	const controls = new OrbitControls(runtime.camera, canvas);
	runtime.camera.layers.enable(1);

	runtime.renderer.shadowMap.enabled = true;
	runtime.renderer.shadowMap.type = THREE.PCFShadowMap;
	runtime.renderer.toneMappingExposure = 1.05;
	addStudioLighting(runtime.scene);

	controls.enableDamping = true;
	controls.dampingFactor = 0.06;
	controls.enablePan = false;
	controls.target.copy(CAMERA_TARGET);
	controls.minDistance = 20;
	controls.maxDistance = 27;
	controls.minPolarAngle = 1.25;
	controls.maxPolarAngle = 1.48;
	controls.minAzimuthAngle = -0.12;
	controls.maxAzimuthAngle = 0.28;
	controls.update();
	runtime.onFrame(() => controls.update());

	const labelRenderer = new CSS2DRenderer();

	labelRenderer.domElement.style.position = "fixed";
	labelRenderer.domElement.style.inset = "0";
	labelRenderer.domElement.style.pointerEvents = "none";

	document.body.appendChild(labelRenderer.domElement);
	runtime.onResize((width, height) => {
		labelRenderer.setSize(width, height);
	});

	runtime.onFrame(() => {
		labelRenderer.render(runtime.scene, runtime.camera);
	});

	runtime.onDispose(() => {
		controls.dispose();
		labelRenderer.domElement.remove();
	});

	return {
		...runtime,
		controls,
	};
}
