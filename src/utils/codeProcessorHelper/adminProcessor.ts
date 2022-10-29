const APICodes = {
	add: 1,
	edit: 2,
	delete: 3,
	list: 4,
	get: 5,
};
export default function AdminProcessor(
	APICode: number,
	ReasonCode: number
) {
	// + 13
	switch (APICode) {
		// 01
		case APICodes.add:
			addHandle(ReasonCode);
			break;
		// 02
		case APICodes.edit:
			editHandle(ReasonCode);
			break;
		// 03
		case APICodes.delete:
			deleteHandle(ReasonCode);
			break;
		// 04
		case APICodes.list:
			listHandle(ReasonCode);
			break;
		// 05
		case APICodes.get:
			getHandle(ReasonCode);
			break;
	}
}

const addType = {
	ADMIN_ADD_FAILED: 1,
	ADMIN_ADD_UIDEmpty: 2,
};
function addHandle(ReasonCode: number) {
	switch (ReasonCode) {
		case addType.ADMIN_ADD_FAILED:
			break;
		case addType.ADMIN_ADD_UIDEmpty:
			break;
	}
}

const editType = {
	ADMIN_EDIT_FAILED: 1,
	ADMIN_EDIT_ADMIN: 2,
};
function editHandle(ReasonCode: number) {
	switch (ReasonCode) {
		case editType.ADMIN_EDIT_FAILED:
			break;
		case editType.ADMIN_EDIT_ADMIN:
			break;
	}
}

const deleteType = {
	ADMIN_DELETE_FAILED: 1,
};
function deleteHandle(ReasonCode: number) {
	switch (ReasonCode) {
		case deleteType.ADMIN_DELETE_FAILED:
			break;
	}
}

const listType = {
	ADMIN_LIST_FAILED: 1,
};
function listHandle(ReasonCode: number) {
	switch (ReasonCode) {
		case listType.ADMIN_LIST_FAILED:
			break;
	}
}

const getType = {
	ADMIN_GET_FAILED: 1,
};
function getHandle(ReasonCode: number) {
	switch (ReasonCode) {
		case getType.ADMIN_GET_FAILED:
			break;
	}
}
