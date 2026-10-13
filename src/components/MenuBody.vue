<script setup lang="ts">
import { storeToRefs } from "pinia";

import { RouterLink } from "vue-router";
import { useStore } from "../stores/store";

/* const props = defineProps<{ active: boolean }>();

const emit = defineEmits(["changeActive"]); */

const store = useStore();
const { burgerActive } = storeToRefs(store);
</script>

<template>
	<nav class="menu" :class="burgerActive ? 'active' : ''">
		<button
			class="menu__back"
			type="button"
			aria-label="Назад"
			@click="burgerActive = false"
		>
			<svg viewBox="0 0 24 24" aria-hidden="true">
				<path d="M15 6l-6 6 6 6" />
			</svg>

			<span>Назад</span>
		</button>

		<div class="menu__divider"></div>
		<RouterLink to="/" class="menu__item">Главная</RouterLink>
		<RouterLink to="/characteristics" class="menu__item"
			>Характеристики</RouterLink
		>
		<a href="/design" class="menu__item">Дизайн</a>
		<a href="/gallery" class="menu__item">Галерея</a>
	</nav>
</template>

<style scoped>
.menu {
	position: absolute;

	z-index: 200;
	inset: 0 auto 0 0;
	max-width: 200px;
	width: 200px;
	padding: 10px;

	transform: translateX(-100%);
	min-height: 100vh;

	border: 1px solid rgba(255, 255, 255, 0.1);

	background: rgba(18, 18, 20, 0.55);

	backdrop-filter: blur(18px);
	-webkit-backdrop-filter: blur(18px);

	box-shadow:
		0 20px 50px rgba(0, 0, 0, 0.35),
		inset 0 1px 0 rgba(255, 255, 255, 0.04);
	will-change: transform;
	transition: transform 0.25s ease;
}

.menu.active {
	transition: transform 0.25s ease;
	transform: translateX(0);
}

/* .menu.active {
	overflow: hidden;
} */

.menu__back {
	display: flex;
	align-items: center;
	gap: 8px;

	width: 100%;
	min-height: 40px;
	padding: 0 12px;

	border: 0;

	background: transparent;

	color: rgba(255, 255, 255, 0.45);

	font-size: 0.7rem;
	font-weight: 500;
	letter-spacing: 0.08em;
	text-transform: uppercase;

	cursor: pointer;

	transition:
		color 0.25s ease,
		background 0.25s ease;
}

.menu__back svg {
	width: 15px;
	height: 15px;

	fill: none;
	stroke: currentColor;
	stroke-width: 1.5;
	stroke-linecap: round;
	stroke-linejoin: round;

	transition: transform 0.25s ease;
}

.menu__back:hover {
	color: #fff;
	background: rgba(255, 255, 255, 0.05);
}

.menu__back:hover svg {
	transform: translateX(-3px);
}

.menu__divider {
	height: 1px;
	margin: 8px 6px;

	background: rgba(255, 255, 255, 0.08);
}

.menu__item {
	display: flex;
	align-items: center;

	min-height: 44px;
	padding: 0 14px;

	border-radius: 12px;

	color: rgba(255, 255, 255, 0.62);

	font-size: 0.76rem;
	font-weight: 500;
	letter-spacing: 0.08em;

	text-decoration: none;
	text-transform: uppercase;

	transition:
		background 0.25s ease,
		color 0.25s ease,
		transform 0.25s ease;
}

.menu__item:hover {
	background: rgba(255, 255, 255, 0.07);
	color: #fff;
	transform: translateX(3px);
}
</style>
