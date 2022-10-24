import { useUserDataStore } from "../pinia/userData";
import elMessage from "../utils/elMessageFactory";

export function needLoginCertificate(): boolean {
	const userDataStore = useUserDataStore();
	if (userDataStore.isLogin) {
		if (
			!localStorage.getItem("ahutOjToken") ||
			localStorage.getItem("ahutOjUserUid") != userDataStore.UID
		) {
			elMessage({
				message: "登录状态异常，请重新登录",
				type: "warning",
			});
			userDataStore.logout();
			return false;
		}
		return true;
	} else {
		elMessage({ message: "请先登录", type: "warning" });
		return false;
	}
}

export function needAdminCertificate(): boolean {
	if (needLoginCertificate()) {
		const userDataStore = useUserDataStore();
		if (userDataStore.PermissionMap > 3) {
			return true;
		} else {
			elMessage({ message: "权限不足", type: "warning" });
			return false;
		}
	} else {
		return false;
	}
}

export function needProblemAdminCertificate(): boolean {
	if (needAdminCertificate()) {
		const userDataStore = useUserDataStore();
		if (
			userDataStore.PermissionMap & 0x08 ||
			userDataStore.PermissionMap & 0x80
		) {
			return true;
		} else {
			elMessage({
				message: "您不是题目管理员，无法访问",
				type: "warning",
			});
			return false;
		}
	} else {
		return false;
	}
}

export function needContestAdminCertificate(): boolean {
	if (needAdminCertificate()) {
		const userDataStore = useUserDataStore();
		if (
			userDataStore.PermissionMap & 0x10 ||
			userDataStore.PermissionMap & 0x80
		) {
			return true;
		} else {
			elMessage({
				message: "您不是竞赛管理员，无法访问",
				type: "warning",
			});
			return false;
		}
	} else {
		return false;
	}
}

export function needSourceBorwserAdminCertificate(): boolean {
	if (needAdminCertificate()) {
		const userDataStore = useUserDataStore();
		if (
			userDataStore.PermissionMap & 0x20 ||
			userDataStore.PermissionMap & 0x80
		) {
			return true;
		} else {
			elMessage({
				message: "您不是资源管理员，无法访问",
				type: "warning",
			});
			return false;
		}
	} else {
		return false;
	}
}

export function needListAdminCertificate(): boolean {
	if (needAdminCertificate()) {
		const userDataStore = useUserDataStore();
		if (
			userDataStore.PermissionMap & 0x40 ||
			userDataStore.PermissionMap & 0x80
		) {
			return true;
		} else {
			elMessage({
				message: "您不是题单管理员，无法访问",
				type: "warning",
			});
			return false;
		}
	} else {
		return false;
	}
}

export function needSuperAdminCertificate(): boolean {
	if (needAdminCertificate()) {
		const userDataStore = useUserDataStore();
		if (userDataStore.PermissionMap & 0x80) {
			return true;
		} else {
			elMessage({ message: "您不是超管，无法访问", type: "warning" });
			return false;
		}
	} else {
		return false;
	}
}
