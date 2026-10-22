import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
	history: createWebHistory(),

	routes: [
		{
			path: "/",
			name: "home",
			component: () => import("../view/Main.vue"),
		},
		{
			path: "/characteristics",
			name: "characteristics",
			component: () => import("../view/CharacteristicsView.vue"),
		},
	],
});

export default router;
