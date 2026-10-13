import { createRouter, createWebHistory } from "vue-router";

import CharacteristicsView from "../view/CharacteristicsView.vue";
import Main from "../view/Main.vue";

const router = createRouter({
	history: createWebHistory(),

	routes: [
		{
			path: "/",
			name: "home",
			component: Main,
		},
		{
			path: "/characteristics",
			name: "characteristics",
			component: CharacteristicsView,
		},
	],
});

export default router;
