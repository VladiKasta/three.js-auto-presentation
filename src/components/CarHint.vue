<script setup lang="ts">
import * as THREE from "three";
import { onBeforeUnmount, onMounted, ref } from "vue";
import loadSlides from "../functions/api/slidesLoader.ts";
import createScrollTimeline from "../functions/createScrollTimeline";
import type { Slide } from "../types/types.ts";
import getPositionStyles from "../utils/getPositionStyles.ts";
import getSceneMode from "../utils/getSceneMode.ts";
import Menu from "./Menu.vue";
import MenuBody from "./MenuBody.vue";

const slides = ref<Slide[]>([]);

const props = defineProps<{
	model: THREE.Object3D;
}>();

const presentation = ref<HTMLElement>();
let disposeTimeline: (() => void) | null = null;

onMounted(() => {
	if (!presentation.value) return;
	loadSlides(getSceneMode(), slides).then(() => {
		if (!presentation.value) return;
		disposeTimeline = createScrollTimeline(props.model, presentation.value!);
	});
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

			<div
				class="story-card-positioner"
				:style="getPositionStyles(slide.position)"
			>
				<article class="story-card scene-content">
					<div class="story-card__header">
						<span class="story-card__number">{{ slide.number }}</span>
						<span class="story-card__line" aria-hidden="true" />
						<!-- <span class="story-card__label">Porsche 911 Turbo</span> -->
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

<style scoped></style>
