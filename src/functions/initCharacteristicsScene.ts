import { CSS2DRenderer } from "three/addons/renderers/CSS2DRenderer.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import createSceneRuntime from "./scenes/createSceneRuntime";

export default function initCharacteristicsScene(canvas: HTMLCanvasElement) {
	const runtime = createSceneRuntime(canvas, { cameraPosition: [5, 6, 15] });
	const controls = new OrbitControls(runtime.camera, canvas);

	//runtime.renderer.setPixelRatio(2);
	controls.enableDamping = true;
	runtime.camera.fov = 45;
	runtime.onFrame(() => controls.update());
	runtime.onDispose(() => controls.dispose());

	const labelRenderer = new CSS2DRenderer();

	labelRenderer.setSize(canvas.clientWidth, canvas.clientHeight);
	labelRenderer.domElement.style.position = "fixed";
	labelRenderer.domElement.style.inset = "0";
	labelRenderer.domElement.style.pointerEvents = "none";

	document.body.appendChild(labelRenderer.domElement);

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
