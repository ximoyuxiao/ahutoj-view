import elMessage from "../elMessageFactory";

type msgType = string | null | undefined;
type elMessageType = "success" | "warning" | "info" | "error";
export default function Message(msg: msgType) {
	if (!msg || msg === "") return;
	let temp = msg.split("\\");
	let message = temp[0] as msgType;
	let type = temp[1] as elMessageType;
	console.log(message, type);
	elMessage({ message, type });
}
