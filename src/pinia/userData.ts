import { defineStore } from "pinia";
import { PiniaNameSpace } from "./nameSpace";

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

export const useUserDataStore = defineStore(PiniaNameSpace.UserData, {
	state: () => {
		return {
			isLogin: false,
			UID: "",
			UserName: "",
			School: "",
			Classes: "",
			Major: "",
			Adapt: "",
			Email: "",
			PermissionMap: 0, //十进制，使用时用二进制运算
		};
	},
	actions: {
		//用户注册登录成功，数据同步
		login(data: userInfo) {
			this.UID = data.UID;
			this.UserName = data.UserName;
			this.School = data.School;
			this.Classes = data.Classes;
			this.Major = data.Major;
			this.Adapt = data.Adapt;
			this.Email = data.Email;
			this.isLogin = true;
		},

		//同步permission信息
		synchronizePermission(PermissionMap: number) {
			this.PermissionMap = PermissionMap;
		},

		//将用户信息存入session仓库
		sessionUserInfo() {
			let data: userInfo = {};
			data.UID = this.UID;
			data.UserName = this.UserName;
			data.School = this.School;
			data.Classes = this.Classes;
			data.Major = this.Major;
			data.Adapt = this.Adapt;
			data.Email = this.Email;
			data.PermissionMap = this.PermissionMap;
			let jsonString = JSON.stringify(data);
			sessionStorage.setItem("ahutOjUserInfo", jsonString);
		},

		//退出登录
		logout() {
			this.isLogin = false;
			this.UID = "";
			this.UserName = "";
			this.School = "";
			this.Classes = "";
			this.Major = "";
			this.Adapt = "";
			this.Email = "";
			this.PermissionMap = 0;
			sessionStorage.clear();
			localStorage.clear();
		},
	},
	getters: {},
});
