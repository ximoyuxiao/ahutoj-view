/**
 * 暴露缓存数据结构
 */
//配置信息
export type configDataType = {
	UID: string;
	submitThenRedirectToCode: boolean;
};

export type customThemeType = {
	font: {
		first: string;
		last: string;
	};
	fill: {
		first: string;
		last: string;
	};
	fill1: {
		first: string;
		last: string;
	};
	fill2: {
		first: string;
		last: string;
	};
	fill3: {
		first: string;
		last: string;
	};
	fill4: {
		first: string;
		last: string;
	};
	fill5: {
		first: string;
		last: string;
	};
	border: {
		first: string;
		last: string;
	};
};

export type userInfoType = {
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

export type rankDataType = {
	ACNumber: number;
	AllSubmit: number;
	CENumber: number;
	Problems: [];
	ProblemsMap: Map<number, any>;
	TimePenalty: number;
	Uname: string;
	UserID: string;
};

export type submitDataType = {
	Lang: number | null;
	PID: number | null;
	Result: any;
	SID: number | null;
	SubmitTime: number | null;
	UseMemory: number | null;
	UseTime: number | null;
	[item: string]: number;
};
