import { ElMessage } from "element-plus";
type elMessageType = "success" | "warning" | "info" | "error";
export default function elMessage({
	message = "",
	type = "info",
}: {
	message: string;
	type: elMessageType;
}) {
	return ElMessage({
		message,
		type,
	});
}
