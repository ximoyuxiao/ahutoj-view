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
import DefaultProcessor from "./codeProcessorHelper/defaultProcessor";

export default function codeProcessor(
	code: number | null | undefined,
	msg: string | null | undefined
) {
	//服务器msg
	if (msg && msg != "") {
		messageHandle(msg);
	}

	if (!code || Number(code) == 0) return;
	//code码正则表达式匹配解构 2-2-2格式
	let reg =
		/(?<ModuleCode>[0-9]{2})(?<APICode>[0-9]{2})(?<ReasonCode>[0-9]{2})/;
	let res = reg.exec(String(code));
	//开始解析
	let ModuleCode = Number(res.groups.ModuleCode);
	let APICode = Number(res.groups.APICode);
	let ReasonCode = Number(res.groups.ReasonCode);

	switch (ModuleCode) {
		//Default模块 10
		case Module[keys.Default]:
			DefaultProcessor(APICode, ReasonCode);
		//Auth模块 11
		case Module[keys.Auth]:
			AuthProcessor(APICode, ReasonCode);
			break;
		//User模块 12
		case Module[keys.User]:
			UserProcessor(APICode, ReasonCode);
			break;
		//Admin模块 13
		case Module[keys.Admin]:
			AdminProcessor(APICode, ReasonCode);
			break;
		//Problem模块 14
		case Module[keys.Problem]:
			ProblemProcessor(APICode, ReasonCode);
			break;
		//Training模块 15
		case Module[keys.Training]:
			TrainingProcessor(APICode, ReasonCode);
			break;
		//Contest模块 16
		case Module[keys.Contest]:
			ContestProcessor(APICode, ReasonCode);
			break;
		//Submit模块 17
		case Module[keys.Submit]:
			SubmitProcessor(APICode, ReasonCode);
			break;
		//File模块 18
		case Module[keys.File]:
			FileProcessor(APICode, ReasonCode);
			break;
	}
}
