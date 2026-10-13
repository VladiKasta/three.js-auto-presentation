import * as THREE from "three";

export default function createRoom(scene: THREE.Scene) {
	const geometry = new THREE.CylinderGeometry(50, 50, 40, 64, 1, true);

	const material = new THREE.MeshStandardMaterial({
		color: "#101216",
		side: THREE.BackSide,
		roughness: 1,
	});

	const studio = new THREE.Mesh(geometry, material);

	studio.position.y = 15;

	scene.add(studio);

	return studio;
}
