const APICodes = {
	add: 1,
	edit: 2,
	delete: 3,
	list: 4,
	get: 5,
	rank: 6,
};
export default function ContestProcessor(
	APICode: number,
	ReasonCode: number
) {
	// + 16
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
		// 05
		case APICodes.get:
			rankHandle(ReasonCode);
			break;
	}
}
const addType = {
	CONTEST_ADD_FAILED: 1,
};
function addHandle(ReasonCode: number) {
	switch (ReasonCode) {
		case addType.CONTEST_ADD_FAILED:
			break;
	}
}

const editType = {
	CONTEST_EDIT_FAILED: 1,
};
function editHandle(ReasonCode: number) {
	switch (ReasonCode) {
		case editType.CONTEST_EDIT_FAILED:
			break;
	}
}

const deleteType = {
	CONTEST_DELETE_FAILED: 1,
};
function deleteHandle(ReasonCode: number) {
	switch (ReasonCode) {
		case deleteType.CONTEST_DELETE_FAILED:
			break;
	}
}

const listType = {
	CONTEST_LIST_FAILED: 1,
};
function listHandle(ReasonCode: number) {
	switch (ReasonCode) {
		case listType.CONTEST_LIST_FAILED:
			break;
	}
}

const getType = {
	CONTEST_GET_FAILED: 1,
	CONTEST_GET_CIDNotExistCode: 2,
	CONTEST_GET_NotBegin: 3,
	CONTEST_GET_CIDPassWordErrorCode: 4,
};
function getHandle(ReasonCode: number) {
	switch (ReasonCode) {
		case getType.CONTEST_GET_FAILED:
			break;
		case getType.CONTEST_GET_CIDNotExistCode:
			break;
		case getType.CONTEST_GET_NotBegin:
			break;
		case getType.CONTEST_GET_CIDPassWordErrorCode:
			break;
	}
}

const rankType = {
	CONTEST_RANK_FAILED: 1,
};
function rankHandle(ReasonCode: number) {
	switch (ReasonCode) {
		case rankType.CONTEST_RANK_FAILED:
			break;
	}
}
