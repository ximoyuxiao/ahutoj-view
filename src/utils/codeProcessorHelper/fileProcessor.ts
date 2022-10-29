const APICodes = {
	up: 1,
	remove: 2,
	unzip: 3,
	list: 4,
};
export default function FileProcessor(
	APICode: number,
	ReasonCode: number
) {
	// + 18
	switch (APICode) {
		// 01
		case APICodes.up:
			upHandle(ReasonCode);
			break;
		// 02
		case APICodes.remove:
			removeHandle(ReasonCode);
			break;
		// 03
		case APICodes.unzip:
			unzipHandle(ReasonCode);
			break;
		// 04
		case APICodes.list:
			listHandle(ReasonCode);
			break;
	}
}

const upType = {
	FILE_UP_FAILEDCode: 1,
	FILE_UP_UNSUPPORTCode: 2,
};
function upHandle(ReasonCode: number) {
	switch (ReasonCode) {
		case upType.FILE_UP_FAILEDCode:
			break;
		case upType.FILE_UP_UNSUPPORTCode:
			break;
	}
}

const removeType = {
	FILE_REMOVE_FAILEDCode: 1,
};
function removeHandle(ReasonCode: number) {
	switch (ReasonCode) {
		case removeType.FILE_REMOVE_FAILEDCode:
			break;
	}
}

const unzipType = {
	FILE_UNZIP_FAILEDCode: 1,
	FILE_UNZIP_UNSUPPORTCode: 2,
	FILE_UNZIP_NotExistCode: 3,
};
function unzipHandle(ReasonCode: number) {
	switch (ReasonCode) {
		case unzipType.FILE_UNZIP_FAILEDCode:
			break;
		case unzipType.FILE_UNZIP_UNSUPPORTCode:
			break;
		case unzipType.FILE_UNZIP_NotExistCode:
			break;
	}
}

const listType = {
	FILE_LIST_FAILEDCode: 1,
};
function listHandle(ReasonCode: number) {
	switch (ReasonCode) {
		case listType.FILE_LIST_FAILEDCode:
			break;
	}
}
