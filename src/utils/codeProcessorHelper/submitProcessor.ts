import elMessage from "../elMessageFactory";
import { keys, Location, Operation } from "./codeConstants";
export default function SubmitProcessor(
	LocationCode: number,
	OperationCode: number,
	msg: string
) {
	// + 107
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
	}
}

function logicLevelHandle(OperationCode: number) {
	switch (OperationCode) {
	}
}

function modelsLevelHandle(OperationCode: number) {
	switch (OperationCode) {
	}
}
