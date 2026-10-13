import * as THREE from "three";
import { shallowRef } from "vue";
import createObjectMap from "../createObjectMap";
import modelLoader, { type ModelLoadProgress } from "../modelLoader";
import createSceneRuntime, { disposeObject } from "./createSceneRuntime";

export type InitHomeSceneOptions = {
	onProgress?: ModelLoadProgress;
};

export default function initHomeScene(
	canvas: HTMLCanvasElement,
	options: InitHomeSceneOptions = {},
) {
	const runtime = createSceneRuntime(canvas, { cameraPosition: [0, 3, 5] });
	const modelObject = shallowRef<THREE.Object3D | null>(null);

	const modelReady = modelLoader(options.onProgress).then((model) => {
		if (runtime.isDisposed()) {
			disposeObject(model);
			return;
		}

		const map = createObjectMap(model);
		console.log(map);
		runtime.scene.add(model);
		modelObject.value = model;
	});

	return {
		...runtime,
		modelObject,
		modelReady,
	};
}
