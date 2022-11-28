import axios, { AxiosRequestConfig } from "axios";
import { App } from "vue";
import httpErrorHandler from "./httpErrorHandler";

// export var baseURL = "http://81.68.182.68/";
export var staticSourceBaseURL = "";
export var server1 = "https://channelcz.top/";
// export var server1 = "http://81.68.182.68/";
export var server2 = "http://127.0.0.1:4077/";

if (import.meta.env.MODE === "production") {
	staticSourceBaseURL = "/";
} else {
	staticSourceBaseURL = "https://channelcz.top/";
	// staticSourceBaseURL = "http://81.68.182.68/";
}

//默认请求地址
// console.log(import.meta.env);
function chooseServer(server) {
	if (import.meta.env.MODE === "production") {
		axios.defaults.baseURL = "/";
	} else {
		switch (server) {
			case 1:
				axios.defaults.baseURL = server1;
				break;
			case 2:
				axios.defaults.baseURL = server2;
				break;
		}
	}
}

// http request拦截器
axios.interceptors.request.use(
	function (config: AxiosRequestConfig): AxiosRequestConfig {
		let Token: string | null = localStorage.getItem("ahutOjToken");
		if (Token && config.headers) {
			config.headers.Authorization = Token;
		}
		return config;
	},
	function (error) {
		return Promise.reject(error);
	}
);

// http response拦截器
axios.interceptors.response.use(
	(res) => {
		return res;
	},
	(err) => {
		httpErrorHandler(err.response);
		return err.response;
	}
);

//请求头
const contentType = [
	"application/json; charset=UTF-8",
	"application/json; charset=UTF-8",
	"multipart/form-data",
];

//自定义封装get post
export default {
	install: (app: App<Element>) => {
		app.config.globalProperties.$axios = axios;

		//封装get请求
		app.config.globalProperties.$get = function get(
			url: string,
			params: object | null,
			content: number = 0,
			server: number = 1
		) {
			chooseServer(server);
			return axios.get(url, {
				params,
				headers: { "Content-Type": contentType[content] },
			});
		};

		//封装post请求
		app.config.globalProperties.$post = function post(
			url: string,
			data: object | null,
			content: number = 0,
			server: number = 1
		) {
			chooseServer(server);
			return axios.post(url, data, {
				headers: { "Content-Type": contentType[content] },
			});
		};

		app.config.globalProperties.$put = function Put(
			url: string,
			data: object | null,
			content: number = 0,
			server: number = 1
		) {
			chooseServer(server);
			return axios.put(url, {
				data,
				headers: { "Content-Type": contentType[content] },
			});
		};

		//封装delete请求
		app.config.globalProperties.$delete = function Delete(
			url: string,
			data: object | null,
			content: number = 0,
			server: number = 1
		) {
			chooseServer(server);
			return axios.delete(url, {
				data,
				headers: { "Content-Type": contentType[content] },
			});
		};
	},
};
