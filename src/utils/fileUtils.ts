import { read, utils } from "xlsx";

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
						msg: "文件类型不正确",
						data: "",
					};
					reject(respondBody);
				}
			};
		});
	}
}

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
