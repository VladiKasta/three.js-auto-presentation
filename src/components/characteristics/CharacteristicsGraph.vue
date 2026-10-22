<script setup lang="ts">
import * as THREE from "three";
import { onBeforeUnmount, onMounted, ref } from "vue";
import initScenes from "../../functions/scenes/initScenes";
import LoaderView from "../LoaderView.vue";
import Menu from "../Menu.vue";
import MenuBody from "../MenuBody.vue";
import CharacteristicsText from "./CharacteristicsText.vue";
import { competitors } from "./competitors.ts";
import createCharacteristicsRuntime from "./createCharactiristicsRuntime.ts";
import initRaycaster from "./initRaycaster.ts";
import interractOnClick from "./interractOnClick.ts";

//import createRoom from "./createRoom.ts";

const finished = ref(false);
const loadingError = ref<string>("");
let result: ReturnType<typeof initScenes> = {} as ReturnType<typeof initScenes>;
const characteristicsCanvas = ref<HTMLCanvasElement | null>(null);
const activeCarId = ref(competitors[0].id);

//const choosenObject = ref<Object3D | null>(null);
let raycasterCanvasClick:
	((event: MouseEvent) => THREE.Mesh | undefined) | null = null;

function canvasClick(event: MouseEvent) {
	const object = raycasterCanvasClick?.(event);
	if (!object) return;

	interractOnClick(result.scene, object);
	activeCarId.value = object.userData.competitorId as string;
}

onMounted(() => {
	result = initScenes("/characteristics", characteristicsCanvas.value!);
	createCharacteristicsRuntime({ result, finished, loadingError });
	const raycaster = initRaycaster({
		characteristicsCanvas,
		result,
	});

	raycasterCanvasClick = raycaster.canvasClick;
});

onBeforeUnmount(() => {
	raycasterCanvasClick = null;
	result.dispose();
});
</script>

<template>
	<Menu></Menu>
	<MenuBody ref="menuBody"></MenuBody>

	<CharacteristicsText :active-car-id="activeCarId"></CharacteristicsText>

	<canvas
		ref="characteristicsCanvas"
		class="characteristics-model fixed inset-0 h-screen w-full"
		@click="canvasClick($event)"
	/>

	<LoaderView :loading="!finished" :load-error="loadingError" />
</template>
