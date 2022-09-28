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

				document.body.style.setProperty("--bcg_color1", "#000000");
				document.body.style.setProperty("--bcg_color2", "#212121");
				document.body.style.setProperty("--bcg_color3", "#333333");
				document.body.style.setProperty("--bcg_color4", "#404040");
				document.body.style.setProperty("--bcg_color5", "#636363");
				document.body.style.setProperty("--bcg_color6", "#8c8c8c");
				document.body.style.setProperty("--bcg_color7", "#9e9e9e");

				document.body.style.setProperty("--bcg_color11", "#212121");
				document.body.style.setProperty("--bcg_color21", "#333333");
				document.body.style.setProperty("--bcg_color31", "#2c4d81");
				document.body.style.setProperty("--bcg_color32", "#255198");
				document.body.style.setProperty("--bcg_color33", "#2458ae");
				document.body.style.setProperty("--bcg_color34", "#1e5dc2");
				document.body.style.setProperty("--bcg_color35", "#0a64f5");
				document.body.style.setProperty("--bcg_color41", "#9e9e9e");

				document.body.style.setProperty("--font_color1", "#e6e6e6");
				document.body.style.setProperty("--font_color2", "#d6d6d6");
				document.body.style.setProperty("--font_color3", "#bdbdbd");
				document.body.style.setProperty("--font_color4", "#ababab");
				document.body.style.setProperty("--font_color5", "#969696");

				document.body.style.setProperty("--dec_color1", "#222f3f");
				document.body.style.setProperty("--dec_color31", "#255198");
			} else {
				document.documentElement.setAttribute(
					"data-theme",
					"lightTheme"
				);
				localStorage.setItem("theme", "1");

				document.body.style.setProperty("--bcg_color1", "#ffffff");
				document.body.style.setProperty("--bcg_color2", "#f1f3f5");
				document.body.style.setProperty("--bcg_color3", "#e9ecef");
				document.body.style.setProperty("--bcg_color4", "#dee2e6");
				document.body.style.setProperty("--bcg_color5", "#adb5bd");
				document.body.style.setProperty("--bcg_color6", "#868e96");
				document.body.style.setProperty("--bcg_color7", "#787a7d");

				document.body.style.setProperty("--bcg_color11", "#f03e3e");
				document.body.style.setProperty("--bcg_color21", "#fcc419");
				document.body.style.setProperty("--bcg_color31", "#4dabf7");
				document.body.style.setProperty("--bcg_color32", "#3ecefe");
				document.body.style.setProperty("--bcg_color33", "#86e0fe");
				document.body.style.setProperty("--bcg_color34", "#c7f1ff");
				document.body.style.setProperty("--bcg_color35", "#e5f9ff");
				document.body.style.setProperty("--bcg_color41", "#5ebd00");

				document.body.style.setProperty("--font_color1", "#000000");
				document.body.style.setProperty("--font_color2", "#495057");
				document.body.style.setProperty("--font_color3", "#868e96");
				document.body.style.setProperty("--font_color4", "#a8a8a8");
				document.body.style.setProperty("--font_color5", "#ffffff");

				document.body.style.setProperty("--dec_color1", "#ebfaff");
				document.body.style.setProperty("--dec_color31", "#4dabf7");
			}
		},
	},
};
