import { defineStore } from "pinia";
import { PiniaNameSpace } from "./nameSpace";

export const useConstValStore = defineStore(PiniaNameSpace.ConstVal, {
	state: () => {
		return {
			//页面主题数值
			LightTheme: 1,
			DarkTheme: 2,
			Cyberpunk: 3,

			//权限bit表
			UNLOGINBit: 0b0000_0001,
			CommonUserBit: 0b0000_0010,
			AdministratorBit: 0b0000_0100,
			ProblemAdminBit: 0b0000_1000,
			ContestAdminBit: 0b0001_0000,
			SourceBorwserBit: 0b0010_0000,
			ListAdminBit: 0b0100_0000,
			SuperAdminBit: 0b1000_0000,

			//提交代码语言
			SUBMIT_LANG_C: 1,
			// SUBMIT_LANG_CPP: 2,
			SUBMIT_LANG_CPP11: 3,
			SUBMIT_LANG_CPP17: 4,
			SUBMIT_LANG_JAVA: 5,
			SUBMIT_LANG_PYTHON3: 6,

			//提交的通过状态颜色
			SUBMIT_STATUS_AC_COLOR: "#5ebd00",
			SUBMIT_STATUS_WA_COLOR: "#e10000",
			SUBMIT_STATUS_TLE_COLOR: "#8a2be2",
			SUBMIT_STATUS_MLE_COLOR: "#a61e4d",
			SUBMIT_STATUS_RE_COLOR: "#bdb76b",
			SUBMIT_STATUS_PE_COLOR: "#5f9ea0",
			SUBMIT_STATUS_OLE_COLOR: "#212121",
			SUBMIT_STATUS_CE_COLOR: "#8c8c8c",
			SUBMIT_STATUS_JUDGING_COLOR: "#ff9933",
			SUBMIT_STATUS_REJUDGING_COLOR: "#ff9933",
			SUBMIT_STATUS_PENDING_COLOR: "#ebcb8b",
			SUBMIT_STATUS_DENIAL_JUDGE: "#9E1030",
			SUBMIT_STATUS_JUDGE_TIMEOUT: "#bdbdbd",
			SUBMIT_STATUS_FAILED_COLOR: "#4d1700",

			//题目来源
			PROBLEM_ORIGIN_LOCAL: -1,
			PROBLEM_ORIGIN_CF: 1,
			PROBLEM_ORIGIN_ATCODER: 2,
			PROBLEM_ORIGIN_LUOGU: 3,

			//题目描述文本类型
			PROBLEM_CONTENTTYPE_NORMAL: -1,
			PROBLEM_CONTENTTYPE_MARKDOWN: 1,

			//题目是否可见
			PROBLEM_VISIBLE: 1,
			PROBLEM_UNVISIBLE: -1,

			//竞赛
			CONTEST_PUBLIC: 1,
			CONTEST_NOTPUBLIC: -1,

			CONTEST_TYPE_ACM: 1,
			CONTEST_TYPE_OI: 2,

			//报错提示信息
			SUBMIT_RESULT_PE:
				"你的输出结果也许是正确的，但是格式存在问题，请检查输出结果的换行情况\n\n例如C++: cout << a; 和 cout << a << endl;\n\n或者检查输出结果的空个间隔情况、中英文格式……",
			SUBMIT_RESULT_FAILED:
				"判题出现了问题，也许你的代码最终运行结果是正确的，请尝试单击下方重判按钮，尝试重新判题。",
		};
	},
	actions: {},
	getters: {},
});
