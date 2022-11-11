import {
	configDataType,
	customThemeType,
	rankDataType,
	submitDataType,
	userInfoType,
} from "./bufferTypes";

export * from "./bufferTypes";

export class Config {
	public static theme(theme: number | string) {
		localStorage.setItem("theme", String(theme));
	}

	public static customeTheme(colors: customThemeType) {
		localStorage.setItem("customThemeData", JSON.stringify(colors));
	}

	public static submitLang(lang: number | string) {
		localStorage.setItem("submitLang", String(lang));
	}

	public static saveConfig(config: configDataType) {
		localStorage.setItem("configData", JSON.stringify(config));
	}

	public static clearStore() {
		sessionStorage.clear();
		localStorage.clear();
	}
}

export class UserData {
	public static userInfo(data: userInfoType) {
		let jsonString = JSON.stringify(data);
		sessionStorage.setItem("ahutOjUserInfo", jsonString);
	}

	//清空用户登录相关凭证
	public static clearUserLoginCertificate() {
		localStorage.removeItem("ahutOjToken");
		localStorage.removeItem("ahutOjSaveLoginStatus");
		localStorage.removeItem("ahutOjUserUid");
		localStorage.removeItem("pageRouterData_contest");
		sessionStorage.removeItem("userSubmitData");
		sessionStorage.removeItem("ahutOjUserInfo");
	}
}

export class Problem {
	public static problemCode(PID: string, content: string) {
		sessionStorage.setItem("pid" + PID, content);
	}
	public static contestProblemCode(PID: string, content: string) {
		sessionStorage.setItem("cpid" + PID, content);
	}
}

export class ContestRank {
	//保存竞赛排名数据
	public static rankData(
		data: rankDataType,
		CID: number | string
	): void {
		if (CID) {
			sessionStorage.setItem(
				"contestRankData" + CID,
				JSON.stringify({
					data,
					CID,
					saveTime: Date.now(),
				})
			);
		}
	}
}

export class UserCenter {
	//用户提交记录数据缓存
	public static submitData(data: submitDataType, UID: string): void {
		// console.log(data);
		if (!UID) {
			console.log("bufferUserCenterSubmitData 失败：登录状态异常");
			return;
		}
		sessionStorage.setItem(
			"userSubmitData",
			JSON.stringify({
				data,
				UID,
				saveTime: Date.now(),
			})
		);
	}
}
