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
