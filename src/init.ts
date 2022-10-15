import axios from "./utils/axios";
import * as ElIconModules from "@element-plus/icons-vue";
import codeProcessor from "./utils/codeProcessor";
import elMessage from "./utils/elMessageFactory";
import elLoading from "./utils/elLoadingFactory";
import elNotification from "./utils/elNotificationFactory";

import "animate.css";
import ElementPlus from "element-plus";
import VMdEditor from "@kangc/v-md-editor";
import "@kangc/v-md-editor/lib/style/base-editor.css";
import githubTheme from "@kangc/v-md-editor/lib/theme/github.js";
import "@kangc/v-md-editor/lib/theme/style/github.css";
import VMdPreview from "@kangc/v-md-editor/lib/preview";
import "@kangc/v-md-editor/lib/style/preview.css";

import * as Utils from "./utils/globalFunctions";
import * as Buffer from "./utils/buffer";
import log from "./utils/consoleLog";

import { App, Component } from "vue";

//初始化机
export default function programInitialization(app: App<Element>) {
	console.log("program initialization start...");
	mountUtils(app);
	mountComponents(app);
	mountElFactory(app);
	mountUserComponents(app);
	console.log("program initialization end...");
}

//挂载工具
function mountUtils(app: App<Element>) {
	//挂载封装的axios
	axios.install(app);
	//装载全局工具函数
	app.config.globalProperties.Utils = Utils;
	//装载全局缓存工具
	app.config.globalProperties.Buffer = Buffer;
	//装载封装Log
	app.config.globalProperties.$log = log;
	console.log("Utils mounted");
}

//全局挂载elementUI基础组件
function mountComponents(app: App<Element>) {
	//挂载elementPlus主组件
	app.use(ElementPlus);
	//全局配置element-icon
	for (let iconName in ElIconModules) {
		app.component(iconName, ElIconModules[iconName]);
	}
	VMdEditor.use(githubTheme);
	app.use(VMdEditor);
	VMdPreview.use(githubTheme);
	app.use(VMdPreview);
	console.log("Components mounted");
}

//挂载封装的elementUI
function mountElFactory(app: App<Element>) {
	//装载返回值code处理器
	app.config.globalProperties.codeProcessor = codeProcessor;
	//装载消息提示效果生成工厂
	app.config.globalProperties.elMessage = elMessage;
	//装载加载效果生成工厂
	app.config.globalProperties.elLoading = elLoading;
	//装载Notification生成工厂
	app.config.globalProperties.elNotification = elNotification;
	console.log("ElementUI Factory mounted");
}

//挂载其他组件
function mountUserComponents(app: App<Element>) {
	console.log("User Components mounted");
}
