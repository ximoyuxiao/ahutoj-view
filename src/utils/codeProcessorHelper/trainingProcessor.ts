const APICodes = {
	add: 1,
	edit: 2,
	delete: 3,
	list: 4,
	get: 5,
};
export default function TraningProcessor(
	APICode: number,
	ReasonCode: number
) {
	// + 15
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
	TRAIN_ADD_FAILED: 1,
};
function addHandle(ReasonCode: number) {
	switch (ReasonCode) {
		case addType.TRAIN_ADD_FAILED:
			break;
	}
}

const editType = {
	TRAIN_EDIT_FAILED: 1,
};
function editHandle(ReasonCode: number) {
	switch (ReasonCode) {
		case editType.TRAIN_EDIT_FAILED:
			break;
	}
}

const deleteType = {
	TRAIN_DELETE_FAILED: 1,
};
function deleteHandle(ReasonCode: number) {
	switch (ReasonCode) {
		case deleteType.TRAIN_DELETE_FAILED:
			break;
	}
}

const listType = {
	TRAIN_LIST_FAILED: 1,
};
function listHandle(ReasonCode: number) {
	switch (ReasonCode) {
		case listType.TRAIN_LIST_FAILED:
			break;
	}
}

const getType = {
	TRAIN_GET_FAILED: 1,
};
function getHandle(ReasonCode: number) {
	switch (ReasonCode) {
		case getType.TRAIN_GET_FAILED:
			break;
	}
}
