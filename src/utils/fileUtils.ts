import { App } from "vue";
import { read, utils } from "xlsx";
import Compressor from "compressorjs";
var appProxy = null;

//安装
export default function install(app: App<Element>) {
	appProxy = app;
}

//一般文件上传工具
export class FileUpdateUtils {
	//上传题目的图片
	public static uploadProblemJudgeFile(
		file: File | Blob,
		PID: number
	) {
		let formData = new FormData();
		formData.append("file", file as Blob);
		return new Promise((resolve, reject) => {
			appProxy.config.globalProperties
				.$post("api/file/" + PID, formData, 2)
				.then((res: any) => {
					resolve(res);
				});
		});
	}
}

//图片上传工具
export class ImageFileUploadUtils {
	//上传题目的图片
	public static uploadProblemImage(image: Blob) {
		let file = new FormData();
		file.append("file", image);
		return new Promise((resolve, reject) => {
			appProxy.config.globalProperties
				.$post("api/file/image/", file, 2)
				.then((res: any) => {
					resolve(res);
				});
		});
	}

	//上传头像图片
	public static uploadUserHeadImage(image: Blob) {
		let file = new FormData();
		file.append("file", image);
		return new Promise((resolve, reject) => {
			appProxy.config.globalProperties
				.$post("api/user/editHead/", file, 2)
				.then((res: any) => {
					resolve(res);
				});
		});
	}
}

//excel文件工具
export class ExcelFileUtils {
	//读取Excel表格
	public static getContentFromExcel(file: File) {
		let fileReader = new FileReader();
		fileReader.readAsBinaryString(file);
		return new Promise(function (resolve, reject) {
			fileReader.onload = function (ev) {
				let respondBody = {};
				try {
					let data = ev.target.result;
					// 以二进制流方式读取得到整份excel表格对象
					let workbook = read(data, {
						type: "binary",
					});
					let sheetContent = [];
					// 遍历每张表读取
					for (let sheet in workbook.Sheets) {
						if (workbook.Sheets.hasOwnProperty(sheet)) {
							sheetContent.push(
								utils.sheet_to_json(workbook.Sheets[sheet])
							);
						}
					}
					respondBody = {
						code: 0,
						msg: "文件解析成功",
						data: sheetContent,
					};
					resolve(respondBody);
				} catch (e) {
					respondBody = {
						code: -1,
						msg: e,
						data: "",
					};
					reject(respondBody);
				}
			};
		});
	}
}

//Json文件工具
export class JsonFileUtils {
	//读取Json
	public static getContentFromJson(file: File) {
		let reader = new FileReader();
		reader.readAsText(file);
		return new Promise(function (resolve, reject) {
			let respondBody = {};
			reader.onload = (e: any) => {
				// 处理文件内容
				respondBody["data"] = JSON.parse(e.target.result);
				resolve(respondBody);
			};
		});
	}
}

//图片工具
export class ImageFileUtils {
	//题目图片压缩
	public static problemImageCompress(image: File) {
		return new Promise((resolve) => {
			let name = image.name;
			let type = image.type;
			ImageFileUtils.compress(
				image,
				0.7,
				undefined,
				undefined,
				(blob: File | Blob) => {
					let file = new File([blob], name, {
						type,
						lastModified: Date.now(),
					});
					let response = { code: 0, data: file };
					resolve(response);
				},
				(error: Error) => {
					let response = { code: -1, msg: error };
					resolve(response);
				}
			);
		});
	}

	//用户头像文件压缩
	public static userHeadImageCompress(image: File) {
		return new Promise((resolve) => {
			let name = image.name;
			let type = image.type;
			ImageFileUtils.compress(
				image,
				0.55,
				200,
				200,
				(blob: File | Blob) => {
					let file = new File([blob], name, {
						type,
						lastModified: Date.now(),
					});
					let response = { code: 0, data: file };
					resolve(response);
				},
				(error: Error) => {
					let response = { code: -1, msg: error };
					resolve(response);
				}
			);
		});
	}

	//图片压缩
	public static compress(
		image: File,
		quality: number,
		width: number,
		height: number,
		success: (file: File | Blob) => void,
		error: (error: Error) => void
	) {
		return new Compressor(image, {
			quality, //压缩比例0-1
			width,
			height,
			minWidth: 80,
			minHeight: 80,
			maxWidth: 1920,
			maxHeight: 1080,
			mimeType: "image/jpeg",
			convertTypes: ["image/png", "image/webp", "image/jpg"],
			success,
			error,
		});
	}
}

export class FileConvertor {
	public static file2Blob(file: File): string {
		var url = "";
		if (window.URL != undefined) {
			url = window.URL.createObjectURL(file);
		} else if (window.webkitURL != undefined) {
			url = window.webkitURL.createObjectURL(file);
		}
		return url;
	}
}
