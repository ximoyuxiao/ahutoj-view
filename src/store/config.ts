import { nextTick } from "vue";

export default {
	namespaced: true,
	state: {
		reload: false,
		shouldPing: false,
	},
	mutations: {
		reload(state: any) {
			state.reload = true;
			nextTick(() => {
				state.reload = false;
			});
		},

		needPing(state: any) {
			state.shouldPing = true;
		},

		hasPing(state: any) {
			state.shouldPing = false;
		},
	},
};
