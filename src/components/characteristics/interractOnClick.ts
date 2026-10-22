import gsap from "gsap";
import * as THREE from "three";

export const ACTIVE_BAR_COLOR = "#ff6a00";
export const INACTIVE_BAR_COLOR = "#484e59";

function animateColor(object: THREE.Mesh, color: string) {
	const targetColor = new THREE.Color(color);
	const materials = Array.isArray(object.material)
		? object.material
		: [object.material];

	for (const material of materials) {
		if (!("color" in material) || !(material.color instanceof THREE.Color)) {
			continue;
		}

		gsap.killTweensOf(material.color);
		gsap.to(material.color, {
			r: targetColor.r,
			g: targetColor.g,
			b: targetColor.b,
			duration: 0.3,
			ease: "power2.out",
		});
	}
}

export default function interractOnClick(
	scene: THREE.Scene,
	selectedObject: THREE.Mesh,
) {
	scene.traverse((object) => {
		if (
			object instanceof THREE.Mesh &&
			object.userData.isComparisonBar === true
		) {
			animateColor(
				object,
				object === selectedObject ? ACTIVE_BAR_COLOR : INACTIVE_BAR_COLOR,
			);
		}
	});

	const object = selectedObject;
	if (gsap.isTweening(object.position)) return;
	gsap.killTweensOf(object.position);

	gsap.timeline().to(object.position, {
		y: 0 + 0.15,
		duration: 0.25,
		ease: "power2.out",
		yoyo: true,
		repeat: 1,
	});
}
