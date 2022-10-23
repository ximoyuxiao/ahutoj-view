import { ElMessage } from "element-plus";
import { keys, Module } from "./codeProcessorHelper/codeConstants";
import AuthProcessor from "./codeProcessorHelper/authProcessor";
import AdminProcessor from "./codeProcessorHelper/adminProcessor";
import ContestProcessor from "./codeProcessorHelper/contestProcessor";
import ProblemProcessor from "./codeProcessorHelper/problemProcessor";
import SubmitProcessor from "./codeProcessorHelper/submitProcessor";
import TrainingProcessor from "./codeProcessorHelper/trainingProcessor";
import UserProcessor from "./codeProcessorHelper/userProcessor";
import FileProcessor from "./codeProcessorHelper/fileProcessor";
import messageHandle from "./codeProcessorHelper/messageHandle";

export default function codeProcessor(
	code: number | null | undefined,
	msg: string | null | undefined
) {
	//服务器msg
	if (msg && msg != "") {
		messageHandle(msg);
		return;
	}

	//一般状态码
	if (!code || code == 0) return;
	//开始解析
	let ModuleCode = Math.floor(code / 1000);
	let LocationCode = Math.floor((code % 1000) / 100);
	let OperationCode = code % 100;
	switch (ModuleCode) {
		//Auth模块 101
		case Module[keys.Auth]:
			AuthProcessor(LocationCode, OperationCode, msg);
			break;
		//User模块 102
		case Module[keys.User]:
			UserProcessor(LocationCode, OperationCode, msg);
			break;
		//Admin模块 103
		case Module[keys.Admin]:
			AdminProcessor(LocationCode, OperationCode, msg);
			break;
		//Problem模块 104
		case Module[keys.Problem]:
			ProblemProcessor(LocationCode, OperationCode, msg);
			break;
		//Training模块 105
		case Module[keys.Training]:
			TrainingProcessor(LocationCode, OperationCode, msg);
			break;
		//Contest模块 106
		case Module[keys.Contest]:
			ContestProcessor(LocationCode, OperationCode, msg);
			break;
		//Submit模块 107
		case Module[keys.Submit]:
			SubmitProcessor(LocationCode, OperationCode, msg);
			break;
		//File模块 108
		case Module[keys.File]:
			FileProcessor(LocationCode, OperationCode, msg);
			break;
	}

	//旧模块，正在逐步移除
	ElMessage({
		message: String(code),
		type: "info",
	});
}
