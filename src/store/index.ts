import { createStore } from "vuex";
import userData from "./userData";
import themeSwitch from "./themeSwitch";
import config from "./config";
import constVal from "./constVal";

const store = createStore({
	modules: {
		userData,
		themeSwitch,
		config,
		constVal,
	},
});

export default store;
