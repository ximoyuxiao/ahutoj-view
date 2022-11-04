import { ElMessage } from "element-plus";
type elMessageType = "success" | "warning" | "info" | "error";
export default function elMessage({
	message = "",
	type = "info",
	duration = 3000,
	dangerouslyUseHTMLString = false,
}: {
	message: string;
	type: elMessageType;
	duration?: number;
	dangerouslyUseHTMLString?: boolean;
}) {
	return ElMessage({
		message,
		type,
		duration,
		dangerouslyUseHTMLString,
	});
}
