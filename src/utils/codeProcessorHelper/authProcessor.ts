import elMessage from "../elMessageFactory";
import { keys, Location, Operation } from "./codeConstants";
export default function AuthProcessor(
	LocationCode: number,
	OperationCode: number,
	msg: string
) {
	// + 101
	switch (LocationCode) {
		// + 1
		case Location[keys.Service]:
			serviceLevelHandle(OperationCode);
			break;
		// + 2
		case Location[keys.Logic]:
			logicLevelHandle(OperationCode);
			break;
		// + 3
		case Location[keys.Models]:
			modelsLevelHandle(OperationCode);
			break;
	}
}

function serviceLevelHandle(OperationCode: number) {
	switch (OperationCode) {
		case Operation[keys.MysqlAdd]:
			break;
		case Operation[keys.MysqlDelete]:
			break;
		case Operation[keys.MysqlUpdate]:
			break;
		case Operation[keys.MysqlQuery]:
			break;
		case Operation[keys.RedisAdd]:
			break;
		case Operation[keys.RedisDelete]:
			break;
		case Operation[keys.RedisUpdate]:
			break;
		case Operation[keys.RedisQuery]:
			break;
		case Operation[keys.ServerBusy]:
			break;
		case Operation[keys.ServerError]:
			break;
		case Operation[keys.Parsesparameters]:
			break;
		case Operation[keys.ParametersTypeError]:
			break;
		case Operation[keys.ParametersFormatError]:
			break;
		case Operation[keys.ParametersConversionError]:
			break;
		case Operation[keys.TokenBuildError]:
			break;
		case Operation[keys.DataEmpty]:
			break;
		case Operation[keys.DataNotExist]:
			break;
		case Operation[keys.DataResolutionError]:
			break;
		case Operation[keys.UIDExist]:
			break;
		case Operation[keys.UIDNotExist]:
			break;
		case Operation[keys.UIDEmpty]:
			break;
		case Operation[keys.PasswordError]:
			break;
		case Operation[keys.PasswordEmpty]:
			break;
		case Operation[keys.Notimplemented]:
			break;
	}
}

function logicLevelHandle(OperationCode: number) {
	switch (OperationCode) {
		case Operation[keys.MysqlAdd]:
			break;
		case Operation[keys.MysqlDelete]:
			break;
		case Operation[keys.MysqlUpdate]:
			break;
		case Operation[keys.MysqlQuery]:
			break;
		case Operation[keys.RedisAdd]:
			break;
		case Operation[keys.RedisDelete]:
			break;
		case Operation[keys.RedisUpdate]:
			break;
		case Operation[keys.RedisQuery]:
			break;
		case Operation[keys.ServerBusy]:
			break;
		case Operation[keys.ServerError]:
			break;
		case Operation[keys.Parsesparameters]:
			break;
		case Operation[keys.ParametersTypeError]:
			break;
		case Operation[keys.ParametersFormatError]:
			break;
		case Operation[keys.ParametersConversionError]:
			break;
		case Operation[keys.TokenBuildError]:
			break;
		case Operation[keys.DataEmpty]:
			break;
		case Operation[keys.DataNotExist]:
			break;
		case Operation[keys.DataResolutionError]:
			break;
		case Operation[keys.UIDExist]:
			elMessage({
				message: "该账号已经被注册过了哦，换一个试试吧！",
				type: "warning",
      });
      
			break;
		case Operation[keys.UIDNotExist]:
			elMessage({
				message: "您输入的账号不存在，请确认是否正确输入账号",
				type: "warning",
			});
			break;
		case Operation[keys.UIDEmpty]:
			elMessage({
				message: "您输入的账号为空，请正确输入账号",
				type: "warning",
			});
			break;
		case Operation[keys.PasswordError]:
			elMessage({
				message: "密码错误",
				type: "warning",
			});
			break;
		case Operation[keys.PasswordEmpty]:
			elMessage({
				message: "密码不能为空",
				type: "error",
			});
			break;
		case Operation[keys.Notimplemented]:
	}
}

function modelsLevelHandle(OperationCode: number) {
	switch (OperationCode) {
		case Operation[keys.MysqlAdd]:
			break;
		case Operation[keys.MysqlDelete]:
			break;
		case Operation[keys.MysqlUpdate]:
			break;
		case Operation[keys.MysqlQuery]:
			break;
		case Operation[keys.RedisAdd]:
			break;
		case Operation[keys.RedisDelete]:
			break;
		case Operation[keys.RedisUpdate]:
			break;
		case Operation[keys.RedisQuery]:
			break;
		case Operation[keys.ServerBusy]:
			break;
		case Operation[keys.ServerError]:
			break;
		case Operation[keys.Parsesparameters]:
			break;
		case Operation[keys.ParametersTypeError]:
			break;
		case Operation[keys.ParametersFormatError]:
			break;
		case Operation[keys.ParametersConversionError]:
			break;
		case Operation[keys.TokenBuildError]:
			break;
		case Operation[keys.DataEmpty]:
			break;
		case Operation[keys.DataNotExist]:
			break;
		case Operation[keys.DataResolutionError]:
			break;
		case Operation[keys.UIDExist]:
			break;
		case Operation[keys.UIDNotExist]:
			break;
		case Operation[keys.UIDEmpty]:
			break;
		case Operation[keys.PasswordError]:
			break;
		case Operation[keys.PasswordEmpty]:
			break;
		case Operation[keys.Notimplemented]:
	}
}
