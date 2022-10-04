//全局封装console.log
export default function log(
	message?: any,
	...optionalParams: any[]
): void {
	console.log(message, ...optionalParams);
}
