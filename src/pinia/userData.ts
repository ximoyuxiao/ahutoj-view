import { defineStore } from "pinia";
import { Config, UserData } from "../utils/buffer/buffer";
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
	CodeForceUser?: string;
	Vjid?: string;
	PermissionMap?: number;
	Solved?:number;
	Submited?:number;
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
			CodeForceUser: "",
			Vjid: "",
			PermissionMap: 0, //十进制，使用时用二进制运算
			Solved:0,
			Submited:0,
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
			this.CodeForceUser = data.CodeForceUser;
			this.Vjid = data.Vjid;
			this.isLogin = true;
			this.Solved = data.Solved;
			this.Submited = data.Submited;
		},

		//同步permission信息
		synchronizePermission(PermissionMap: number) {
			this.PermissionMap = PermissionMap;
		},

		//更新数据
		updateData(data: userInfo) {
			if (data.UID) this.UID = data.UID;
			if (data.UserName) this.UserName = data.UserName;
			if (data.School) this.School = data.School;
			if (data.Classes) this.Classes = data.Classes;
			if (data.Major) this.Major = data.Major;
			if (data.Adapt) this.Adapt = data.Adapt;
			if (data.Email) this.Email = data.Email;
			if (data.CodeForceUser) this.CodeForceUser = data.CodeForceUser;
			if (data.Vjid) this.Vjid = data.Vjid;
			if (data.Submited) this.Submited = data.Submited;
			if (data.Solved) this.Solved = data.Solved;
			this.sessionUserInfo();
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
			data.CodeForceUser = this.CodeForceUser;
			data.Vjid = this.Vjid;
			data.PermissionMap = this.PermissionMap;
			data.Solved = this.Solved;
			data.Submited = this.Submited;
			UserData.userInfo(data);
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
			this.Submited = 0;
			this.Solved = 0;
			Config.clearStore();
		},
	},
	getters: {},
});
