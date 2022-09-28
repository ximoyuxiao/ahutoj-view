//用户信息类型
type userInfo = {
	UID?: string;
	UserName?: string;
	School?: string;
	Classes?: string;
	Major?: string;
	Adapt?: string;
	Email?: string;
	PermissionMap?: number;
};

export default {
	namespaced: true,
	state: {
		isLogin: false,
		UID: "",
		UserName: "",
		School: "",
		Classes: "",
		Major: "",
		Adapt: "",
		Email: "",
		PermissionMap: 0, //十进制，使用时用二进制运算
	},
	mutations: {
		//用户注册登录成功，数据同步
		login(state: any, data: userInfo) {
			state.UID = data.UID;
			state.UserName = data.UserName;
			state.School = data.School;
			state.Classes = data.Classes;
			state.Major = data.Major;
			state.Adapt = data.Adapt;
			state.Email = data.Email;
			state.isLogin = true;
		},

		//同步permission信息
		synchronizePermission(state: any, PermissionMap: number) {
			state.PermissionMap = PermissionMap;
		},

		//将用户信息存入session仓库
		sessionUserInfo(state: any) {
			let data: userInfo = {};
			data.UID = state.UID;
			data.UserName = state.UserName;
			data.School = state.School;
			data.Classes = state.Classes;
			data.Major = state.Major;
			data.Adapt = state.Adapt;
			data.Email = state.Email;
			data.PermissionMap = state.PermissionMap;
			let jsonString = JSON.stringify(data);
			sessionStorage.setItem("ahutOjUserInfo", jsonString);
		},

		//退出登录
		logout(state: any) {
			state.UID = "";
			state.UserName = "";
			state.School = "";
			state.Classes = "";
			state.Major = "";
			state.Email = "";
			state.PermissionMap = 0;
			state.isLogin = false;
		},
	},
};
