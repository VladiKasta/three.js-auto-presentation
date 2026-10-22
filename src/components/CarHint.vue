<script setup lang="ts">
import * as THREE from "three";
import { onBeforeUnmount, onMounted, ref } from "vue";
import createScrollTimeline from "../functions/createScrollTimeline";
import Menu from "./Menu.vue";
import MenuBody from "./MenuBody.vue";

type SlidePosition = {
	top?: string;
	left?: string;
	right?: string;
	bottom?: string;
	transform?: string;
};

type Slide = {
	number: string;
	title: string;
	text: string;
	advantages: string[];
	position: SlidePosition;
};

const slides: Slide[] = [
	{
		number: "01",
		title: "Передняя часть",
		text: "Фирменные Matrix LED-фары обеспечивают превосходную видимость и автоматически адаптируются к дорожной обстановке.",
		advantages: [
			"Адаптивное освещение",
			"Matrix LED-оптика",
			"Динамические поворотники",
			"Спортивный дизайн передней части",
		],
		position: {
			top: "50%",
			left: "5%",
			transform: "translateY(-50%)",
		},
	},
	{
		number: "02",
		title: "Задняя часть",
		text: "Спортивная выхлопная система подчеркивает характер автомобиля и обеспечивает насыщенное звучание двигателя.",
		advantages: [
			"Активный выхлоп",
			"Диффузор",
			"Светодиодная полоса фонарей",
			"Улучшенная аэродинамика",
		],
		position: {
			right: "5%",
			bottom: "12%",
		},
	},
	{
		number: "03",
		title: "Производительность",
		text: "Оппозитный двигатель с двойным турбонаддувом обеспечивает мгновенный отклик и впечатляющую динамику.",
		advantages: [
			"Полный привод",
			"Разгон 0–100 км/ч за 3 секунды",
			"7-ступенчатая коробка PDK",
			"Porsche Active Suspension Management",
		],
		position: {
			bottom: "9%",
			left: "5%",
		},
	},
];

const props = defineProps<{
	model: THREE.Object3D;
}>();

const presentation = ref<HTMLElement | null>(null);
let disposeTimeline: (() => void) | null = null;

onMounted(() => {
	if (!presentation.value) return;
	disposeTimeline = createScrollTimeline(props.model, presentation.value);
});

onBeforeUnmount(() => {
	disposeTimeline?.();
	disposeTimeline = null;
});

/* const handleBurgerActive = (e: MouseEvent) => {
	const target = e.target as HTMLElement;
	if (!menuBody.value?.contains(target)) {
		menuActive.value = !menuActive.value;
	}
}; */
</script>

<template>
	<main ref="presentation" class="scroll-presentation">
		<Menu></Menu>

		<MenuBody ref="menuBody"></MenuBody>

		<section v-for="slide in slides" :key="slide.number" class="story-scene">
			<div class="scene-shade" aria-hidden="true" />

			<div class="story-card-positioner" :style="slide.position">
				<article class="story-card scene-content">
					<div class="story-card__header">
						<span class="story-card__number">{{ slide.number }}</span>
						<span class="story-card__line" aria-hidden="true" />
						<span class="story-card__label">Porsche 911 Turbo</span>
					</div>

					<h2>{{ slide.title }}</h2>
					<p class="story-card__description">{{ slide.text }}</p>

					<ul class="story-card__advantages">
						<li v-for="advantage in slide.advantages" :key="advantage">
							{{ advantage }}
						</li>
					</ul>
				</article>
			</div>
		</section>

		<section class="story-scene logo-scene">
			<div class="scene-shade scene-shade--final" aria-hidden="true" />
			<div class="logo-lockup scene-content" aria-label="Porsche 911 Turbo">
				<p class="logo-lockup__eyebrow">There is no substitute</p>
				<p class="logo-lockup__wordmark">PORSCHE</p>
				<div class="logo-lockup__divider" aria-hidden="true" />
				<p class="logo-lockup__model">911 <span>Turbo</span></p>
			</div>
		</section>
	</main>
</template>

<style scoped>

</style>
