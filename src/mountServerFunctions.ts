import { App } from "vue";

//服务器请求回调函数装载
export default function mountServerFunctions(app: App<Element>) {
	//获取服务器时间（异步）
	app.config.globalProperties.getServerTime =
		async function getServerTime() {
			let ret: { [item: string]: any };
			await app.config.globalProperties.$axios
				.get("api/now")
				.then((res: any) => {
					ret = res.data;
					if (res.data?.time < 1e11) {
						ret.time *= 1000;
					}
				});
			return ret;
		};
}
