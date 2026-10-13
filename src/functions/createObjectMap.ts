import * as THREE from "three";

export default function createCarMap(model: THREE.Object3D) {
	const parts = {
		body: [] as THREE.Mesh[],

		windows: [] as THREE.Mesh[],

		headlights: [] as THREE.Mesh[],
		headlightGlass: [] as THREE.Mesh[],
		taillights: [] as THREE.Mesh[],
		emissiveLights: [] as THREE.Mesh[],
		emissiveLights2: [] as THREE.Mesh[],

		tires: [] as THREE.Mesh[],

		rims: [] as THREE.Mesh[],
		rimColor: [] as THREE.Mesh[],

		brakeDiscs: [] as THREE.Mesh[],
		calipers: [] as THREE.Mesh[],

		exteriorPlastic: [] as THREE.Mesh[],
		grilles: [] as THREE.Mesh[],
		badges: [] as THREE.Mesh[],
		mirrors: [] as THREE.Mesh[],
	};

	const pushUnique = (array: THREE.Mesh[], mesh: THREE.Mesh) => {
		if (!array.includes(mesh)) {
			array.push(mesh);
		}
	};

	model.traverse((object) => {
		if (!(object instanceof THREE.Mesh)) return;

		const materials = Array.isArray(object.material)
			? object.material
			: [object.material];

		for (const material of materials) {
			const name = material.name.toLowerCase();

			if (name.includes("carpaint")) {
				pushUnique(parts.body, object);
			}

			if (name === "windows") {
				pushUnique(parts.windows, object);
			}

			if (name === "light" || name.includes("light_r")) {
				pushUnique(parts.headlights, object);
				console.log(object);
				//object.material.color = new THREE.Color(0x000000);

				if (material instanceof THREE.MeshStandardMaterial) {
					console.log("map", material.map);
					console.log("emissiveMap", material.emissiveMap);

					material.emissive.set(0xffffff);
					material.emissiveIntensity = 10;
				}
			}

			if (name === "disk") {
				pushUnique(parts.brakeDiscs, object);
				//console.log(object);
				//object.material.color = new THREE.Color(0x000000);
			}

			if (name.includes("glass_light")) {
				pushUnique(parts.headlightGlass, object);
			}

			if (name.includes("red_glass")) {
				pushUnique(parts.taillights, object);
			}

			if (name.includes("emiss")) {
				pushUnique(parts.emissiveLights, object);
				//material.color.set(0xff00ff);
			}

			if (name.includes("emiss1")) {
				pushUnique(parts.emissiveLights2, object);
				material.color.set(0xff00ff);
			}

			if (name === "phong16") {
				pushUnique(parts.calipers, object);
				material.color.set(0xff00ff);
			}

			if (name.includes("tire")) {
				pushUnique(parts.tires, object);
			}

			if (name === "rims") {
				pushUnique(parts.rims, object);
				//object.material.color = new THREE.Color(0xffffff);
			}

			if (name.includes("rim_color")) {
				pushUnique(parts.rimColor, object);
			}

			if (name === "disk") {
				pushUnique(parts.brakeDiscs, object);
			}

			if (name.includes("caliper")) {
				pushUnique(parts.calipers, object);
			}

			if (name.includes("plas_s")) {
				pushUnique(parts.exteriorPlastic, object);
			}

			if (name.includes("grille")) {
				pushUnique(parts.grilles, object);
			}

			if (name.includes("badges")) {
				pushUnique(parts.badges, object);
			}

			if (name.includes("mirrors")) {
				pushUnique(parts.mirrors, object);
			}
		}
	});

	return parts;
}
