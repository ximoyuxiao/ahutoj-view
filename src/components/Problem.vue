<template>
  <div class="problem">
    <div
      class="content"
      v-show="!notFound"
    >
      <div
        class="left"
        ref="left"
      >
        <div class="title">{{ problem.Title }}</div>

        <div class="description">
          <div class="label">描述</div>
          <div
            class="markdown"
            v-if="problem.ContentType == 1"
          >
            <span>MarkDown</span>
            <v-md-preview :text="problem.Description" />
          </div>
          <pre
            class="text"
            v-else
          >{{ problem.Description }}</pre>
        </div>
        <div class="input">
          <div class="label">输入</div>
          <pre class="text">{{ problem.Input }}</pre>
        </div>
        <div class="output">
          <div class="label">输出</div>
          <pre class="text">{{ problem.Output }}</pre>
        </div>
        <div class="sampleInput">
          <div class="label">输入样例</div>
          <el-popover
            placement="top-start"
            content="复制成功"
            :width="50"
            trigger="focus"
          >
            <template #reference>
              <textarea
                class="textarea"
                v-model="problem.SampleInput"
                :rows="problem.SampleInputRows"
                :readonly="true"
                @click="copyText($event, 1)"
              />
            </template>
          </el-popover>
        </div>
        <div class="sampleOutput">
          <div class="label">输出样例</div>
          <el-popover
            placement="top-start"
            content="复制成功"
            :width="50"
            trigger="focus"
          >
            <template #reference>
              <textarea
                class="textarea"
                v-model="problem.SampleOutput"
                :rows="problem.SampleOutputRows"
                :readonly="true"
                @click="copyText($event, 2)"
              />
            </template>
          </el-popover>
        </div>
        <div
          class="hit"
          v-if="problem.Hit.length > 0"
        >
          <div class="label">提示</div>
          <pre class="text">{{ problem.Hit }}</pre>
        </div>
        <div class="ace">
          <div>
            <el-select
              style="margin: 15px 5px"
              v-model="aceConfig.modeNow"
              class="m-2"
              placeholder="Select"
              @change="changeMode(aceConfig.modeNow)"
            >
              <el-option
                v-for="item in aceConfig.modeSelect"
                :key="item.name"
                :label="item.name"
                :value="item.name"
                :disabled="item.disabled"
              />
            </el-select>
            <el-button
              plain
              v-on:click="aceConfig.save()"
            >暂存</el-button>
          </div>
          <div id="aceEditor" />
        </div>
      </div>
      <div class="right">
        <div
          class="contestInfo"
          v-if="contest.isContestProblem"
          ref="contestInfo"
        >
          <div style="color: var(--font_color1); font-size: var(--fontSize12)">
            {{ contest.info.Title }}
          </div>
          <div class="problemBox">
            <div
              :class="
            'cursor_pointer ' + (item.PID == problem.PID ? 'nowProblem' : '')
          "
              v-for="(item, index) in contest.info.Data"
              :key="index"
              v-on:click="goToProblem(item.PID)"
            >
              {{ proxy.Utils.TSBaseTools.numberToAlpha(index + 1) }}
            </div>
          </div>
        </div>
        <div
          class="demand"
          ref="demand"
        >
          <div>时间限制: {{ problem.LimitTime }} ms</div>
          <div>内存限制: {{ problem.LimitMemory }} MB</div>
          <div style="color: var(--font_color41)">通过数:</div>
        </div>
        <div
          class="tags"
          v-if="problem.Label.length != 0"
        >
          <el-tag
            v-for="tag in problem.Label.split(';')"
            :key="tag"
            :effect="themeSwitchStore.theme == 1 ? 'light' : 'dark'"
          >
            {{ tag }}
          </el-tag>
        </div>
        <div class="function">
          <span style="
            height: 40px;
            line-height: 40px;
            font-size: var(--fontSize6);
            color: var(--font_color1);
          ">
            当前模式：{{ aceConfig.modeNow }}
          </span>
          <div
            class="submit cursor_pointer cursor_noFocus"
            @mousedown="submit.submitTouchStart"
            @mouseup="submit.submitTouchEnd"
            @mouseleave="submit.submitTouchEnd"
          >
            <el-icon size="26px">
              <Check />
            </el-icon>
            &nbsp;提交
            <div
              ref="submitCover"
              style="
              background-color: rgba(130, 220, 250, 0.65);
              height: 100%;
              position: absolute;
              box-shadow: -2px 0 1px 2px rgba(130, 220, 250, 0.8);
              top: 0;
              left: 0;
            "
            />
          </div>
          <div class="solutions cursor_pointer">
            <el-icon size="26px">
              <Document />
            </el-icon>
            &nbsp;题解
          </div>
        </div>
      </div>
    </div>
    <div
      class="notFound"
      v-show="notFound"
    >
      <el-empty description="肥肠抱歉，木有找到该题，返回重试吧。" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, getCurrentInstance, reactive, nextTick, ref } from "vue";
import { useConfigStore } from "../pinia/config";
import { useConstValStore } from "../pinia/constVal";
import { useThemeSwitchStore } from "../pinia/themeSwitch";
import { useUserDataStore } from "../pinia/userData";
import getAceBuilds from "../utils/aceBuildsFactory";
const { proxy } = getCurrentInstance() as any;
const themeSwitchStore = useThemeSwitchStore();
const configStore = useConfigStore();
const constValStore = useConstValStore();
const userDataStore = useUserDataStore();

var notFound = ref(false);

//页面加载效果维护
var loading = reactive({
  content: null,
  performanceInfo: null,
  contestProblemBox: null,
  init() {
    if (this.content) {
      this.content.close();
    }
    if (this.performanceInfo) {
      this.performanceInfo.close();
    }
    if (this.contestProblemBox) {
      this.contestProblemBox.close();
    }
    this.content = null;
    this.performanceInfo = null;
    this.contestProblemBox = null;
  },
});

//页面数据
type contestType = {
  CID: number;
  Pass: string;
  isContestProblem: boolean; //是否是竞赛题目
  info: {
    Data: { PID: number; Title: string; ACNum: number; SubmitNum: number }[];
    BeginTime: number;
    CID: number;
    Type: number;
    Description: string;
    EndTime: number;
    IsPublic: number;
    Pass: string;
    Size: number;
    Title: string;
    UID: string;
  };
  [item: string]: any;
};
var contest = reactive<contestType>({
  CID: null,
  Pass: null,
  isContestProblem: false, //是否是竞赛题目
  info: {
    Data: [],
    BeginTime: 0,
    CID: 0,
    Type: 1,
    Description: "",
    EndTime: 0,
    IsPublic: 1,
    Pass: "",
    Size: 0,
    Title: "",
    UID: "",
  },
  copy(data: {
    Problems: string;
    Data: { PID: number; Title: string; ACNum: number; SubmitNum: number }[];
    UID: string;
    Title: string;
    CID: number;
    Type: number;
    Description: string;
    BeginTime: number;
    EndTime: number;
    IsPublic: number;
    Pass: string;
    Size: number;
  }): void {
    let tempProblemSequence = data.Problems.split(",");
    for (let temp in tempProblemSequence) {
      for (let p in data.Data) {
        if (tempProblemSequence[temp] === data.Data[p].PID + "") {
          let item = {
            PID: data.Data[p].PID,
            Title: data.Data[p].Title,
            ACNum: data.Data[p].ACNum,
            SubmitNum: data.Data[p].SubmitNum,
          };
          contest.info.Data.push(item);
          break;
        }
      }
    }
    contest.info.BeginTime = data.BeginTime;
    contest.info.CID = data.CID;
    contest.info.Type = data.Type;
    contest.info.Description = data.Description;
    contest.info.EndTime = data.EndTime;
    contest.info.IsPublic = data.IsPublic;
    contest.info.Pass = data.Pass;
    contest.info.Size = data.Size;
    contest.info.Title = data.Title;
    contest.info.UID = data.UID;
  },
});

type problemType = {
  PID?: number;
  Description: string;
  Hit: string;
  Input: string;
  LimitMemory: number;
  LimitTime: number;
  Output: string;
  SampleInput: string;
  SampleInputRows: number;
  SampleOutput: string;
  SampleOutputRows: number;
  Title: string;
  Label: string;
  Origin: number;
  OriginPID: string;
  ContentType: number;
  [item: string]: any;
};
var problem = reactive<problemType>({
  PID: null,
  Description: "",
  Hit: "",
  Input: "",
  LimitMemory: 0,
  LimitTime: 0,
  Output: "",
  SampleInput: "",
  SampleInputRows: 5,
  SampleOutput: "",
  SampleOutputRows: 5,
  Title: "",
  Label: "",
  Origin: 0,
  OriginPID: "",
  ContentType: -1,
  copy(data: problemType) {
    // this.Pid = data.Pid;
    console.log(data);
    problem.Description = data.Description;
    problem.Hit = data.Hit;
    problem.Input = data.Input;
    problem.LimitMemory = data.LimitMemory;
    problem.LimitTime = data.LimitTime;
    problem.Output = data.Output;
    problem.SampleInput = data.SampleInput;
    problem.SampleOutput = data.SampleOutput;
    problem.Title = data.Title;
    problem.Label = data.Label;
    this.ContentType = data.ContentType;
    //题目来源不显示
    // this.Origin = data.Origin;
    // this.OriginPID = data.OriginPID;
  },
});

var ace = reactive({
  aceEditor: null,
});

var aceConfig = reactive({
  modeNow: "C",
  lang: 1,
  modeSelect: [
    { name: "C", disabled: false },
    { name: "CPP", disabled: false },
    { name: "CPP11", disabled: false },
    { name: "CPP17", disabled: false },
    { name: "JAVA", disabled: false },
    { name: "PYTHON3", disabled: false },
    { name: "JavaScript", disabled: true },
    { name: "C#", disabled: true },
    { name: "Ruby", disabled: true },
    { name: "Rust", disabled: true },
  ],
  themeNow: "eclipse",
  theme: ["eclipse", "one_dark"],
  //暂存
  save() {
    let text = ace.aceEditor.getValue();
    if (text == "") {
      proxy.elMessage({
        message: "你的编辑器没有输入任何内容！",
        type: "warning",
      });
      return;
    }
    //判断是否是竞赛题目，与普通题目分别存储
    if (!proxy.$route.query.CID) {
      proxy.Buffer.Problem.problemCode(problem.PID, text);
    } else {
      proxy.Buffer.Problem.contestProblemCode(problem.PID, text);
    }
    proxy.elNotification({
      message: "暂存成功，关闭浏览器后失效",
      type: "success",
      offset: 100,
    });
  },
});

//获取题目信息
async function getProblemInfo() {
  loading.init();
  loading.content = proxy.elLoading({ node: proxy.$refs.left });
  loading.performanceInfo = proxy.elLoading({
    node: proxy.$refs.demand,
  });

  //检查题目url:id是否存在
  if (!proxy.$route.query.PID) {
    loading.init();
    return;
  }
  problem.PID = proxy.$route.query.PID;

  //检查从竞赛跳转过来的题目是否存在cid 以及 pass
  if (proxy.$route.query.CID) contest.CID = proxy.$route.query.CID;
  if (proxy.$route.query.Pass) contest.Pass = proxy.$route.query.Pass;

  //cid存在说明是从竞赛跳转来的题目,检查合理性
  if (contest.CID != null) {
    //说明不合理
    if ((await checkContest()) != 0) {
      loading.init();
      return;
    }
  }

  //获取题目
  await proxy.$get("api/problem/" + problem.PID).then((res) => {
    let data = res.data;
    if (data.code == 0) {
      // proxy.$log(data);
      problem.copy(data);
      let inputLength =
        problem.SampleInput.split("\n").length < 12
          ? problem.SampleInput.split("\n").length
          : 12;
      let outputLength =
        problem.SampleOutput.split("\n").length < 12
          ? problem.SampleOutput.split("\n").length
          : 12;
      problem.SampleInputRows = inputLength;
      problem.SampleOutputRows = outputLength;
      notFound.value = false;
    }
    proxy.codeProcessor(data.code);
  });

  loading.init();
}

//检查竞赛跳转是否合理
async function checkContest() {
  let ret = -1;
  await proxy
    .$get("api/contest/" + contest.CID + "?Pass=" + contest.Pass)
    .then((res) => {
      let data = res.data;
      if (data.code == 0) {
        ret = 0;
        // proxy.$log(data);

        //判断题目在不在该竞赛中
        let flag = false;
        let tempProblemSequence = data.Problems.split(",");
        for (let i in tempProblemSequence) {
          if (tempProblemSequence[i] == problem.PID) {
            flag = true;
            break;
          }
        }
        if (!flag) {
          ret = -1;
          proxy.elMessage({
            message: "该题不在竞赛中！",
            type: "warning",
          });
        }
        contest.copy(data);
        contest.isContestProblem = true;
      } else {
        if (contest.Pass != null) {
          proxy.elMessage({
            message: "竞赛不存在或者密码错误！",
            type: "warning",
          });
        } else {
          proxy.codeProcessor(data.code);
        }
      }
    });

  return ret;
}

//竞赛模式跳转题目
function goToProblem(PID: number) {
  let Pass = null;
  if (proxy.$route.query.Pass) Pass = proxy.$route.query.Pass;

  proxy.$router.replace({
    path: "/Problem",
    query: {
      PID,
      CID: contest.CID,
      Pass,
    },
  });

  loading.contestProblemBox = proxy.elLoading({
    node: proxy.$refs.contestInfo,
  });

  setTimeout(() => {
    loading.init();
    configStore.reloadNow();
  }, 500);
}

//改变语言模式
function changeMode(val: string) {
  aceConfig.modeNow = val;
  switch (val) {
    case "C":
      ace.aceEditor.session.setMode("ace/mode/c_cpp");
      aceConfig.lang = constValStore.SUBMIT_LANG_C;
      break;
    case "CPP":
      ace.aceEditor.session.setMode("ace/mode/c_cpp");
      aceConfig.lang = constValStore.SUBMIT_LANG_CPP;
      break;
    case "CPP11":
      ace.aceEditor.session.setMode("ace/mode/c_cpp");
      aceConfig.lang = constValStore.SUBMIT_LANG_CPP11;
      break;
    case "CPP17":
      ace.aceEditor.session.setMode("ace/mode/c_cpp");
      aceConfig.lang = constValStore.SUBMIT_LANG_CPP17;
      break;
    case "JAVA":
      ace.aceEditor.session.setMode("ace/mode/java");
      aceConfig.lang = constValStore.SUBMIT_LANG_JAVA;
      break;
    case "PYTHON3":
      ace.aceEditor.session.setMode("ace/mode/python");
      aceConfig.lang = constValStore.SUBMIT_LANG_PYTHON3;
      break;
    default:
      ace.aceEditor.session.setMode("ace/mode/c_cpp");
      aceConfig.lang = constValStore.SUBMIT_LANG_C;
      break;
  }
  //保存语言选择结果
  proxy.Buffer.Config.submitLang(val);
}

themeSwitchStore.$subscribe((args, state) => {
  if (state.theme == 1) {
    ace.aceEditor.setTheme("ace/theme/eclipse");
  } else {
    ace.aceEditor.setTheme("ace/theme/one_dark");
  }
});

//复制到剪切板
function copyText(e: any, i: number): void {
  if (i == 1) {
    navigator.clipboard.writeText(problem.sample_input).then(() => {});
  } else {
    navigator.clipboard.writeText(problem.sample_output).then(() => {});
  }
}

type submitType = {
  time: any;
  isInLongTouch: boolean;
  process: number;
  [item: string]: any;
};
var submit = reactive<submitType>({
  time: null, //定时器任务
  isInLongTouch: false,
  process: 0, //进度条进度
  middleware() {
    if (!this.isInLongTouch) {
      this.submitTouchEnd();
      return;
    } else {
      clearTimeout(this.time);
      //进度条结束
      if (this.process >= 100) {
        this.submitTouchEnd();
        this.submit();
      }
      this.time = setTimeout(() => {
        this.process += 3;
        proxy.$refs.submitCover.style.width = this.process + "%";
        this.middleware();
      }, 15);
    }
  },
  submitTouchStart() {
    this.isInLongTouch = true;
    this.process = 0;
    //设置点击事件计时器
    this.time = setTimeout(() => {
      this.middleware();
    }, 15);
  },
  submitTouchEnd() {
    proxy.$refs.submitCover.style.width = 0 + "%";
    this.isInLongTouch = false;
    clearTimeout(this.time);
    this.process = 0;
  },
  submit() {
    if (!userDataStore.isLogin) {
      proxy.elMessage({ message: "请先登录!", type: "warning" });
      return;
    }
    let UID = userDataStore.UID;
    if (UID == "") {
      proxy.elMessage({
        message: "你的登录状态不正常!请刷新或重启浏览器",
        type: "error",
      });
      return;
    }
    if (ace.aceEditor.getValue() == "") {
      proxy.elMessage({
        message: "你的编辑器没有输入任何内容！",
        type: "warning",
      });
      return;
    }
    proxy
      .$post("api/submit/commit/", {
        PID: Number(problem.PID),
        UID: UID,
        CID: contest.CID ? Number(contest.CID) : -1,
        Source: ace.aceEditor.getValue(),
        Lang: aceConfig.lang,
      })
      .then((res: any) => {
        let data = res.data;
        proxy.$log(res);
        if (data.code == 0) {
          proxy.$router.push({
            path: "/Code",
            query: {
              SID: data.SID,
            },
          });
          proxy.elNotification({
            message: "提交成功",
            type: "success",
          });
        }
        proxy.codeProcessor(data.code);
      });
  },
});

onMounted(() => {
  nextTick(() => {
    //获取题目
    getProblemInfo();
    //初始化代码编辑器
    let aceEditor = document.getElementById("aceEditor");
    ace.aceEditor = getAceBuilds({ node: aceEditor });
    if (themeSwitchStore.theme != 1)
      ace.aceEditor.setTheme("ace/theme/one_dark");
    //获取缓存的题目数据
    if (!proxy.$route.query.CID && proxy.$route.query.PID) {
      let text = sessionStorage.getItem("pid" + proxy.$route.query.PID);
      if (text != null) ace.aceEditor.setValue(text);
    }
    //如果是竞赛跳转
    else if (proxy.$route.query.CID && proxy.$route.query.PID) {
      let text = sessionStorage.getItem("cpid" + proxy.$route.query.PID);
      if (text != null) ace.aceEditor.setValue(text);
    }
    //设置语言
    let Lang = localStorage.getItem("submitLang");
    if (Lang) {
      changeMode(Lang);
    }
  });
});
</script>

<style scoped lang="scss">
* {
  touch-action: none;
}

.problem {
  position: relative;
  width: 100%;
  box-sizing: border-box;
  padding: $page_outerPaddingTop $page_outerPaddingLeft;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .content {
    width: 100%;

    .left {
      margin-bottom: $modelDistanceLarge;
      position: relative;
      display: flex;
      flex-direction: column;
      width: calc(100% - $problem_rightWidth - $modelDistance);
      @include fill_color("fill2");
      border-radius: 15px;

      .title {
        font-size: $fontSize12;
        @include font_color("font1");
        text-align: center;
        padding: $modelDistance 0;
      }

      .label {
        box-sizing: border-box;
        padding: $modelDistance 0 $modelDistanceMini 20px;
        font-size: $fontSize7;
        @include font_color("font1");
      }

      .markdown {
        @include fill_color("fill5");

        > span {
          display: inline-block;
          width: 100%;
          text-align: right;
          box-sizing: border-box;
          padding: 5px;
          @include font_color("font3");
          font-size: $fontSize4;
        }
      }

      .text {
        box-sizing: border-box;
        padding: 0 30px;
        font-size: $fontSize6;
        @include font_color("font2");
      }

      .textarea {
        width: calc(100% - 60px);
        box-sizing: border-box;
        margin: 0 30px;
        padding: 15px;
        line-height: $fontSize6;
        font-size: $fontSize6;
        @include font_color("font1");
        @include fill_color("fill3");
        resize: none;
        border-radius: 12px;
        overflow: visible;
      }

      > .ace {
        margin-top: $modelDistanceLarge;
        font-size: $fontSize6;
        height: auto !important;
        overflow: hidden;
        border-radius: 8px;
        outline: 2px solid;
        @include outline_color("border2");
        box-sizing: border-box;
        scrollbar-base-color: #fefefe;
      }
    }

    .right {
      position: fixed;
      display: flex;
      flex-direction: column;
      width: $problem_rightWidth;
      top: calc($page_outerPaddingTop + 60px);
      right: $page_outerPaddingLeft;
      height: 200px;

      .demand,
      .function,
      .contestInfo {
        margin-bottom: $modelDistance;
        padding: 10px 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        @include fill_color("fill2");
        border-radius: 15px;
      }

      .contestInfo .problemBox {
        padding: 15px;
        box-sizing: border-box;
        width: 100%;
        display: grid;
        grid-template-columns: 20% 20% 20% 20% 20%;
        grid-template-rows: 40px;

        > div {
          width: 100%;
          text-align: center;
          line-height: 40px;
          @include font_color("font1");
          font-size: $fontSize5;
          border-radius: 10px;

          &:hover {
            @include font_color("fill12");
            @include fill_color("fill16");
          }
        }

        .nowProblem {
          box-sizing: border-box;
          @include border(2px, dotted, "fill11");
          @include fill_color("fill15");
        }
      }

      .demand > div {
        margin: 4px 0;
        font-size: $fontSize5;
        @include font_color("font1");
        letter-spacing: 1px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .tags > span {
        margin: 0 1px;
      }

      .tags {
        margin-bottom: $modelDistance;
        @include fill_color("fill2");
        border-radius: 15px;
        padding: 10px 15px;
      }
      .function {
        @include font_color("font1");

        > div {
          position: relative;
          overflow: hidden;
          margin: 8px 0;
          width: 220px;
          height: 40px;
          border-radius: 15px;
          font-size: $fontSize8;
          letter-spacing: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          @include box_shadow(0, 0, 2px, 1px, "border2");
          transition-duration: 200ms;

          &:hover {
            @include box_shadow(0, 0, 2px, 1px, "fill12");
            @include fill_color("fill16");
          }
        }
      }
    }
  }
}
.notFound {
  width: 100%;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>