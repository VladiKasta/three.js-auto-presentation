import gsap from "gsap";
import * as THREE from "three";
import { competitors } from "./competitors";
import {
	ACTIVE_BAR_COLOR,
	INACTIVE_BAR_COLOR,
} from "./interractOnClick";
import { loadAllCars } from "./logoModelsLoader";

export default async function createGeometries(
	maxCharacteristic: number,
	step: number,
	scene: THREE.Scene,
) {
	const geometryGroup = new THREE.Group();
	const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
	boxGeometry.translate(0, 0.5, 0);
	const bars: Array<{ mesh: THREE.Mesh; targetHeight: number }> = [];

	for (let i = 0; i < competitors.length; i++) {
		const boxMaterial = new THREE.MeshStandardMaterial({
			color: i === 0 ? ACTIVE_BAR_COLOR : INACTIVE_BAR_COLOR,
			metalness: 0.35,
			roughness: 0.35,
		});

		const box = new THREE.Mesh(boxGeometry, boxMaterial);
		box.name = competitors[i].id;
		box.userData.isComparisonBar = true;
		box.userData.competitorId = competitors[i].id;
		box.layers.set(1);
		box.castShadow = true;
		box.receiveShadow = true;
		const xPosition = (i - (competitors.length - 1) / 2) * step;
		box.position.set(xPosition, 0, 0);

		geometryGroup.add(box);

		const targetHeight = THREE.MathUtils.mapLinear(
			competitors[i].power,
			0,
			maxCharacteristic,
			0,
			7,
		);

		bars.push({ mesh: box, targetHeight });
	}

	const timeline = gsap.timeline({
		defaults: {
			duration: 1.5,
			overwrite: "auto",
		},
	});

	timeline
		.fromTo(
			geometryGroup.position,
			{ x: -15, y: -5, z: 0 },
			{ x: 3, y: -5, z: 0, ease: "power3.out" },
		)
		.fromTo(
			geometryGroup.rotation,
			{ y: -Math.PI * 2, z: -Math.PI / 4 },
			{ y: 0, z: 0, ease: "power3.out" },
			"<",
		);

	for (let i = 0; i < bars.length; i++) {
		timeline.to(
			bars[i].mesh.scale,
			{
				y: bars[i].targetHeight,
				duration: 1 + i * 0.1,
				ease: "power2.inOut",
			},
			0.3,
		);
	}

	scene.add(geometryGroup);

	const { finished, error } = await loadAllCars(geometryGroup);
	return finished
		? { finished: true, geometryGroup, timeline }
		: { finished: false, error, geometryGroup, timeline };
}
