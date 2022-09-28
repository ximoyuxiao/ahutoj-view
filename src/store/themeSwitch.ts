export default {
	namespaced: true,
	state: {
		theme: 1,
	},
	mutations: {
		//主体切换
		switch(state: any, theme: number) {
			state.theme = theme;
			if (theme == 2) {
				document.documentElement.setAttribute(
					"data-theme",
					"darkTheme"
				);
				localStorage.setItem("theme", "2");
			} else {
				document.documentElement.setAttribute(
					"data-theme",
					"lightTheme"
				);
				localStorage.setItem("theme", "1");
			}
		},

		switchCyberpunkTheme(state: any) {
			state.theme = 2;
			document.documentElement.setAttribute(
				"data-theme",
				"cyberpunkTheme"
			);
			localStorage.setItem("theme", "2");
		},
	},
};
