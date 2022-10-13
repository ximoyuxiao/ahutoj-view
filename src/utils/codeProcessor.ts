import { ElMessage } from "element-plus";
import { stringify } from "querystring";

type codeType = "success" | "warning" | "info" | "error";
export default function codeProcessor(
	code: number | null | undefined,
	type: codeType
) {
	if (code == 0 || code == 200) return;
	switch (code) {
		case 101:
			ElMessage({
				message: "账号为空",
				type: "error",
			});
			break;
		case 102:
			ElMessage({
				message: "密码为空",
				type: "error",
			});
			break;
		case 1001:
			ElMessage({
				message: "请求参数错误",
				type: "error",
			});
			break;
		case 1002:
			ElMessage({
				message: "账号不存在",
				type: "warning",
			});
			break;
		case 1003:
			ElMessage({
				message: "账号未登录",
				type: "warning",
			});
			break;
		case 1004:
			ElMessage({
				message: "密码错误",
				type: "error",
			});
			break;
		case 1005:
			ElMessage({
				message: "Token创建失败",
				type: "error",
			});
			break;
		case 1006:
			ElMessage({
				message: "无效的Token",
				type: "warning",
			});
			break;
		case 1007:
			ElMessage({
				message: "账号已存在",
				type: "warning",
			});
			break;
		case 1008:
			ElMessage({
				message: "该题目已存在",
				type: "error",
			});
			break;
		case 1009:
			ElMessage({
				message: "题目不存在",
				type: "error",
			});
			break;
		case 1010:
			ElMessage({
				message: "竞赛不存在",
				type: "error",
			});
			break;
		case 2000:
			ElMessage({
				message: "竞赛密码错误",
				type: "error",
			});
			break;
		case 2001:
			ElMessage({
				message: "数据库错误",
				type: "error",
			});
			break;
		case 2002:
			ElMessage({
				message: "缓存数据库错误",
				type: "error",
			});
			break;
		case 2005:
			ElMessage({
				message: "竞赛未开始",
				type: "error",
			});
			break;
		case 5001:
			ElMessage({
				message: "服务器繁忙",
				type: "warning",
			});
			break;
		default:
			ElMessage({
				message: String(code),
				type: "info",
			});
	}
}
