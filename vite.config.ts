import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import { visualizer } from "rollup-plugin-visualizer";
import externalGlobals from "rollup-plugin-external-globals";
//CDN 引入
const CDN_Vue = {
	external: ["vue-router", "vue", "vuex"],
	externalGlobals: {
		vue: "Vue",
		"vue-router": "VueRouter",
		vuex: "Vuex",
	},
};

const CDN_AceBuilds = {
	external: [
		"ace-builds",
		"ace-builds/src-noconflict/mode-c_cpp.js",
		"ace-builds/src-noconflict/mode-csharp.js",
		"ace-builds/src-noconflict/mode-golang.js",
		"ace-builds/src-noconflict/mode-java.js",
		"ace-builds/src-noconflict/mode-javascript.js",
		"ace-builds/src-noconflict/mode-php.js",
		"ace-builds/src-noconflict/mode-python.js",
		"ace-builds/src-noconflict/mode-ruby.js",
		"ace-builds/src-noconflict/mode-rust.js",
		"ace-builds/src-noconflict/theme-eclipse.js",
		"ace-builds/src-noconflict/theme-one_dark.js",
	],
	externalGlobals: {
		"ace-builds": "ace",
		"ace-builds/src-noconflict/mode-c_cpp.js":
			"ace-builds/src-noconflict/mode-c_cpp.js",
		"ace-builds/src-noconflict/mode-csharp.js":
			"ace-builds/src-noconflict/mode-csharp.js",
		"ace-builds/src-noconflict/mode-golang.js":
			"ace-builds/src-noconflict/mode-golang.js",
		"ace-builds/src-noconflict/mode-java.js":
			"ace-builds/src-noconflict/mode-java.js",
		"ace-builds/src-noconflict/mode-javascript.js":
			"ace-builds/src-noconflict/mode-javascript.js",
		"ace-builds/src-noconflict/mode-php.js":
			"ace-builds/src-noconflict/mode-php.js",
		"ace-builds/src-noconflict/mode-python.js":
			"ace-builds/src-noconflict/mode-python.js",
		"ace-builds/src-noconflict/mode-ruby.js":
			"ace-builds/src-noconflict/mode-ruby.js",
		"ace-builds/src-noconflict/mode-rust.js":
			"ace-builds/src-noconflict/mode-rust.js",
		"ace-builds/src-noconflict/theme-eclipse.js":
			"ace-builds/src-noconflict/theme-eclipse.js",
		"ace-builds/src-noconflict/theme-one_dark.js":
			"ace-builds/src-noconflict/theme-one_dark.js",
	},
};

const CDN_VMDEditor = {
	external: [
		"@kangc/v-md-editor",
		"@kangc/v-md-editor/lib/preview",
		"@kangc/v-md-editor/lib/theme/github.js",
		"@kangc/v-md-editor/lib/style/base-editor.css",
		"@kangc/v-md-editor/lib/theme/style/github.css",
		"@kangc/v-md-editor/lib/style/preview.css",
	],
	externalGlobals: {
		"@kangc/v-md-editor": "VMdEditor",
		"@kangc/v-md-editor/lib/preview": "VMdEditor",
		"@kangc/v-md-editor/lib/theme/github.js": "VMdTheme",
		"@kangc/v-md-editor/lib/style/base-editor.css":
			"@kangc/v-md-editor/lib/style/base-editor.css",
		"@kangc/v-md-editor/lib/theme/style/github.css":
			"@kangc/v-md-editor/lib/theme/style/github.css",
		"@kangc/v-md-editor/lib/style/preview.css":
			"@kangc/v-md-editor/lib/style/preview.css",
	},
};

const CDN_USE = {
	external: ["axios", "animate.css"],
	externalGlobals: {
		axios: "axios",
		"animate.css": "animate.css",
	},
};

const CDN_ElementPlus = {
	external: ["element-plus", "@element-plus/icons-vue"],
	externalGlobals: {
		"element-plus": "ElementPlus",
		"@element-plus/icons-vue": "ElementPlusIconsVue",
	},
};

export default ({ mode }) => {
	const env = loadEnv(mode, process.cwd(), "ENV");
	console.log(env);
	return defineConfig({
		server: {
			hmr: true,
			port: 2002,
		},
		base: "./",
		css: {
			preprocessorOptions: {
				scss: {
					additionalData: '@import "./src/assets/scss/all.scss";',
				},
			},
		},
		build: {
			rollupOptions: {
				external: [
					...CDN_Vue.external,
					...CDN_AceBuilds.external,
					...CDN_VMDEditor.external,
					...CDN_USE.external,
					...CDN_ElementPlus.external,
				],
				plugins: [
					externalGlobals({
						...CDN_Vue.externalGlobals,
						...CDN_AceBuilds.externalGlobals,
						...CDN_VMDEditor.externalGlobals,
						...CDN_USE.externalGlobals,
						...CDN_ElementPlus.externalGlobals,
					}),
				],
			},
		},
		plugins: [vue(), visualizer({ open: true })],
	});
};
