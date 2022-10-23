import { defineStore } from "pinia";
import { Config } from "../utils/buffer";
import { ColorValTools } from "../utils/globalFunctions";
import { PiniaNameSpace } from "./nameSpace";

export const useThemeSwitchStore = defineStore(
	PiniaNameSpace.ThemeSwitchStore,
	{
		state: () => {
			return {
				theme: 1,
			};
		},
		actions: {
			//初始化
			init() {
				//初始化，从缓存中获取当前主题
				if (!localStorage.getItem("theme")) {
					this.theme = 1;
					this.switchTheme(1);
					return;
				}
				let theme: number = Number(localStorage.getItem("theme"));
				this.theme = theme;
				this.switchTheme(theme);
			},

			//切换主题
			switchTheme(theme: number | string | null): void {
				this.theme = theme;
				//大于0说明是亮色 反之是暗色
				switch (Number(theme)) {
					case 8:
						document.documentElement.setAttribute(
							"data-theme",
							"chineseTheme"
						);
						break;
					case 10:
					case -10:
						this.customTheme();
						break;
					case -1:
						document.documentElement.setAttribute(
							"data-theme",
							"darkTheme"
						);
						break;
					case -2:
						document.documentElement.setAttribute(
							"data-theme",
							"cyberpunkTheme"
						);
						break;
					default:
						document.documentElement.setAttribute(
							"data-theme",
							"lightTheme"
						);
						break;
				}
				Config.theme(theme);
			},

			//处理用户自定义主题
			customTheme() {
				let customThemeData = localStorage.getItem(
					"customThemeData"
				) as any;
				customThemeData = JSON.parse(customThemeData) as any;
				if (!customThemeData) {
					this.switchTheme(1);
					return;
				}
				document.documentElement.setAttribute(
					"data-theme",
					"customTheme"
				);
				//字体颜色
				let step = 6;
				let arr = ColorValTools.gradientColor(
					customThemeData.font.first,
					customThemeData.font.last,
					step
				);
				for (let i = 0; i < step; i++) {
					window.document
						.getElementsByTagName("body")[0]
						.style.setProperty("--font" + (i - 1), arr[i]);
				}
				//fill
				step = 7;
				arr = ColorValTools.gradientColor(
					customThemeData.fill.first,
					customThemeData.fill.last,
					step
				);
				for (let i = 0; i < step; i++) {
					window.document
						.getElementsByTagName("body")[0]
						.style.setProperty("--fill" + (i - 1), arr[i]);
				}
				// fill1 - fill5
				for (let j = 1; j <= 5; j++) {
					step = 6;
					arr = ColorValTools.gradientColor(
						customThemeData["fill" + j].first,
						customThemeData["fill" + j].last,
						step
					);
					for (let i = 0; i < step; i++) {
						window.document
							.getElementsByTagName("body")[0]
							.style.setProperty("--fill" + j + (i - 1), arr[i]);
					}
				}
				//border
				step = 6;
				arr = ColorValTools.gradientColor(
					customThemeData.border.first,
					customThemeData.border.last,
					step
				);
				for (let i = 0; i < step; i++) {
					window.document
						.getElementsByTagName("body")[0]
						.style.setProperty("--border" + (i - 1), arr[i]);
				}

				window.document
					.getElementsByTagName("body")[0]
					.style.setProperty(
						"--base_page",
						customThemeData.base_page
					);
			},

			//新增自定义主题
			newCustomTheme(colors: any) {
				Config.customeTheme(colors);
				this.switchTheme(colors.type);
			},
		},
		getters: {},
	}
);
