import * as THREE from "three";
import { CSS2DObject } from "three/addons/renderers/CSS2DRenderer.js";

type Options = {
	height: number;
	floor: THREE.Object3D;
};

export default function createVerticalLine(options: Options) {
	// 1. Задаем две точки: начало на плоскости (Y = 0) и конец вверху (Y = height)
	const { height, floor } = options;

	const boundingBox = new THREE.Box3();
	boundingBox.setFromObject(floor);
	const x = boundingBox.max.x;
	const z = boundingBox.min.z;

	const group = new THREE.Group(); // Объединим линию и засечки в одну группу
	const tickWidth = 0.3; // Ширина засечки (на сколько она выступает влево и вправо)

	const points = [
		new THREE.Vector3(x, 0, z), // Стартовая точка
		new THREE.Vector3(x, height, z), // Конечная точка
	];

	// 2. Создаем геометрию из этих точек
	const geometry = new THREE.BufferGeometry().setFromPoints(points);

	// 3. Создаем материал для линии
	const material = new THREE.LineBasicMaterial({
		color: "#484e59",
		linewidth: 2, // Толщина (работает не во всех браузерах, обычно 1px)
	});

	// 4. Собираем линию
	const line = new THREE.Line(geometry, material);

	group.add(line);

	// 2. Цикл для создания горизонтальных делений
	const lineMaterial = new THREE.LineBasicMaterial({ color: "#ff6a00" });

	for (let y = 0; y <= height; y += 1) {
		// Вычисляем координаты левой и правой точки засечки
		const tickPoints = [
			new THREE.Vector3(x - tickWidth / 2, y, z), // Левая точка
			new THREE.Vector3(x + tickWidth / 2, y, z), // Правая точка
		];

		const tickGeometry = new THREE.BufferGeometry().setFromPoints(tickPoints);
		const tick = new THREE.Line(tickGeometry, lineMaterial);

		group.add(tick);

		const label = document.createElement("div");

		label.textContent = String(`${100 * y}`);
		label.style.color = "#858b96";
		label.style.fontSize = "12px";
		label.style.fontFamily = "Inter, sans-serif";
		label.style.whiteSpace = "nowrap";
		label.style.pointerEvents = "none";

		const labelObject = new CSS2DObject(label);

		labelObject.position.set(x - tickWidth / 2 + 0.7, y, z);
		group.add(labelObject);
	}
	console.log(group);
	return group;
}
