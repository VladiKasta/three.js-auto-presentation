<script setup lang="ts">
//const active = ref(false);
import { storeToRefs } from "pinia";
import { useStore } from "../stores/store";

const store = useStore();
const { burgerActive } = storeToRefs(store);

/* const handleActive = () => {
	//active.value = !active.value;
	emit("activeChange");
} */
</script>

<template>
	<button
		class="burger"
		type="button"
		aria-label="Открыть меню"
		@click="burgerActive = true"
	>
		<span></span>
		<span></span>
		<span></span>
	</button>
</template>

<style scoped>
.burger {
	display: flex;
	flex-direction: column;
	align-items: flex-end;
	justify-content: center;
	gap: 5px;
	position: relative;
	z-index: 100;
	width: 44px;
	height: 44px;
	padding: 0;

	border: 0;
	background: transparent;

	cursor: pointer;
}

.burger span {
	display: block;
	height: 1px;

	background: #fff;
	border-radius: 999px;

	transition:
		width 0.25s ease,
		transform 0.25s ease,
		opacity 0.25s ease;
}

.burger span:nth-child(1) {
	width: 28px;
}

.burger span:nth-child(2) {
	width: 20px;
}

.burger span:nth-child(3) {
	width: 24px;
}

.burger:hover span:nth-child(1) {
	width: 22px;
}

.burger:hover span:nth-child(2) {
	width: 28px;
}

.burger:hover span:nth-child(3) {
	width: 18px;
}
</style>
