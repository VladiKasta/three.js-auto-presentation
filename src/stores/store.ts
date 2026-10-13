import { defineStore } from "pinia";
import { ref } from "vue";

export const useStore = defineStore("store", () => {
	const burgerActive = ref(false);
	return {
		burgerActive,
	};
});
