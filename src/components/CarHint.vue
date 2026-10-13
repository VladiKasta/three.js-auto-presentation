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
.scroll-presentation {
	position: relative;
	width: 100%;

	color: #f4f4f2;
}

.story-scene {
	position: relative;
	min-height: 120vh;
	pointer-events: none;
}

.scene-shade {
	position: absolute;
	inset: 0;
	opacity: 0;
	background: linear-gradient(
		180deg,
		rgba(7, 7, 9, 0.15) 0%,
		rgba(7, 7, 9, 0.4) 60%,
		rgba(7, 7, 9, 0.9) 100%
	);
}

/* =========================
   CARD POSITION
========================= */

.story-card-positioner {
	position: absolute;
	width: min(42rem, 46vw);
}

/* =========================
   CARD
========================= */

.story-card {
	position: relative;

	padding: clamp(1.4rem, 2vw, 2rem);

	border: 1px solid rgba(255, 255, 255, 0.1);
	border-radius: 1.4rem;

	background: linear-gradient(
		135deg,
		rgba(255, 255, 255, 0.08),
		rgba(255, 255, 255, 0.025)
	);

	box-shadow:
		0 24px 80px rgba(0, 0, 0, 0.25),
		inset 0 1px 0 rgba(255, 255, 255, 0.06);

	backdrop-filter: blur(18px);
	-webkit-backdrop-filter: blur(18px);

	will-change: transform, opacity, filter;
}

/* =========================
   HEADER
========================= */

.story-card__header {
	display: flex;
	align-items: center;
	justify-content: space-between;

	margin-bottom: clamp(2rem, 4vw, 4rem);

	font-size: 0.68rem;
	font-weight: 500;
	letter-spacing: 0.14em;
	text-transform: uppercase;
}

.story-card__number {
	display: grid;
	width: 2.2rem;
	height: 2.2rem;

	place-items: center;

	border: 1px solid rgba(255, 255, 255, 0.14);
	border-radius: 50%;

	color: rgba(255, 255, 255, 0.72);
}

.story-card__line {
	display: none;
}

.story-card__label {
	color: rgba(255, 255, 255, 0.38);
}

/* =========================
   TITLE
========================= */

.story-card h2 {
	/* max-width: 9ch; */
	margin: 0;

	font-size: clamp(2rem, 5vw, 6rem);
	font-weight: 400;
	line-height: 0.88;
	letter-spacing: -0.065em;

	text-wrap: balance;
}

/* =========================
   DESCRIPTION
========================= */

.story-card__description {
	max-width: 30rem;

	margin: clamp(2rem, 3vw, 3rem) 0 0;

	color: rgba(255, 255, 255, 0.58);

	font-size: clamp(0.95rem, 1vw, 1.05rem);
	line-height: 1.65;

	text-align: left;
}

/* =========================
   ADVANTAGES
========================= */

.story-card__advantages {
	display: flex;
	flex-wrap: wrap;
	gap: 0.6rem;

	margin: 2rem 0 0;
	padding: 0;

	list-style: none;
}

.story-card__advantages li {
	padding: 0.6rem 0.9rem;

	border: 1px solid rgba(255, 255, 255, 0.1);
	border-radius: 999px;

	background: rgba(255, 255, 255, 0.04);

	color: rgba(255, 255, 255, 0.62);

	font-size: 0.68rem;
	letter-spacing: 0.04em;
	text-transform: uppercase;
}

.story-card__advantages li::before {
	display: none;
}

/* =========================
   ALTERNATE SCENE STYLE
========================= */

.story-scene:nth-child(2) .story-card {
	background: linear-gradient(
		135deg,
		rgba(255, 255, 255, 0.04),
		rgba(255, 255, 255, 0.015)
	);
}

.story-scene:nth-child(3) .story-card {
	border-color: rgba(255, 255, 255, 0.06);

	background: rgba(8, 8, 10, 0.42);

	backdrop-filter: blur(28px);
}

/* =========================
   FINAL
========================= */

.logo-scene {
	display: grid;
	min-height: 120vh;
	place-items: center;
}

.scene-shade--final {
	background: radial-gradient(
		circle at center,
		rgba(255, 255, 255, 0.04),
		rgba(0, 0, 0, 0.92) 70%
	);
}

.logo-lockup {
	position: relative;
	z-index: 1;

	width: min(92vw, 95rem);

	text-align: center;

	will-change: transform, opacity, filter;
}

.logo-lockup__eyebrow {
	margin: 0 0 2rem;

	color: rgba(255, 255, 255, 0.35);

	font-size: 0.65rem;
	font-weight: 500;
	letter-spacing: 0.5em;
	text-transform: uppercase;
}

.logo-lockup__wordmark {
	margin: 0;

	font-family: Arial, Helvetica, sans-serif;

	font-size: clamp(4rem, 14vw, 13rem);
	font-weight: 400;
	line-height: 0.75;

	letter-spacing: -0.075em;
}

.logo-lockup__divider {
	width: 1px;
	height: clamp(4rem, 8vw, 7rem);

	margin: 2.5rem auto;

	background: linear-gradient(
		transparent,
		rgba(255, 255, 255, 0.35),
		transparent
	);
}

.logo-lockup__model {
	margin: 0;

	font-size: clamp(1rem, 2vw, 1.5rem);
	font-weight: 400;

	letter-spacing: 0.35em;
	text-transform: uppercase;
}

.logo-lockup__model span {
	font-style: normal;
	font-weight: 400;
}

/* =========================
   MOBILE
========================= */

@media (max-width: 768px) {
	.story-scene {
		min-height: 125vh;
	}

	.story-scene::before {
		background-size: 36px 36px;
	}

	.story-card-positioner {
		top: auto !important;
		right: 1rem !important;
		bottom: 1rem !important;
		left: 1rem !important;

		width: auto;

		transform: none !important;
	}

	.story-card {
		padding: 1.25rem;

		border-radius: 1.1rem;

		background: rgba(12, 12, 14, 0.68);

		backdrop-filter: blur(20px);
	}

	.story-card__header {
		margin-bottom: 2rem;
	}

	.story-card h2 {
		max-width: 10ch;

		font-size: clamp(2.8rem, 13vw, 4.8rem);
	}

	.story-card__description {
		max-width: 100%;

		margin-top: 1.5rem;

		font-size: 0.9rem;
	}

	.story-card__advantages {
		margin-top: 1.4rem;
	}

	.story-card__advantages li {
		padding: 0.5rem 0.7rem;

		font-size: 0.6rem;
	}

	.logo-lockup__wordmark {
		font-size: clamp(3.8rem, 18vw, 7rem);
	}

	.logo-lockup__divider {
		height: 4rem;
		margin: 2rem auto;
	}
}

/* =========================
   ACCESSIBILITY
========================= */

@media (prefers-reduced-motion: reduce) {
	.scene-content {
		opacity: 1;
		visibility: visible;
	}

	.story-card,
	.logo-lockup {
		filter: none !important;
	}
}
</style>
