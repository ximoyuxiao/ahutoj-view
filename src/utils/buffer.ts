type userInfoType = {
	UID?: string;
	UserName?: string;
	School?: string;
	Classes?: string;
	Major?: string;
	Adapt?: string;
	Email?: string;
	isLogin?: boolean;
	[item: string]: any;
};

type rankData = {
	ACNumber: number;
	AllSubmit: number;
	CENumber: number;
	Problems: [];
	ProblemsMap: Map<number, any>;
	TimePenalty: number;
	Uname: string;
	UserID: string;
};

type submitDataType = {
	Lang: number | null;
	PID: number | null;
	Result: any;
	SID: number | null;
	SubmitTime: number | null;
	UseMemory: number | null;
	UseTime: number | null;
	[item: string]: number;
};

export class Config {
	public static submitLang(lang: number | string) {
		localStorage.setItem("submitLang", String(lang));
	}
}

export class UserData {
	public static userInfo(data: userInfoType) {
		let jsonString = JSON.stringify(data);
		sessionStorage.setItem("ahutOjUserInfo", jsonString);
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
	public static rankData(data: rankData, CID: number | string): void {
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
