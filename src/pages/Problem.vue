<template>
  <el-container>
    <el-asider class="asider">
      <container>
        <el-header class="left" v-if="contest.isContestProblem">
          <div class="unit leftUnit unit1">
            <el-row class="artFont contestHeader bold">
              <div class="cursor_pointer" @click="backToContest">
                <el-icon size="22px">
                  <Back />
                </el-icon>
              </div>
              &nbsp;#{{ contest.CID }}
              <div class="title" ref="contestInfo">
                <div>
                  &nbsp;{{ contest.info.Title }}
                </div>
              </div>
            </el-row>
            <div class="problemBox" ref="contestInfo">
              <div :class="'cursor_pointer ' + (item.PID == problem.PID ? 'nowProblem' : '')
                " v-for="(item, index) in contest.info.Data" :key="index" v-on:click="goToProblem(item.PID)">
                {{ proxy.Utils.TSBaseTools.numberToAlpha(index + 1) }}
              </div>
            </div>
          </div>
        </el-header>
        <el-header v-else>
          <div class="unit leftUnit unit1">
            <el-row class="artFont contestHeader bold">
              <div class="cursor_pointer" @click="backToContest">
                <el-icon size="22px">
                  <Back />
                </el-icon>
              </div>
              &nbsp;#{{ contest.CID }}
              <div class="title" ref="contestInfo">
                <div>
                  &nbsp;{{ contest.info.Title }}
                </div>
              </div>
            </el-row>
            <div class="problemBox" ref="contestInfo">
              <div :class="'cursor_pointer ' + (item.PID == problem.PID ? 'nowProblem' : '')
                " v-for="(item, index) in contest.info.Data" :key="index" v-on:click="goToProblem(item.PID)">
                {{ proxy.Utils.TSBaseTools.numberToAlpha(index + 1) }}
              </div>
            </div>
          </div>     
        </el-header>
        <el-main class="">
          <div class="unit leftUnit unit2">
            <el-row class="bold artFont">
              <div class="PID">{{ problem.PID }}</div>
              <div class="title">&nbsp;{{ problem.Title }}</div>
            </el-row>
            <div ref="demand" class="artFont interval">
              <el-row class="demandComponent">
                时间限制: {{ problem.LimitTime }} ms
              </el-row>
              <el-row class="demandComponent">
                内存限制: {{ problem.LimitMemory }} MiB
              </el-row>
            </div>
            <el-collapse class="interval">
              <el-collapse-item title="Tag" name="1">
                <div class="tags" v-if="problem.Label.length != 0">
                  <el-tag v-for="tag in problem.Label.split(';')" :key="tag">
                    {{ tag }}
                  </el-tag>
                </div>
              </el-collapse-item>
            </el-collapse>
            <!-- <span class="modeNow">
              当前模式：{{ aceConfig.modeNow }}
            </span>
            <br /> -->
            <div class="function interval">
              <el-row v-if="admin" justify="center" class="interval">
                <el-button v-on:click="goToProblemAdmin()" class="adminButton">题目编辑</el-button>
                <el-button v-on:click="goToProblemTestDataAdmin()" class="adminButton">数据管理</el-button>
              </el-row>
              <el-row justify="center">
                <div class="solutions cursor_pointer" @click="goToSolution(problem.PID)">
                  <el-row>
                    <el-icon size="22px">
                      <DataAnalysis />
                    </el-icon>
                    &nbsp;&nbsp;题&nbsp;解
                  </el-row>
                </div>
              </el-row>
              <el-row justify="center">
                <div :class="submit.enabled ? 'submit cursor_pointer cursor_noFocus' : 'submitNotEnable cursor_pointer'"
                  @click="submit.submit()">
                  <template v-if="submit.enabled">
                    <el-row>
                      <el-icon size="22px">
                        <Check />
                      </el-icon>
                      &nbsp;&nbsp;提&nbsp;交
                    </el-row>
                  </template>
                  <template v-else> {{ (submit.process / 1000).toFixed(2) }}S</template>
                </div>
              </el-row>
            </div>
          </div>
        </el-main>
      </container>
    </el-asider>
    <el-container class="right">
      <el-main class="main">
        <div class="mainUnit unit">
          <template v-if="!needPass">
            <div class="" v-show="!notFound">
              <div ref="left">
                <template v-if="problem.ContentType == 1">
                  <div class="markdown">
                    <div class="copy cursor_pointer" @click="copyText($event, 0)">
                      <el-icon>
                        <CopyDocument />
                      </el-icon>
                      &nbsp;复制&nbsp;MarkDown
                    </div>
                    <md-editor class="mdEditor" v-model="problem.Description"
                      :theme="themeSwitchStore.theme > 0 ? 'light' : 'dark'" preview-only />
                  </div>
                </template>
                <template v-else>
                  <div class="normal">
                    <div class="description">
                      <div class="label">描述</div>
                      <pre class="text">{{ problem.Description }}</pre>
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
                      <el-popover placement="top-start" content="复制成功" :width="50" trigger="focus">
                        <template #reference>
                          <textarea class="textarea" v-model="problem.SampleInput" :rows="problem.SampleInputRows"
                            :readonly="true" @click="copyText($event, 1)" />
                        </template>
                      </el-popover>
                    </div>
                    <div class="sampleOutput">
                      <div class="label">输出样例</div>
                      <el-popover placement="top-start" content="复制成功" :width="50" trigger="focus">
                        <template #reference>
                          <textarea class="textarea" v-model="problem.SampleOutput" :rows="problem.SampleOutputRows"
                            :readonly="true" @click="copyText($event, 2)" />
                        </template>
                      </el-popover>
                    </div>
                    <div class="hit" v-if="problem.Hit.length > 0">
                      <div class="label">提示</div>
                      <pre class="text">{{ problem.Hit }}</pre>
                    </div>
                  </div>
                </template>
                <el-divider />
                <div class="ace">
                  <div>
                    <el-select style="margin: 15px 0" v-model="aceConfig.modeNow" class="m-2" placeholder="Select"
                      @change="changeMode(aceConfig.modeNow)">
                      <el-option v-for="item in aceConfig.modeSelect" :key="item.name" :label="item.name"
                        :value="item.name" :disabled="item.disabled" />
                    </el-select>
                    <el-button v-on:click="aceConfig.save()" type="primary" style="margin: 0px 0 0 10px"
                      :plain="themeSwitchStore.theme > 0 ? true : false">暂存</el-button>
                  </div>
                  <div id="aceEditor" />
                </div>
              </div>

            </div>
            <div class="notFound" v-show="notFound">
              <el-empty description="肥肠抱歉，木有找到该题，返回重试吧。" />
            </div>
          </template>
          <!-- 密码验证 -->
          <div v-show="needPass" class="needPass">
            <div class="title">验证</div>
            <div class="input">
              <div class="label">密码</div>
              <Input v-model="inputPass" @click="checkContest(contest.CID, inputPass)" type="text"></Input>
            </div>

            <div class="btn cursor_pointer" @click="checkContest(contest.CID, inputPass)">
              <el-icon>
                <Unlock />
              </el-icon>
              &nbsp;确定
            </div>
          </div>
        </div>
      </el-main>
      <el-footer class="footerEle">
        <el-row>
          Anhui University of Technology
        </el-row>
        <el-row>
          Online Judge &copy; 2019 - 2023
        </el-row>
      </el-footer>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import { onMounted, getCurrentInstance, reactive, nextTick, ref } from "vue";
import { useConfigStore } from "../pinia/config";
import { useConstValStore } from "../pinia/constVal";
import { useThemeSwitchStore } from "../pinia/themeSwitch";
import { useUserDataStore } from "../pinia/userData";
import getAceBuilds from "../utils/aceBuildsFactory";
import MdEditor from "md-editor-v3";
import "md-editor-v3/lib/style.css";
import { usePageBufferedDataStore } from "../pinia/pageBufferdData";
import Input from "../components/MyComponents/Input.vue";
const { proxy } = getCurrentInstance() as any;
const themeSwitchStore = useThemeSwitchStore();
const configStore = useConfigStore();
const constValStore = useConstValStore();
const userDataStore = useUserDataStore();
const pageBufferedDataStore = usePageBufferedDataStore();
var needPass = ref(false); //是否需要验证
var inputPass = ref(""); //检验密码
var notFound = ref(true); //未找到
var admin = ref(false);

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

//竞赛题目的竞赛数据
type contestType = {
  CID: number;
  Pass: string;
  isContestProblem: boolean; //是否是竞赛题目
  info: {
    Data: { PID: string; Title: string; ACNum: number; SubmitNum: number }[];
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
    Data: { PID: string; Title: string; ACNum: number; SubmitNum: number }[];
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

//题目数据
type problemType = {
  PID?: string;
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
    // console.log(data);
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
    // 题目来源不显示
    // this.Origin = data.Origin;
    // this.OriginPID = data.OriginPID;
  },
});

//ace编辑插件
var ace = reactive({
  aceEditor: null,
});

var aceConfig = reactive({
  modeNow: "CPP17",
  lang: 1,
  modeSelect: [
    { name: "C", disabled: true },
    { name: "CPP", disabled: false },
    { name: "CPP11", disabled: false },
    { name: "CPP17", disabled: false },
    { name: "JAVA", disabled: true },
    { name: "PYTHON3", disabled: false },
    // { name: "JavaScript", disabled: true },
    // { name: "C#", disabled: true },
    // { name: "Ruby", disabled: true },
    // { name: "Rust", disabled: true },
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
    if (!proxy.$route.params.CID) {
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

async function init() {
  loading.init();
  loading.content = proxy.elLoading({ node: proxy.$refs.left });
  loading.performanceInfo = proxy.elLoading({
    node: proxy.$refs.demand,
  });

  //检查从竞赛跳转过来的题目是否存在cid 以及 pass
  let CID = proxy.$route.params.CID;
  contest.CID = CID;
  if (CID) {
    contest.isContestProblem = true;
    let temp = pageBufferedDataStore.getContestRouterData(CID);
    let Pass = temp?.Pass;
    await checkContest(CID, Pass);
  } else {
    contest.isContestProblem = false;
    getProblemInfo();
  }
  admin.value = getProblemAdmin();
}
function getProblemAdmin(): boolean {
  if (!userDataStore.isLogin) {
    return false;
  }
  if ((userDataStore.PermissionMap & constValStore.ProblemAdminBit) != 0 || (userDataStore.PermissionMap & constValStore.SuperAdminBit) != 0)
    return true;
  return false;
}

//获取题目信息
async function getProblemInfo() {
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
    proxy.codeProcessor(
      data?.code ?? 100001,
      data?.msg ?? "服务器错误\\\\error"
    );
  });
  loading.init();
}

//检查竞赛跳转是否合理
async function checkContest(CID: number, Pass: string) {
  await proxy.$get("api/contest/" + CID, { Pass }).then((res) => {
    let data = res.data;
    if (data.code == 0) {
      //更新数据
      pageBufferedDataStore.setContestRouterData(CID, Pass ? -1 : 1, Pass);

      needPass.value = false;
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
        proxy.elMessage({
          message: "该题不在竞赛中！",
          type: "warning",
        });
        notFound.value = true;
        proxy.$router.push({
          path: "/Contests",
        });
      }
      contest.copy(data);
    } else if (data.code == 160504) {
      //密码错误
      needPass.value = true;
      inputPass.value = "";
    } else if (data.code == 160503) {
      //未开始
      proxy.$router.push({
        path: "/Contests",
      });
    }
    proxy.codeProcessor(
      data?.code ?? 100001,
      data?.msg ?? "服务器错误\\\\error"
    );
  });
  await getProblemInfo();
}

//返回比赛界面
function backToContest() {
  let params = { CID: null };
  if (proxy.$route.params.CID) {
    params.CID = proxy.$route.params.CID;
  } else {
    proxy.elMessage({
      message: "数据异常，请重新进入比赛界面",
      type: "warning",
    });
    return;
  }
  proxy.$router.push({
    name: "Contest",
    params,
  });
}

//竞赛模式跳转题目
function goToProblem(PID: string) {
  proxy.$router.replace({
    name: "ContestProblem",
    params: {
      PID,
      CID: contest.CID,
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

//跳转题解
function goToSolution(PID: string) {
  proxy.$router.push({
    path: "/Solution",
    query: {
      PID,
    },
  });
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
  if (state.theme > 0) {
    ace.aceEditor.setTheme("ace/theme/eclipse");
  } else {
    ace.aceEditor.setTheme("ace/theme/one_dark");
  }
});

//复制到剪切板
function copyText(e: any, i: number): void {
  switch (i) {
    case 0:
      navigator.clipboard.writeText(problem.Description).then(() => {
        proxy.elNotification({ message: "复制成功", type: "success" });
      });
      break;
    case 1:
      navigator.clipboard.writeText(problem.SampleInput).then(() => { });
      break;
    case 2:
      navigator.clipboard.writeText(problem.SampleOutput).then(() => { });
      break;
  }
}

//提交
var submit = reactive({
  timer: null, //定时器任务
  enabled: true,
  process: 0,
  middleWare: () => {
    clearTimeout(submit.timer);
    if (submit.process > 0) {
      setTimeout(() => {
        submit.process -= 25;
        submit.middleWare();
      }, 25);
    } else {
      submit.enabled = true;
    }
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
    //锁定
    submit.enabled = false;
    submit.process = 3000; //3s
    submit.middleWare();
    proxy
      .$post("api/submit/commit/", {
        PID: problem.PID,
        UID: UID,
        CID: contest.CID ? Number(contest.CID) : -1,
        Source: ace.aceEditor.getValue(),
        Lang: aceConfig.lang,
      })
      .then((res: any) => {
        let data = res.data;
        // proxy.$log(res);
        if (data.code == 0) {
          if (configStore.submitThenRedirectToCode) {
            proxy.$router.push({
              path: "/Code",
              query: {
                SID: data.SID,
                CID: contest.CID ? contest.CID : undefined,
              },
            });
          }
          proxy.elNotification({
            message: "提交成功",
            type: "success",
          });
        }
        proxy.codeProcessor(
          data?.code ?? 100001,
          data?.msg ?? "服务器错误\\\\error"
        );
      });
  },
});

function goToProblemAdmin(): void {
  let PID = problem.PID;
  proxy.$router.push({
    path: "/Admin/ProblemEdit/UpdateProblem",
    query: {
      PID,
    }
  })
}
function goToProblemTestDataAdmin(): void {
  let PID = problem.PID;
  proxy.$router.push({
    path: "/Admin/ProblemEdit/EditProblemJudgeFile",
    query: {
      PID,
    }
  })
}
onMounted(() => {
  window.scrollTo(0, 0);
  //检查题目url:id是否存在
  if (!proxy.$route.params.PID) {
    loading.init();
    proxy.elMessage({
      message: "地址栏参数错误，请正常进入题目界面！",
      type: "warning",
    });
    return;
  }
  problem.PID = proxy.$route.params.PID;
  nextTick(() => {
    //初始化代码编辑器
    let aceEditor = document.getElementById("aceEditor");
    ace.aceEditor = getAceBuilds({ node: aceEditor });
    if (themeSwitchStore.theme < 0)
      ace.aceEditor.setTheme("ace/theme/one_dark");
    //获取缓存的题目代码数据
    if (!proxy.$route.params.CID && proxy.$route.params.PID) {
      let text = sessionStorage.getItem("pid" + proxy.$route.params.PID);
      if (text != null) ace.aceEditor.setValue(text);
    }
    //如果是竞赛跳转
    else if (proxy.$route.params.CID && proxy.$route.params.PID) {
      let text = sessionStorage.getItem("cpid" + proxy.$route.params.PID);
      if (text != null) ace.aceEditor.setValue(text);
    }
    //设置语言
    let Lang = localStorage.getItem("submitLang");
    if (Lang) {
      changeMode(Lang);
    }
    init();
  });
});
</script>

<style scoped lang="scss">
* {
  touch-action: none;
}
.left {
  width: 230px;
}

.leftUnit {
  width: 100%;
}

.main {
  width: min(1200px, 100%);
}

.unit {
  background-color: #fff;
  border: 1px solid #ddd;
  padding: 16px;
  border-radius: 8px;
  // margin: -4px 0 0 0px;
  float: left;
}

.unit1 {
  width: 253px;
  margin-top: 18px;
  margin-left: -6px;
  // margin: 16px 0 0 -8px;
}

.unit2 {
  width: 253px;
  margin-top: -8px;
  margin-left: -6px;
  // margin: 12px 0 0 12px;
}

.mainUnit {
  margin: -2px 0 0 -20px;
}

.interval {
  margin-top: 16px;
}

.contestHeader {
  font-size: $fontSize6;
}

// position: fixed;
// display: flex;
// flex-direction: column;
// width: $problem_rightWidth;
// top: calc($page_outerPaddingTop + 60px);
// right: $page_outerPaddingLeft;

.problemBox {
  padding: 10px 2px 0 2px;
  box-sizing: border-box;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(7, calc(100% / 7 - 2px));
  grid-template-rows: 40px;
  grid-gap: 2px;

  >div {
    width: 100%;
    text-align: center;
    line-height: 30px;
    @include font_color("font1");

    font-size: $fontSize4;
    border-radius: 2px;

    &:hover {
      @include font_color("fill12");
      @include fill_color("fill16");
    }
  }

  .nowProblem {
    @include fill_color("fill15");
    @include outline(1px, solid, "fill11");
  }
}

// .right {
//   top: calc($page_outerPaddingTop + 50px);
//   margin: 0 10px 0 0;
// }

.notFound {
  width: 100%;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.problemBox .cursor_pointer {
  margin-bottom: 10px;
  font-weight: bold;
  cursor: pointer;
}

.tags {
  // margin-top: 10px;
}

.el-tag {
  margin-right: 5px;
  margin-bottom: 5px;
}

.footerEle {
  margin: 0 0 0 0px;
  font-family: Merriweather, 'PingFang SC', 'Microsoft Yahei', 'Times New Roman', serif;
  // align-self: center;
}

.submit,
.submitNotEnable,
.solutions {
  margin-top: 10px;
  padding: 10px 95px 10px 85px;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
  display: inline-block;
}

.adminButton {
  margin-top: 10px;
  padding: 10px 30px 10px 30px;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
  display: inline-block;
}

.submit {
  background-color: #4caf50;
  /* Green */
  color: white;
}

.submitNotEnable {
  padding: 10px 103px 10px 103px;
  background-color: #ccc;
  /* Gray */
  color: #666;
  cursor: not-allowed;
}

.solutions {
  background-color: #2196F3;
  /* Blue */
  color: white;
}

.copy {
  font-size: $fontSize3;
  width: 130px;
  border-radius: 4px;
  padding: 6px;

  &:hover {
    @include font_color("fill12");
    @include fill_color("fill16");
  }
}

.text {
  white-space: pre-wrap;
}

.textarea {
  width: 100%;
  height: 200px;
}

// .ace {
//   margin-top: 20px;
// }

#aceEditor {
  border: 1px solid #ddd;
  border-radius: 4px;
}

/* Password validation container */
.needPass {
  padding: 20px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 5px;
  text-align: center;
}

.needPass,
.title {
  font-size: $fontSize7;
  font-weight: bold;
  // margin-bottom: 20px;
}

.input {
  margin-bottom: 20px;
}


/* Footer styling */
.el-footer {
  text-align: left;
  // background-color: #333;
  // color: #fff;
  // padding: 10px 0;
}

.el-footer el-row {
  text-align: left;
  margin-bottom: 10px;
}
</style>