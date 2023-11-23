<template>
  <div class="addlist">
    <div><span>公告标题</span>
      <el-input v-model="notice.Title"></el-input>
    </div>
    <div style="height: auto;">
      <span>公告内容</span>
    </div>
    <div class="markdown">
      <md-editor
        v-model="notice.Content"
        :toolbars="markdown.toolbar"
        :on-upload-img="notice.updateImg"
      />
    </div>
  </div>
  <el-button
    class="addNoticeButton"
    type="primary"
    v-on:click="AddNotice()"
  >
    添 加
  </el-button>
</template>
  
<script lang="ts" setup>
import { getCurrentInstance, reactive } from "vue";
import { ElMessageBox } from "element-plus";
import MdEditor, { ToolbarNames } from "md-editor-v3";
import { ImageFileUploadUtils, ImageFileUtils } from "../../../utils/fileUtils";
import { staticSourceBaseURL } from "../../../utils/axios/axios";
const { proxy } = getCurrentInstance() as any;
var markdown: {
  toolbar: ToolbarNames[];
} = {
  toolbar: [
    "bold",
    "underline",
    "italic",
    "-",
    "strikeThrough",
    "title",
    "sub",
    "sup",
    "quote",
    "unorderedList",
    "orderedList",
    "-",
    "codeRow",
    "code",
    "link",
    "image",
    "table",
    "mermaid",
    "katex",
    "-",
    "revoke",
    "next",
    "save",
    "=",
    "preview",
    "htmlPreview",
    "catalog",
  ],
};
type NoticeType = {
  Title: string;
  Content: string;
  [item: string]: any;
};

var notice = reactive<NoticeType>({
  Title: "",
  Content: "",
  init() {
    notice.Title = "";
    notice.Content = "";
  },
  updateImg: (files) => {
    if (files.length == 0) {
      proxy.elMessage({
        message: "上传内容为空！",
        type: "warning",
      });
      return;
    }
    ElMessageBox.confirm("确定上传吗？", "注意", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    }).then(() => {
      files.forEach((f: any) => {
        uploadF(f);
      });
    });
  },
});
function AddNotice() {
  proxy.$axios.post("/api/notice/", {
    title: notice.Title,
    content: notice.Content
  }).then((res: any) => {
    let data = res.data;
    if (data.code == 0) {
      proxy.elMessage({
        message: "添加公告成功",
        type: "success",
      });
    }
    proxy.codeProcessor(
      data?.code ?? 100001,
      data?.msg ?? "服务器错误\\\\error"
    );
  })
}
function uploadF(f: any) {
  ImageFileUtils.problemImageCompress(f).then((response: any) => {
    if (response.code == 0) {
      ImageFileUploadUtils.uploadProblemImage(response.data).then(
        (res: any) => {
          let data = res.data;
          if (data.code == 0) {
            let ImageURL = data.ImageURL;
            notice.Content += `\n![](${staticSourceBaseURL}${ImageURL})`;
            proxy.elMessage({
              message: `
              <strong>${f.name}上传成功</strong><br/>
              <span>已压缩:${(f.size / 1024).toFixed(2)}KB->${(
                  response.data.size / 1024
                ).toFixed(2)}KB</span>
            `,
              type: "success",
              duration: 5000,
              dangerouslyUseHTMLString: true,
            });
          }
          proxy.codeProcessor(
            data?.code ?? 100001,
            data?.msg ?? "服务器错误\\\\error"
          );
        }
      );
    }
  });
}
</script>

<style scoped lang="scss">
.addNoticeButton {
  align-self: center;
  width: 600px;
  height: 50px;
  margin: 20px 0;
  border-radius: 25px;
  font-size: $fontSize6;
}

.addlist {
  width: 100%;
}

.addlist>div {
  display: flex;
  align-content: center;
  box-sizing: border-box;
  margin: 5px 0;
}

.addlist>div>span {
  font-size: 22px;
  width: 150px;
  @include font_color("font1");
}

.count {
  width: 20%;
  display: inline-flex;
  font-size: 15px;
  // align-content: center;
  text-align: center;
}</style>