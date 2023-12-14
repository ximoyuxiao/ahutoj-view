<script lang="ts" setup>
import { getCurrentInstance, reactive, ref } from "vue";
import { useConstValStore } from "../../../pinia/constVal";
import MdEditor, { ToolbarNames } from "md-editor-v3";
import "md-editor-v3/lib/style.css";
import { ElMessageBox } from "element-plus";
import { ImageFileUploadUtils, ImageFileUtils } from "../../../utils/fileUtils";
import { staticSourceBaseURL } from "../../../utils/axios/axios";

const { proxy } = getCurrentInstance() as any;
const constValStore = useConstValStore();
const MdMaxVisible = ref(false);

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

//题目数据
var problem = reactive({
  PID: "",
  Title: "",
  Description: "",
  Input: "",
  Output: "",
  SampleInput: "",
  SampleOutput: "",
  LimitTime: 1000,
  LimitMemory: 128,
  Hit: "",
  Label: "",
  Origin: -1,
  OriginPID: "",
  ContentType: 1,
  Visible: 1,
  //题目描述 文本类型
  ContentTypes: [
    { label: "PlainText", value: constValStore.PROBLEM_CONTENTTYPE_NORMAL },
    {
      label: "MarkDown",
      value: constValStore.PROBLEM_CONTENTTYPE_MARKDOWN,
    },
  ],
  //选项列表
  Origins: [
    { label: "Local", value: constValStore.PROBLEM_ORIGIN_LOCAL },
    { label: "CodeForce", value: constValStore.PROBLEM_ORIGIN_CF },
    {
      label: "AtCoder",
      value: constValStore.PROBLEM_ORIGIN_ATCODER,
    },
    { label: "洛谷", value: constValStore.PROBLEM_ORIGIN_LUOGU },
  ],
  //placehodler提示
  OriginPlaceHolder: {
    [constValStore.PROBLEM_ORIGIN_CF]: "竞赛ID + 题目编号 如：1069A",
    [constValStore.PROBLEM_ORIGIN_ATCODER]:
      "竞赛ID + 题目编号 如：abc277_e",
  },
  //题目
  Visibles: [
    { label: "可见", value: constValStore.PROBLEM_VISIBLE },
    {
      label: "不可见",
      value: constValStore.PROBLEM_UNVISIBLE,
    },
  ],
  init() {
    problem.PID = "";
    problem.Title = "";
    problem.Description = "";
    problem.Input = "";
    problem.Output = "";
    problem.SampleInput = "";
    problem.SampleOutput = "";
    problem.LimitTime = 1000;
    problem.LimitMemory = 128;
    problem.Hit = "";
    problem.Label = "";
    problem.Origin = 0;
    problem.OriginPID = "";
    problem.ContentType = -1;
    problem.Visible = 1;
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

//上传文件
function uploadF(f: any) {
  ImageFileUtils.problemImageCompress(f).then((response: any) => {
    if (response.code == 0) {
      ImageFileUploadUtils.uploadProblemImage(response.data).then(
        (res: any) => {
          let data = res.data;
          if (data.code == 0) {
            let ImageURL = data.ImageURL;
            problem.Description += `\n![](${staticSourceBaseURL}${ImageURL})`;
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

//完成提交题目
function complete() {
  proxy
    .$post("api/problem/add/", {
      Title: problem.Title,
      Description: problem.Description,
      Input: problem.Input,
      Output: problem.Output,
      SampleInput: problem.SampleInput,
      SampleOutput: problem.SampleOutput,
      LimitTime: problem.LimitTime,
      LimitMemory: problem.LimitMemory,
      Hit: problem.Hit,
      Label: problem.Label,
      Origin: problem.Origin,
      OriginPID: problem.OriginPID,
      ContentType: problem.ContentType,
      Visible: problem.Visible,
    })
    .then((res: any) => {
      let data = res.data;
      if (data.code == 0) {
        proxy.elMessage({ message: "添加成功!", type: "success" });
        let PID = data.PID;
        if (problem.Origin == -1) {
          proxy.$router.push({
            path: "/Admin/ProblemEdit/EditProblemJudgeFile",
            query: {
              PID,
            }
          })
        }
        return;
      }
      proxy.codeProcessor(
        data?.code ?? 100001,
        data?.msg ?? "服务器错误\\\\error"
      );
    });
}
</script>


<template>
  <el-drawer
    v-model="MdMaxVisible"
    :title=problem.Title
    fullsreen="true"
    size="100%"
    direction="btt"
  >
    <md-editor
      v-model="problem.Description"
      :toolbars="markdown.toolbar"
      :on-upload-img="problem.updateImg"
      style="height: calc(100vh - 120px);"
    />
  </el-drawer>
  <el-container>
    <el-header class="Container">
      <el-row>
        <span>标题</span>
        <el-input
          v-model="problem.Title"
          class="problemTitle Left"
        />
      </el-row>
      <el-row class="Top">
        <span>时间限制/ms</span>
        <el-input-number
          v-model="problem.LimitTime"
          :min="200"
          :max="10000"
          :step="200"
          controls-position="right"
          class="Left"
        />
        <span style="margin-left: 50px;">内存限制/MiB</span>
        <el-input-number
          v-model="problem.LimitMemory"
          :min="64"
          :max="1024"
          :step="64"
          controls-position="right"
          class="Left"
        />
      </el-row>
      <el-row class="Top">
        <span>标签</span>
        <el-input
          v-model="problem.Label"
          placeholder="每个标签用英文的 ; 隔开"
          class="tagList Left"
        />
      </el-row>
      <el-row class="Top">
        <span>来源</span>
        <el-select
          v-model="problem.Origin"
          class="m-2 Left"
          placeholder="Select"
        >
          <el-option
            v-for="(item, index) in problem.Origins"
            :key="item.label"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-input
          v-show="problem.Origin != -1"
          v-model="problem.OriginPID"
          :placeholder="problem.OriginPlaceHolder[problem.Origin]"
          class="originInfo"
        />
      </el-row>
      <el-row class="Top">
        <span>可见</span>
        <el-select
          v-model="problem.Visible"
          class="m-2 Left"
          placeholder="Select"
        >
          <el-option
            v-for="(item, index) in problem.Visibles"
            :key="item.label"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-row>
    </el-header>
    <el-main class="Container">
      <el-row>
        <span>文本类型</span>
        <el-select
          v-model="problem.ContentType"
          class="m-2 Left"
          placeholder="Select"
        >
          <el-option
            v-for="(item, index) in problem.ContentTypes"
            :key="item.label"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-button
          class="Left"
          type="primary"
          @click="MdMaxVisible = true"
          v-if="problem.ContentType == 1"
        >
          <el-icon size="19px">
            <FullScreen />
          </el-icon>
          &nbsp全屏编辑
        </el-button>
      </el-row>
      <div v-if="problem.ContentType == 1">
        <div class="markdown Top">
          <md-editor
            v-model="problem.Description"
            :toolbars="markdown.toolbar"
            :on-upload-img="problem.updateImg"
            preview-only
            style="max-height: 600px;"
          />
        </div>
      </div>
      <div v-else>
        <div class="normal">
          <el-row class="Top">
            <span>题目描述</span>
            <el-input
              v-model="problem.Description"
              type="textarea"
              autosize
              class="plainText Left"
          />
        </el-row>
        <el-row class="Top">
          <span>输入描述</span>
          <el-input
            v-model="problem.Input"
            type="textarea"
            autosize
            class="plainText Left"
          />
        </el-row>
        <el-row class="Top">
          <span>输出描述</span>
          <el-input
            v-model="problem.Output"
            type="textarea"
            autosize
            class="plainText Left"
          />
        </el-row>
        <el-row class="Top">
          <span>输入样例</span>
          <el-input
            v-model="problem.SampleInput"
            type="textarea"
            autosize
            class="plainText Left"
          />
        </el-row>
        <el-row class="Top">
          <span>输出样例</span>
          <el-input
            v-model="problem.SampleOutput"
            type="textarea"
            autosize
            class="plainText Left"
          />
        </el-row>
        <el-row class="Top">
          <span>提示</span>
          <el-input
            v-model="problem.Hit"
            type="textarea"
            autosize
            class="plainText"
            style="margin-left: 50px;"
          />
        </el-row>
      </div>
    </div>
  </el-main>
</el-container>
<div class="addProblem">
  <el-button
    class="addProblemButton Top"
    type="primary"
    round
    v-on:click="complete()"
  >
    添 加
  </el-button>
</div></template>


<style scoped lang="scss">

.problemTitle {
  width: 600px;
}

.tagList {
  width: 600px;
}

.m-2 {
  width: 160px;
}

.originInfo {
  width: 440px;
}

span {
  align-self: center;
  display: flex;
  font-size: $fontSize5;
}

.addProblemButton {
  align-self: center;
  width: 100%;
  height: 50px;
  border-radius: 12px;
  font-size: $fontSize6;
}

.plainText {
  width: 600px;
  display: flex;
}</style>