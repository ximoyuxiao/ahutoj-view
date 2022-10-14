import { useConstValStore } from "../pinia/constVal";

//时间转换工具包
export class TimeTools {
	//时间戳转日期(年月日)
	public static timestampToDate(
		time: number,
		mode: number = 1
	): string {
		if (time <= 1e10) time *= 1000;
		let t = new Date(time);
		let y = t.getFullYear();
		let m = t.getMonth() + 1;
		let d = t.getDate();
		if (mode == 1) {
			return y + "/" + m + "/" + d;
		} else if (mode == 2) {
			return (
				y +
				"-" +
				(m < 10 ? "0" + m : m) +
				"-" +
				(d < 10 ? "0" + d : d)
			);
		}
		return "";
	}

	//时间戳转日期（年月日 时分秒）
	public static timestampToTime(time: number): string {
		if (time <= 1e10) time *= 1000;
		let t = new Date(time);
		let y = t.getFullYear();
		let m = t.getMonth() + 1;
		let d = t.getDate();
		let h = t.getHours();
		let mi =
			t.getMinutes() < 10 ? "0" + t.getMinutes() : t.getMinutes();
		let s =
			t.getSeconds() < 10 ? "0" + t.getSeconds() : t.getSeconds();
		return y + "/" + m + "/" + d + " " + h + ":" + mi + ":" + s;
	}

	//时间戳获取 时分秒
	public static timestampGetHMS(
		time: number,
		mode: number = 1
	): string {
		let d = new Date(time);
		let h = d.getHours();
		let m =
			d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes();
		let s =
			d.getSeconds() < 10 ? "0" + d.getSeconds() : d.getSeconds();
		if (mode == 1) return h + ":" + m + ":" + s;
		else return h + ":" + m;
	}

	//时间戳间隔计算1 (计算两个时间戳间隔了多少天)
	public static timeIntervalToDay(
		time1: number,
		time2: number
	): number {
		if (time1 <= 1e10) time1 *= 1000;
		if (time2 <= 1e10) time2 *= 1000;
		let t = Math.abs(time1 - time2);
		t = Math.floor(t / (3600 * 1000 * 24));
		return t;
	}

	//时间戳间隔计算2 (计算两个时间戳间隔了多少时分秒，可选择格式)
	public static timeIntervalToTime(
		time1: number,
		time2: number,
		mode: number = 1
	): string {
		if (time1 <= 1e10) time1 *= 1000;
		if (time2 <= 1e10) time2 *= 1000;
		let t = Math.abs(time1 - time2);
		let h = Math.floor(t / 3600000);
		t %= 3600000;
		let m = Math.floor(t / 60000);
		t %= 60000;
		let s = Math.floor(t / 1000);
		if (mode == 1) return h + "时" + m + "分" + s + "秒";
		else
			return (
				h +
				":" +
				(m < 10 ? "0" + m : m) +
				":" +
				(s < 10 ? "0" + s : s)
			);
	}

	//毫秒转时间 (时分秒)
	public static timestampToInterval(
		t: number,
		mode: number = 1
	): string {
		let h = Math.floor(t / 3600000);
		t %= 3600000;
		let m = Math.floor(t / 60000);
		t %= 60000;
		let s = Math.floor(t / 1000);
		if (mode == 1) return h + "时" + m + "分" + s + "秒";
		else
			return (
				h +
				":" +
				(m < 10 ? "0" + m : m) +
				":" +
				(s < 10 ? "0" + s : s)
			);
	}
}

//二十七进制数组字母转换工具集
export class TSBaseTools {
	//数字转大写字母表示
	//A B C D ... X Y Z AA AB AC ...
	public static numberToAlpha(n: number): string {
		if (n == 0) return "0";
		let alpha = "";
		let ascll = 65;
		while (n > 0) {
			ascll = (n - 1) % 26;
			n = Math.floor((n - 1) / 26);
			alpha = String.fromCharCode(ascll + 65) + alpha;
		}
		return alpha;
	}

	//大写字母转数字
	public static alphaToNumber(a: string): number {
		if (a == "A") return 0;
		let ascall = 65;
		let num = 0;
		a.split("").forEach((char) => {
			num *= 26;
			ascall = char.charCodeAt(0);
			num += ascall - 64;
		});
		return num;
	}
}

//状态信息常量管理器
export class StatusConstValManager {
	//根据提交状态获取背景配色
	public static getStatusColor(status: string): string {
		const constValStore = useConstValStore();
		switch (status) {
			case "AC":
				return constValStore.SUBMIT_STATUS_AC_COLOR;
			case "WA":
				return constValStore.SUBMIT_STATUS_WA_COLOR;
			case "TLE":
				return constValStore.SUBMIT_STATUS_TLE_COLOR;
			case "MLE":
				return constValStore.SUBMIT_STATUS_MLE_COLOR;
			case "RE":
				return constValStore.SUBMIT_STATUS_RE_COLOR;
			case "PE":
				return constValStore.SUBMIT_STATUS_PE_COLOR;
			case "OLE":
				return constValStore.SUBMIT_STATUS_OLE_COLOR;
			case "CE":
				return constValStore.SUBMIT_STATUS_CE_COLOR;
			case "JUDGING":
				return constValStore.SUBMIT_STATUS_JUDGING_COLOR;
			case "REJUDGING":
				return constValStore.SUBMIT_STATUS_REJUDGING_COLOR;
			case "PENDING":
				return constValStore.SUBMIT_STATUS_PENDING_COLOR;
			case "FAILED":
				return constValStore.SUBMIT_STATUS_FAILED_COLOR;
			default:
				return "#ffffff";
		}
	}

	//获取提交语言
	public static getLangString(Lang: number): string {
		const constValStore = useConstValStore();
		if (Lang == constValStore.SUBMIT_LANG_C) return "C";
		if (Lang == constValStore.SUBMIT_LANG_CPP) return "CPP";
		if (Lang == constValStore.SUBMIT_LANG_CPP11) return "CPP11";
		if (Lang == constValStore.SUBMIT_LANG_CPP17) return "CPP17";
		if (Lang == constValStore.SUBMIT_LANG_JAVA) return "JAVA";
		if (Lang == constValStore.SUBMIT_LANG_PYTHON3) return "PYTHON3";
		return "UNKNOWN";
	}
}
