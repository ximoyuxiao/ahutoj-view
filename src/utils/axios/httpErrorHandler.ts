import { useConfigStore } from "../../pinia/config";

export default function httpErrorHandler(response: any) {
	let status = response?.status;
	if (status) {
		let configStore = useConfigStore();
		switch (status) {
			case 400:
				break;
			case 500:
				//网络问题
				configStore.needPing();
				break;
			case 404:
				//url错误
				break;
		}
	}
}
