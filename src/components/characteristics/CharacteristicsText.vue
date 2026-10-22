<script setup lang="ts">
import { computed } from "vue";
import { competitors } from "./competitors";

type Slide = {
	id: string;
	title: string;

	text?: string;
	advantages: string[];

	position: SlidePosition;
};
type SlidePosition = {
	top?: string;
	left?: string;
	right?: string;
	bottom?: string;
	transform?: string;
};
const slides: Slide[] = [
	{
		id: "porsche",
		title: "Porsche 911 Turbo",
		text: "Оппозитный шестицилиндровый двигатель с двойным турбонаддувом обеспечивает невероятную динамику, мгновенный отклик на педаль газа и непревзойдённое удовольствие от вождения.",
		advantages: [
			"Мощность двигателя — 750 л.с.",
			"Разгон 0–100 км/ч за 2,1 секунды",
			"Максимальная скорость — 350 км/ч",
			"Двигатель 3,8 л с двойным турбонаддувом",
		],
		position: {
			top: "30%",
			left: "5%",
			transform: "translateY(-50%)",
		},
	},
	{
		id: "audi",
		title: "Audi R8 Performance",
		text: "Атмосферный двигатель V10 в сочетании с фирменной системой полного привода quattro обеспечивает впечатляющую динамику, уверенное сцепление с дорогой и исключительную управляемость.",
		advantages: [
			"Мощность двигателя — 670 л.с.",
			"Разгон 0–100 км/ч за 2,9 секунды",
			"Максимальная скорость — 330 км/ч",
			"Двигатель 5,2 л V10",
		],
		position: {
			top: "30%",
			left: "5%",
			transform: "translateY(-50%)",
		},
	},
	{
		id: "bmw",
		title: "BMW M8 Competition",
		text: "Мощный двигатель V8 M TwinPower Turbo объединяет спортивный характер с премиальным комфортом. Интеллектуальный полный привод M xDrive гарантирует уверенное ускорение в любых условиях.",
		advantages: [
			"Мощность двигателя — 650 л.с.",
			"Разгон 0–100 км/ч за 3,0 секунды",
			"Максимальная скорость — 305 км/ч",
			"Двигатель 4,4 л V8 TwinPower Turbo",
		],
		position: {
			top: "30%",
			left: "5%",
			transform: "translateY(-50%)",
		},
	},
	{
		id: "mercedes",
		title: "Mercedes-AMG GT 63",
		text: "Высокопроизводительный двигатель AMG V8 Biturbo сочетает внушительную мощность с безупречной плавностью хода. Передовые технологии AMG превращают каждое ускорение в яркое впечатление.",
		advantages: [
			"Мощность двигателя — 680 л.с.",
			"Разгон 0–100 км/ч за 2,8 секунды",
			"Максимальная скорость — 315 км/ч",
			"Двигатель 4,0 л V8 Biturbo",
		],
		position: {
			top: "30%",
			left: "5%",
			transform: "translateY(-50%)",
		},
	},
	{
		id: "tesla",
		title: "Tesla Model S Plaid",
		text: "Инновационная электрическая силовая установка с тремя электродвигателями обеспечивает мгновенную передачу крутящего момента, стремительное ускорение и практически бесшумное движение.",
		advantages: [
			"Мощность силовой установки — 720 л.с.",
			"Разгон 0–100 км/ч за 2,5 секунды",
			"Максимальная скорость — 300 км/ч",
			"Три электродвигателя с полным приводом",
		],
		position: {
			top: "30%",
			left: "5%",
			transform: "translateY(-50%)",
		},
	},
];

const props = defineProps<{
	activeCarId: string;
}>();

const activeSlide = computed(
	() => slides.find((slide) => slide.id === props.activeCarId) ?? slides[0],
);

const activeNumber = computed(() => {
	const index = competitors.findIndex(
		(competitor) => competitor.id === props.activeCarId,
	);

	return String(index >= 0 ? index + 1 : 1).padStart(2, "0");
});
</script>

<template>
	<section class="story-scene">
		<Transition name="car-card" mode="out-in">
			<div
				:key="activeSlide.id"
				class="story-card-positioner"
				:style="activeSlide.position"
			>
				<article class="story-card scene-content">
					<div class="story-card__header">
						<span class="story-card__number">{{ activeNumber }}</span>
						<span class="story-card__line" aria-hidden="true" />
					</div>

					<h2 class="story-card__title">{{ activeSlide.title }}</h2>
					<p class="story-card__description">{{ activeSlide.text }}</p>

					<ul class="story-card__advantages">
						<li v-for="advantage in activeSlide.advantages" :key="advantage">
							{{ advantage }}
						</li>
					</ul>
				</article>
			</div>
		</Transition>
	</section>
</template>

<style scoped>
.car-card-enter-active,
.car-card-leave-active {
	transition:
		opacity 0.35s ease,
		transform 0.35s ease,
		filter 0.35s ease;
}

.car-card-enter-from {
	opacity: 0;
	transform: translateY(18px) scale(0.98);
	filter: blur(6px);
}

.car-card-leave-to {
	opacity: 0;
	transform: translateY(-12px) scale(0.98);
	filter: blur(6px);
}
</style>
