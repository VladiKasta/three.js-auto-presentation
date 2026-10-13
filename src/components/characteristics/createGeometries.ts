import gsap from "gsap";
import * as THREE from "three";
import { competitors } from "./competitors";

export default function createGeometries(
	maxCharacteristic: number,
	step: number,
	scene: THREE.Scene,
) {
	const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
	boxGeometry.translate(0, 0.5, 0);

	for (let i = 0; i < competitors.length; i++) {
		const boxMaterial = new THREE.MeshStandardMaterial({
			color: competitors[i].color,
			metalness: 0.35,
			roughness: 0.35,
		});

		const box = new THREE.Mesh(boxGeometry, boxMaterial);
		const xPosition = (i - (competitors.length - 1) / 2) * step;
		box.position.set(xPosition, 0, 0);
		scene.add(box);

		const targetHeight = THREE.MathUtils.mapLinear(
			competitors[i].power,
			0,
			maxCharacteristic,
			0,
			7,
		);

		gsap.to(box.scale, {
			y: targetHeight,
			duration: 1 + i * 0.1,
			ease: "power2.inOut",
			overwrite: true,
		});
	}
}
