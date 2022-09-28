import { nextTick } from "vue";

export default {
	namespaced: true,
	state: {
		reload: false,
	},
	mutations: {
		reload(state: any) {
			state.reload = true;
			nextTick(() => {
				state.reload = false;
			});
		},
	},
};
