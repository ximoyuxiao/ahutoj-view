import { defineStore } from "pinia";
import { PiniaNameSpace } from "./nameSpace";

export const usePageBufferedDataStore = defineStore(
	PiniaNameSpace.PageBufferedData,
	{
		state: () => {
			return {
				//contest跳转的缓存
				contestRouterData: {},
			};
		},
		actions: {
			init() {
				let contest = localStorage.getItem("pageRouterData_contest");
				if (contest) this.contestRouterData = JSON.parse(contest);
			},

			setContestRouterData(
				CID: number,
				IsPublic: number = null,
				Pass: string = null,
				...args: any
			) {
				if (this.contestRouterData[CID]) {
					let temp = this.contestRouterData[CID];
					if (CID) temp["CID"] = CID;
					if (IsPublic) temp["IsPublic"] = IsPublic;
					if (Pass) temp["Pass"] = Pass;
					this.contestRouterData[CID] = {
						...temp,
						...args,
					};
				} else {
					this.contestRouterData[CID] = {
						CID,
						IsPublic,
						Pass,
						...args,
					};
				}
				localStorage.setItem(
					"pageRouterData_contest",
					JSON.stringify(this.contestRouterData)
				);
			},

			getContestRouterData(CID: number) {
				if (this.contestRouterData[CID]) {
					return this.contestRouterData[CID];
				}
				return null;
			},
		},
		getters: {},
	}
);
