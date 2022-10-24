import { defineStore } from "pinia"; 
import { nextTick } from "vue";
import { Config, configDataType, UserData } from "../utils/buffer";
import { PiniaNameSpace } from "./nameSpace";
import { useUserDataStore } from "./userData";

export const useConfigStore = defineStore(PiniaNameSpace.Config, {
	state: () => {
		return {
			//提交后跳转到提交状态页
			submitThenRedirectToCode: true,

			//监听是否要更新数据
			reload: false,
			shouldPing: false,
		};
	},
	actions: {
		//初始化
		init() {
			let configData = localStorage.getItem("configData") as any;
			let userDataStore = useUserDataStore();
			if (!configData || !userDataStore.isLogin) {
				return;
			}
			configData = JSON.parse(configData) as configDataType;
			if (configData.UID != userDataStore.UID) {
				localStorage.removeItem("configData");
				return;
			}
			this.submitThenRedirectToCode =
				configData.submitThenRedirectToCode;
		},

		//保存状态
		save() {
			let userDataStore = useUserDataStore();
			if (userDataStore.isLogin && userDataStore.UID != "") {
				let configData = {
					UID: userDataStore.UID,
					submitThenRedirectToCode: true,
				};
				configData.submitThenRedirectToCode =
					this.submitThenRedirectToCode;
				Config.saveConfig(configData);
			}
		},

		//重新加载页面
		reloadNow() {
			this.reload = true;
			nextTick(() => {
				this.reload = false;
			});
		},

		//需要ping
		needPing() {
			this.shouldPing = true;
		},

		//已经ping
		hasPing() {
			this.shouldPing = false;
		},
	},
	getters: {},
});
