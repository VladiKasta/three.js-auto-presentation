import { MeshoptDecoder } from "meshoptimizer";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import audiLogoUrl from "../../assets/audi_logo.glb?url";
import bmwLogoUrl from "../../assets/bmw_logo.glb?url";
import mercedesLogoUrl from "../../assets/mercedes_logo.glb?url";
import porscheLogoUrl from "../../assets/porsche_logo.glb?url";
import teslaLogoUrl from "../../assets/tesla_logo.glb?url";

type CarModelConfig = {
	url: string;
	color?: number;
};

const SILVER_COLOR = 0xc0c0c0;

const carModels: CarModelConfig[] = [
	{ url: porscheLogoUrl },

	{ url: audiLogoUrl },
	{ url: bmwLogoUrl },
	{ url: mercedesLogoUrl, color: SILVER_COLOR },

	{ url: teslaLogoUrl },
];

const NORMALIZED_MODEL_SIZE = 1;
const MODEL_STEP = 2;
const MODEL_FORWARD_POSITION = 2;
const LOGO_GLOW_COLOR = SILVER_COLOR;
const LOGO_GLOW_INTENSITY = 0.01;

export type ModelLoadProgress = (progress: number | null) => void;

// Функция для нормализации модели: центрирование и масштабирование
export function normalizeModel(
	model: THREE.Object3D,
	targetSize = NORMALIZED_MODEL_SIZE,
) {
	model.updateMatrixWorld(true);

	const boundingBox = new THREE.Box3().setFromObject(model);
	if (boundingBox.isEmpty()) return model;

	const size = boundingBox.getSize(new THREE.Vector3());
	const center = boundingBox.getCenter(new THREE.Vector3());
	const maxDimension = Math.max(size.x, size.y, size.z);

	if (maxDimension === 0) return model;

	const centeredGroup = new THREE.Group();
	centeredGroup.add(model);
	centeredGroup.position.copy(center).multiplyScalar(-1);

	const normalizedGroup = new THREE.Group();
	normalizedGroup.add(centeredGroup);
	normalizedGroup.scale.setScalar(targetSize / maxDimension);

	return normalizedGroup;
}

// Функция для подсветки логотипа
function prepareLogoMaterial(model: THREE.Object3D, color?: number) {
	model.traverse((object) => {
		if (!(object instanceof THREE.Mesh)) return;
		object.castShadow = true;
		object.receiveShadow = true;

		const sourceMaterials = Array.isArray(object.material)
			? object.material
			: [object.material];

		const glowingMaterials = sourceMaterials.map((sourceMaterial) => {
			const material = sourceMaterial.clone();

			if (material instanceof THREE.MeshStandardMaterial) {
				if (color !== undefined) {
					material.color.setHex(color);
					material.map = null;
					material.vertexColors = false;
					material.roughness = 0.25;
				}

				material.emissive.setHex(LOGO_GLOW_COLOR);
				material.emissiveIntensity = LOGO_GLOW_INTENSITY;
				material.needsUpdate = true;
				material.metalness = 0.7;
			}

			return material;
		});

		object.material = Array.isArray(object.material)
			? glowingMaterials
			: glowingMaterials[0];
	});
}

export async function loadAllCars(
	group: THREE.Group,
): Promise<{ finished?: boolean; error?: string }> {
	try {
		const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
		// Перебираем массив путей и превращаем его в массив Промисов
		const results = await Promise.all(
			carModels.map(({ url }) => loader.loadAsync(url)),
		);

		// В results вернется массив загруженных gltf-объектов в том же порядке
		results.forEach((gltf, index) => {
			prepareLogoMaterial(gltf.scene, carModels[index].color);
			const normalizedModel = normalizeModel(gltf.scene);

			const xPosition = (index - (results.length - 1) / 2) * MODEL_STEP;

			normalizedModel.position.set(xPosition, 0, MODEL_FORWARD_POSITION);
			group.add(normalizedModel);
		});

		return {
			finished: true,
		};
	} catch (error) {
		console.error("Ошибка при загрузке одной из моделей", error);
		return {
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
}
