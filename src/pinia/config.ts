import { defineStore } from "pinia";
import { nextTick } from "vue";
import { PiniaNameSpace } from "./nameSpace";

export const useConfigStore = defineStore(PiniaNameSpace.Config, {
	state: () => {
    return {
      
      
      //监听是否要更新数据
			reload: false,
			shouldPing: false,
		};
	},
	actions: {
		reloadNow() {
			this.reload = true;
			nextTick(() => {
				this.reload = false;
			});
		},

		needPing() {
			this.shouldPing = true;
		},

		hasPing() {
			this.shouldPing = false;
		},
	},
	getters: {},
});









