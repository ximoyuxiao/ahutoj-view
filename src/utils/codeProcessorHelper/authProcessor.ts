import { UserData } from "../buffer/buffer";

const APICodes = {
	token: 0,
	login: 1,
	register: 2,
};

export default function AuthProcessor(
	APICode: number,
	ReasonCode: number
) {
	// 11
	switch (APICode) {
		// 00
		case APICodes.token:
			tokenHandle(ReasonCode);
			break;
		// 01
		case APICodes.login:
			loginHandle(ReasonCode);
			break;
		// 02
		case APICodes.register:
			registerHandle(ReasonCode);
			break;
	}
}

const tokenType = {
	AUTH_Token_EmptyCode: 1,
	AUTH_Token_InvalidCode: 2,
	AUTH_Token_URLVerifyCode: 3,
};
function tokenHandle(ReasonCode: number) {
	switch (ReasonCode) {
		// 01
		case tokenType.AUTH_Token_EmptyCode:
			UserData.clearUserLoginCertificate();
			break;
		// 02
		case tokenType.AUTH_Token_InvalidCode:
			UserData.clearUserLoginCertificate();
			break;
		// 03
		case tokenType.AUTH_Token_URLVerifyCode:
			break;
	}
}

const loginType = {
	AUTH_LOGIN_FAILED: 1,
	AUTH_LOGIN_UIDEmptyCode: 2,
	AUTH_LOGIN_PassEmptyCode: 3,
	AUTH_LOGIN_PASSERRORCode: 4,
	AUTH_LOGIN_UIDNotExistCode: 5,
	AUTH_LOGIN_TokenBuildCode: 6,
};
function loginHandle(ReasonCode: number) {
	switch (ReasonCode) {
		// 01
		case loginType.AUTH_LOGIN_FAILED:
			break;
		// 02
		case loginType.AUTH_LOGIN_UIDEmptyCode:
			break;
		// 03
		case loginType.AUTH_LOGIN_PassEmptyCode:
			break;
		// 04
		case loginType.AUTH_LOGIN_PASSERRORCode:
			break;
		// 05
		case loginType.AUTH_LOGIN_UIDNotExistCode:
			break;
		// 06
		case loginType.AUTH_LOGIN_TokenBuildCode:
			break;
	}
}

const registerType = {
	AUTH_REGISTER_FAILED: 1,
	AUTH_REGISTER_UIDExistCode: 2,
	AUTH_REGISTER_TokenBuildCode: 3,
};
function registerHandle(ReasonCode: number) {
	switch (ReasonCode) {
		// 01
		case registerType.AUTH_REGISTER_FAILED:
			break;
		// 02
		case registerType.AUTH_REGISTER_UIDExistCode:
			break;
		// 03
		case registerType.AUTH_REGISTER_TokenBuildCode:
			break;
	}
}
