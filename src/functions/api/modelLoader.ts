import { MeshoptDecoder } from "meshoptimizer";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export type ModelLoadProgress = (progress: number | null) => void;

const STRAPI_URL = "http://localhost:1337";
export type ModelStatus = "draft" | "published";

export default async function modelLoader(
	onProgress?: ModelLoadProgress,
	status: ModelStatus = "published",
): Promise<THREE.Group> {
	const response = await fetch(
		`http://localhost:1337/api/scene?populate=model&status=${status}`,
	);

	if (!response.ok) {
		throw new Error(`Strapi API error: ${response.status}`);
	}

	const { data } = await response.json();

	// В Strapi поле model содержит массив файлов
	const modelPath = data?.model?.[0]?.url;

	if (!modelPath) {
		throw new Error("3D-модель не найдена в Strapi");
	}

	const modelUrl = new URL(modelPath, STRAPI_URL).href;

	const loader = new GLTFLoader();
	loader.setMeshoptDecoder(MeshoptDecoder);

	const gltf = await loader.loadAsync(modelUrl, (event) => {
		onProgress?.(event.total > 0 ? event.loaded / event.total : null);
	});

	const model = gltf.scene;

	const box = new THREE.Box3().setFromObject(model);
	const size = box.getSize(new THREE.Vector3());
	const center = box.getCenter(new THREE.Vector3());

	model.position.sub(center);

	const maxSize = Math.max(size.x, size.y, size.z);

	if (maxSize > 0) {
		const scale = 2 / maxSize;
		model.scale.setScalar(scale);
	}

	return model;
}
