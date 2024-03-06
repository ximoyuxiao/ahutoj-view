import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import { visualizer } from "rollup-plugin-visualizer";
import externalGlobals from "rollup-plugin-external-globals"
// import json from '@rollup/plugin-json';;

//CDN 引入
const CDN_Vue = {
	external: ["vue", "vue-router", "vue-demi"],
	externalGlobals: {
		vue: "Vue",
		"vue-router": "VueRouter",
		"vue-demi": "VueDemi",
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

const CDN_MDEditor = {
	external: ["md-editor-v3", "md-editor-v3/lib/style.css"],
	externalGlobals: {
		"md-editor-v3": "MdEditorV3",
		"md-editor-v3/lib/style.css": "md-editor-v3/lib/style.css",
	},
};

const CDN_USE = {
	external: ["axios", "animate.css", "xlsx", "compressorjs"],
	externalGlobals: {
		axios: "axios",
		"animate.css": "animate.css",
		xlsx: "XLSX",
		compressorjs: "Compressor",
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
	// console.log(env);
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
					...CDN_MDEditor.external,
					...CDN_USE.external,
					...CDN_ElementPlus.external,
				],
				plugins: [
					externalGlobals({
						...CDN_Vue.externalGlobals,
						...CDN_AceBuilds.externalGlobals,
						...CDN_MDEditor.externalGlobals,
						...CDN_USE.externalGlobals,
						...CDN_ElementPlus.externalGlobals,
					}),
				],
			},
		},
		plugins: [vue(), visualizer({ open: true })],
	});
};