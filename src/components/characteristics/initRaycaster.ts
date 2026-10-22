import * as THREE from "three";
import { type Ref } from "vue";

type Props = {
	result: {
		scene: THREE.Scene;
		camera: THREE.Camera;
	};
	characteristicsCanvas: Ref<HTMLCanvasElement | null>;
};

export default function initRaycaster(options: Props) {
	const raycaster = new THREE.Raycaster();
	raycaster.layers.set(1);
	const pointer = new THREE.Vector2();

	function canvasClick(event: MouseEvent): THREE.Mesh | undefined {
		const canvas = options.characteristicsCanvas.value;
		if (!canvas) return;

		const rect = canvas.getBoundingClientRect();

		pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
		pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

		raycaster.setFromCamera(pointer, options.result.camera);

		const intersections = raycaster.intersectObjects(
			options.result.scene.children,
			true,
		);

		const firstMeshIntersection = intersections.find(
			(intersection) =>
				intersection.object instanceof THREE.Mesh &&
				intersection.object.userData.isComparisonBar === true,
		);

		if (firstMeshIntersection?.object instanceof THREE.Mesh) {
			return firstMeshIntersection.object;
		}
	}

	return { canvasClick };
}
