const APICodes = {
	info: 1,
	editInfo: 2,
	editPass: 3,
	status: 4,
	cfBind: 5,
};
export default function UserProcessor(
	APICode: number,
	ReasonCode: number
) {
	// 12
	switch (APICode) {
		// 01
		case APICodes.info:
			infoHandle(ReasonCode);
			break;
		// 02
		case APICodes.editInfo:
			editInfoHandle(ReasonCode);
			break;
		// 03
		case APICodes.editPass:
			editPassHandle(ReasonCode);
			break;
		// 04
		case APICodes.status:
			statusHandle(ReasonCode);
			break;
		// 05
		case APICodes.cfBind:
			cfBindHandle(ReasonCode);
			break;
	}
}

const infoType = {
	USER_INFO_FAILED: 1,
	USER_INFO_UIDNotExistCode: 2,
};
function infoHandle(ReasonCode: number) {
	switch (ReasonCode) {
		case infoType.USER_INFO_FAILED:
			break;
		case infoType.USER_INFO_UIDNotExistCode:
			break;
	}
}

const editInfoType = {
	USER_EDITINFO_FAILED: 1,
	USER_EDITINFO_UIDNotExistCode: 2,
};
function editInfoHandle(ReasonCode: number) {
	switch (ReasonCode) {
		case editInfoType.USER_EDITINFO_FAILED:
			break;
		case editInfoType.USER_EDITINFO_UIDNotExistCode:
			break;
	}
}

const editPassType = {
	USER_EDITPASS_FAILED: 1,
	USER_EDITPASS_PasswordEmptyCode: 2,
	USER_EDITPASS_PasswordCode: 3,
};
function editPassHandle(ReasonCode: number) {
	switch (ReasonCode) {
		case editPassType.USER_EDITPASS_FAILED:
			break;
		case editPassType.USER_EDITPASS_PasswordEmptyCode:
			break;
		case editPassType.USER_EDITPASS_PasswordCode:
			break;
	}
}

const statusType = {
	USER_STATUS_FAILED: 1,
};
function statusHandle(ReasonCode: number) {
	switch (ReasonCode) {
		case statusType.USER_STATUS_FAILED:
			break;
	}
}

const cfBindType = {
	USER_CFBIND_FAILED: 1,
	USER_CFBIND_UserEmptyCode: 2,
	USER_CFBIND_PassEmptyCode: 3,
	USER_CFBIND_PassErrorCode: 4,
};
function cfBindHandle(ReasonCode: number) {
	switch (ReasonCode) {
		case cfBindType.USER_CFBIND_FAILED:
			break;
		case cfBindType.USER_CFBIND_UserEmptyCode:
			break;
		case cfBindType.USER_CFBIND_PassEmptyCode:
			break;
		case cfBindType.USER_CFBIND_PassErrorCode:
			break;
	}
}
