const APICodes = {
	default: 0,
};
export default function DefaultProcessor(
	APICode: number,
	ReasonCode: number
) {
	// 00
	switch (APICode) {
		case APICodes.default:
			defaultHandle(ReasonCode);
	}
}

const defaultType = {
	ServerErrorCode: 1,
	InvalidParamCode: 2,
	PageNotFoundCode: 3,
	NotimplementedCode: 4,
};
function defaultHandle(ReasonCode: number) {
	switch (ReasonCode) {
		// 01
		case defaultType.ServerErrorCode:
			break;
		// 02
		case defaultType.InvalidParamCode:
			break;
		// 03
		case defaultType.PageNotFoundCode:
			break;
		// 04
		case defaultType.NotimplementedCode:
			break;
	}
}
