<script setup lang="ts">
const props = defineProps({
	modelReady: { type: Boolean, default: false },
	loading: { type: Boolean, default: false },
	loadError: { type: String, default: "" },
	loadProgress: { type: Number, default: null },
});

const retryLoading = () => window.location.reload();
</script>

<template>
	<div>
		<Transition name="loader-fade">
			<div
				v-if="props.loading"
				class="absolute inset-0 grid place-items-center bg-black text-white opacity-100 transition-opacity duration-300 ease-in-out"
				role="status"
				aria-live="polite"
			>
				<div class="text-center">
					<div
						class="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-white/25 border-t-white"
					/>
					<p class="font-semibold">
						Загрузка моделей…
						<span v-if="props.loadProgress !== null"
							>{{ Math.round(loadProgress * 100) }}%</span
						>
					</p>
				</div>
			</div>

			<div
				v-else-if="props.loadError"
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
		</Transition>
	</div>
</template>

<style scoped>
.loader-fade-leave-active {
	transition: opacity 1s ease-in-out;
}

.loader-fade-leave-active {
	transition: opacity 0.5s ease;
}

.loader-fade-leave-to {
	opacity: 0;
}
</style>
