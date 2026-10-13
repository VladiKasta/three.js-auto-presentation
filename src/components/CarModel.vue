<script setup lang="ts">
import type GUI from "lil-gui";
import * as THREE from "three";
import { onBeforeUnmount, onMounted, ref, shallowRef } from "vue";
import initScenes from "../functions/scenes/initScenes";
import CarHint from "./CarHint.vue";

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

const retryLoading = () => window.location.reload();
</script>

<template>
	<div>
		<canvas ref="carCanvas" class="car-model fixed inset-0 h-screen w-full" />

		<!-- 2. Исправлено: передаем модель и переименовали проп под объявление в CarHint -->
		<CarHint
			v-if="!loading && !loadError && modelObject"
			:index="index"
			:hint-visible="hintVisible"
			:ready="modelReady"
			:model="modelObject"
		/>

		<div
			v-if="loading"
			class="absolute inset-0 grid place-items-center bg-black text-white"
			role="status"
			aria-live="polite"
		>
			<div class="text-center">
				<div
					class="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-white/25 border-t-white"
				/>
				<p class="font-semibold">
					Загрузка автомобиля…
					<span v-if="loadProgress !== null"
						>{{ Math.round(loadProgress * 100) }}%</span
					>
				</p>
			</div>
		</div>

		<div
			v-else-if="loadError"
			class="absolute inset-0 grid place-items-center bg-black p-6 text-white"
			role="alert"
		>
			<div class="max-w-md text-center">
				<h2 class="text-2xl font-bold">Модель не загрузилась</h2>
				<p class="mt-3 text-white/70">{{ loadError }}</p>
				<button
					class="mt-6 rounded-lg bg-white px-5 py-3 font-semibold text-black"
					@click="retryLoading"
				>
					Повторить
				</button>
			</div>
		</div>
	</div>
</template>
