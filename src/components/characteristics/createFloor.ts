import * as THREE from "three";

import { competitors } from "./competitors";

export default function createFloor(step = 1) {
	const floorGeometry = new THREE.PlaneGeometry(competitors.length * step, 3);
	const floorMaterial = new THREE.MeshStandardMaterial({
		color: "#484e59",
		metalness: 0.35,

		side: THREE.DoubleSide,
	});

	const floor = new THREE.Mesh(floorGeometry, floorMaterial);

	floor.rotation.x = -Math.PI / 2;
	floor.position.y = -0.02;
	floor.receiveShadow = true;

	const edges = new THREE.EdgesGeometry(floorGeometry);
	const lineMaterial = new THREE.LineBasicMaterial({
		color: "#484e59",
		linewidth: 2,
	});

	const line = new THREE.LineSegments(edges, lineMaterial);
	floor.add(line);

	return floor;
}
