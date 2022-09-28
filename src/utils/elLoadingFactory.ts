import { ElLoading } from "element-plus";

export default function elLoading({
	node,
	text = "加载中",
	fullscreen = false,
}: {
	node: string | HTMLElement | undefined;
	text: string;
	fullscreen: boolean;
}) {
	return ElLoading.service({
		target: node,
		text,
		fullscreen,
	});
}
