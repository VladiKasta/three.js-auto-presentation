import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
	plugins: [vue(), tailwindcss()],
	build: {
		rolldownOptions: {
			output: {
				codeSplitting: {
					minSize: 20_000,
					maxSize: 450_000,
					groups: [
						{ name: 'three', test: /node_modules[\\/]three/ },
						{ name: 'vue', test: /node_modules[\\/](@vue|vue)[\\/]/ },
						{ name: 'motion', test: /node_modules[\\/](gsap|lil-gui)[\\/]/ },
					],
				},
			},
		},
	},
})
