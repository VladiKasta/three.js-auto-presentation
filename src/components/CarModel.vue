<script setup lang="ts">
import type GUI from "lil-gui";
import * as THREE from "three";
import { onBeforeUnmount, onMounted, ref, shallowRef } from "vue";
import initScenes from "../functions/scenes/initScenes";
import CarHint from "./CarHint.vue";
import LoaderView from "./LoaderView.vue";

const carCanvas = ref<HTMLCanvasElement | null>(null);
let camera: THREE.PerspectiveCamera;
let disposeScene: (() => void) | undefined;

let gui: GUI | null = null;
let active = true;

const index = ref(0);
const hintVisible = ref(false);
const loading = ref(true);
const loadProgress = ref<number | null>(null);
const loadError = ref("");
const modelReady = ref(false);

// Эта переменная доступна в <template>
const modelObject = shallowRef<THREE.Object3D | null>(null);

onMounted(() => {
	if (!carCanvas.value) return;

	const result = initScenes("/", carCanvas.value, {
		onProgress: (progress) => {
			loadProgress.value = progress;
		},
	});

	result.modelReady
		.then(() => {
			if (!active) return;
			loading.value = false;
			hintVisible.value = true;
			modelReady.value = true;

			// 1. Извлекаем модель из результата и сохраняем в нашу внешнюю переменную
			modelObject.value = result.modelObject.value;
			console.log(result.renderer.info);
		})
		.catch((error) => {
			if (!active) return;
			loading.value = false;
			loadError.value =
				error instanceof Error
					? error.message
					: "Не удалось загрузить 3D-модель";
		});

	camera = result.camera;
	disposeScene = result.dispose;

	if (import.meta.env.DEV) {
		void import("lil-gui").then(({ default: DevGUI }) => {
			if (!active) return;
			gui = new DevGUI();
			gui.add(camera.position, "x", -10, 10);
			gui.add(camera.position, "y", -10, 10);
			gui.add(camera.position, "z", -10, 10);
		});
	}
});

onBeforeUnmount(() => {
	active = false;

	gui?.destroy();
	disposeScene?.();
});
</script>

<template>
	<div>
		<canvas ref="carCanvas" class="car-model fixed inset-0 h-screen w-full" />

		<!-- 2. Исправлено: передаем модель и переименовали проп под объявление в CarHint -->
		<CarHint
			v-if="modelObject"
			:index="index"
			:hint-visible="hintVisible"
			:ready="modelReady"
			:model="modelObject"
		/>

		<LoaderView
			:loading="loading"
			:error="loadError"
			:progress="loadProgress"
		></LoaderView>
	</div>
</template>
