import { defineStore } from "pinia";
import { nextTick } from "vue";
import { PiniaNameSpace } from "./nameSpace";

export const useConfigStore = defineStore(PiniaNameSpace.Config, {
	state: () => {
		return {
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
