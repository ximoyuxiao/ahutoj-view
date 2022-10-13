import ace from "ace-builds";
import "ace-builds/src-noconflict/mode-c_cpp.js";
import "ace-builds/src-noconflict/mode-csharp.js";
import "ace-builds/src-noconflict/mode-golang.js";
import "ace-builds/src-noconflict/mode-java.js";
import "ace-builds/src-noconflict/mode-javascript.js";
import "ace-builds/src-noconflict/mode-php.js";
import "ace-builds/src-noconflict/mode-python.js";
import "ace-builds/src-noconflict/mode-ruby.js";
import "ace-builds/src-noconflict/mode-rust.js";

import "ace-builds/src-noconflict/theme-eclipse.js";
import "ace-builds/src-noconflict/theme-one_dark.js";

export default function getAceBuilds({ node }: { node: any }) {
	let aceEditor = ace.edit(node, {
		value: "", //保存内容
		maxLines: 30, // 最大行数
		minLines: 15, // 最小行数
		fontSize: 16, //  字体大小
		tabSize: 4, // 制表符设置为 4 个空格大小
	});
	aceEditor.session.setOption("useWorker", false);
	//默认主题和语言
	aceEditor.setTheme("ace/theme/eclipse");
	aceEditor.session.setMode("ace/mode/javascript");
	return aceEditor;
}
