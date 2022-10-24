import { ElNotification } from "element-plus";
type elNotificationType = "success" | "warning" | "info" | "error";
type elNotificationPosition =
	| "top-right"
	| "top-left"
	| "bottom-right"
	| "bottom-left";
export default function elNotification({
	title = "",
	message = "",
	type = "info",
	position = "top-right",
	duration = 3000,
	dangerouslyUseHTMLString = false,
	offset = 0,
}: {
	title: string | undefined;
	message: string;
	type: elNotificationType;
	position: elNotificationPosition;
	duration: number;
	dangerouslyUseHTMLString: boolean;
	offset: number;
}) {
	return ElNotification({
		title,
		message,
		type,
		position,
		duration,
		dangerouslyUseHTMLString,
		offset: offset + 50,
	});
}
