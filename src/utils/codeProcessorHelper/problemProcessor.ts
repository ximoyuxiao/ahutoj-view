const APICodes = {
	add: 1,
	edit: 2,
	delete: 3,
	list: 4,
	get: 5,
};

export default function ProblemProcessor(
	APICode: number,
	ReasonCode: number
) {
	// + 14
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
	PROBLEM_ADD_FAILED: 1,
};
function addHandle(ReasonCode: number) {
	switch (ReasonCode) {
		case addType.PROBLEM_ADD_FAILED:
			break;
	}
}

const editType = {
	PROBLEM_EDIT_FAILED: 1,
	PROBLEM_EDIT_PIDNoteExistCode: 2,
};
function editHandle(ReasonCode: number) {
	switch (ReasonCode) {
		case editType.PROBLEM_EDIT_FAILED:
			break;
		case editType.PROBLEM_EDIT_PIDNoteExistCode:
			break;
	}
}

const deleteType = {
	PROBLEM_DELETE_FAILED: 1,
};
function deleteHandle(ReasonCode: number) {
	switch (ReasonCode) {
		case deleteType.PROBLEM_DELETE_FAILED:
			break;
	}
}

const listType = {
	PROBLEM_LIST_FAILED: 1,
};
function listHandle(ReasonCode: number) {
	switch (ReasonCode) {
		case listType.PROBLEM_LIST_FAILED:
			break;
	}
}

const getType = {
	PROBLEM_GET_FAILED: 1,
	PROBLEM_GET_PIDNotExistCode: 2,
};
function getHandle(ReasonCode: number) {
	switch (ReasonCode) {
		case getType.PROBLEM_GET_FAILED:
			break;
		case getType.PROBLEM_GET_PIDNotExistCode:
			break;
	}
}
