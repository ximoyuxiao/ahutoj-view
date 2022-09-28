import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
	server: {
		hmr: true,
		port: 2002,
	},
	plugins: [vue()],
	css: {
		preprocessorOptions: {
			scss: {
				additionalData: '@import "./src/assets/scss/all.scss";',
			},
		},
	},
});
