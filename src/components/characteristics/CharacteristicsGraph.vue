<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import createVerticalLine from "../../functions/scenes/createVerticalLine.ts";
import initScenes from "../../functions/scenes/initScenes";
import Menu from "../Menu.vue";
import MenuBody from "../MenuBody.vue";
import { competitors } from "./competitors.ts";
import createFloor from "./createFloor.ts";
import createGeometries from "./createGeometries.ts";
//import createRoom from "./createRoom.ts";

const characteristicsCanvas = ref<HTMLCanvasElement | null>(null);
const myltiply = ref(0);
const maxCharacteristic = Math.max(...competitors.map((c) => c.power));

let result: ReturnType<typeof initScenes>;
const step = 2;

onMounted(() => {
	result = initScenes("/characteristics", characteristicsCanvas.value!);

	createGeometries(maxCharacteristic, step, result.scene);
	//createRoom(result.scene);
	const floor = createFloor(step);
	const verticalLine = createVerticalLine({
		height: 7,
		floor,
	});

	result.scene.add(floor);
	result.scene.add(verticalLine);
});

onBeforeUnmount(() => {
	console.log("first");
	result.dispose();
});
</script>

<template>
	<button class="muly relative text-amber-400" @click="myltiply++">
		прибавить {{ myltiply }}
	</button>
	<Menu></Menu>
	<MenuBody ref="menuBody"></MenuBody>

	<canvas
		ref="characteristicsCanvas"
		class="characteristics-model fixed inset-0 h-screen w-full"
	/>
</template>

<style scoped>
.muly {
	z-index: 100;
}
</style>
