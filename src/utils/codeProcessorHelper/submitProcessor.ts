const APICodes = {
	add: 1,
	rejudg: 2,
	list: 4,
	get: 5,
};
export default function SubmitProcessor(
	APICode: number,
	ReasonCode: number
) {
	// + 17
	switch (APICode) {
		// 01
		case APICodes.add:
			addHandle(ReasonCode);
			break;
		// 02
		case APICodes.rejudg:
			rejudgHandle(ReasonCode);
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
	SUBMIT_ADD_FAILEDCode: 1,
	SUBMIT_ADD_DUPLICATECODE: 2,
};
function addHandle(ReasonCode: number) {
	switch (ReasonCode) {
		case addType.SUBMIT_ADD_FAILEDCode:
			break;
		case addType.SUBMIT_ADD_DUPLICATECODE:
			break;
	}
}

const rejudgType = {
	SUBMIT_REJUDG_FAILEDCode: 1,
};
function rejudgHandle(ReasonCode: number) {
	switch (ReasonCode) {
		case rejudgType.SUBMIT_REJUDG_FAILEDCode:
			break;
	}
}

const listType = {
	SUBMIT_LIST_FAILEDCode: 1,
};
function listHandle(ReasonCode: number) {
	switch (ReasonCode) {
		case listType.SUBMIT_LIST_FAILEDCode:
			break;
	}
}

const getType = {
	SUBMIT_GET_FAILEDCode: 1,
};
function getHandle(ReasonCode: number) {
	switch (ReasonCode) {
		case getType.SUBMIT_GET_FAILEDCode:
			break;
	}
}
