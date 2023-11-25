<script lang="ts" setup>
import { getCurrentInstance, onMounted, onUnmounted, reactive, ref } from "vue";
import { useConfigStore } from "../pinia/config";
import { useConstValStore } from "../pinia/constVal";
const { proxy } = getCurrentInstance() as any;
const constValStore = useConstValStore();
const configStore = useConfigStore();

//未找到该提交结果
var notFound = ref(true);

//当前是否正在判题
var judging = ref(false);
var judgingLoading = null;

//页面配置参数
type configType = {
  SID: number;
  loading: any;
  [i: string]: any;
};
var config = reactive<configType>({
  SID: -1,
  loading: null,
  init() {
    config.SID = -1;
    config.loading = null;
  },
});

//提交数据
type submitType = {
  UID: string;
  Lang: number;
  PID: number;
  Result: string;
  SID: number;
  Source: string;
  SubmitTime: number;
  UseMemory: number;
  UseTime: number;
  CeInfo: string;
  PassSample: number;
  SampleNumber: number;
  [i: string]: any;
};
var submit = reactive<submitType>({
  UID: "",
  Lang: 1,
  PID: 0,
  Result: "",
  SID: 1,
  Source: "",
  SubmitTime: 0,
  UseMemory: 0,
  UseTime: 0,
  CeInfo: "",
  hasCeInfo: false, //是否存在ce错误
  PassSample: 0,
  SampleNumber: 0,
  //判题自动刷新
  autoUpdate: null,
  updateTimeStep: 1,
  init() {
    submit.UID = "";
    submit.Lang = 1;
    submit.PID = 0;
    submit.Result = "";
    submit.SID = 1;
    submit.Source = "";
    submit.SubmitTime = 0;
    submit.UseMemory = 0;
    submit.UseTime = 0;
    submit.CeInfo = "";
    submit.hasCeInfo = false;
    submit.PassSample = 0;
    submit.SampleNumber = 0;
    clearTimeout(submit.autoUpdate);
  },
  copy(data: any) {
    submit.UID = data.UID;
    submit.Lang = data.Lang;
    submit.PID = data.PID;
    submit.Result = data.Result;
    submit.SID = data.SID;
    submit.Source = data.Source;
    submit.SubmitTime = data.SubmitTime;
    submit.UseMemory = data.UseMemory;
    submit.UseTime = data.UseTime;
    submit.CeInfo = data.CeInfo;
    submit.PassSample = data.PassSample;
    submit.SampleNumber = data.SampleNumber;
    if (data.CeInfo && data.CeInfo != "") {
      submit.hasCeInfo = true;
    }
    if (
      data.Result == "JUDGING" ||
      data.Result == "REJUDGING" ||
      data.Result == "PENDING"
    ) {
      //设置当前的状态为正在判定
      judging.value = true;
      if (!judgingLoading)
        judgingLoading = proxy.elLoading({
          node: document.getElementById("judging"),
          text: "正在判题中...",
        });
      submit.autoUpdate = setTimeout(() => {
        if (submit.updateTimeStep < 15) {
          getSubmit();
          submit.updateTimeStep++;
        } else {
          //推测可能网络问题，这时候需要ping一下
          configStore.needPing();
          proxy.elMessage({
            message: "网络可能出现问题，或者服务器繁忙，请刷新或稍后再试。",
            type: "warning",
          });
        }
      }, (submit.updateTimeStep / 3) * 1000 + 500);
    } else {
      if (judging.value && data.Result == "AC") {
        //说明刚刚正在进行判题
        proxy.elNotification({
          message: "恭喜你，通过了该题！",
          type: "success",
        });
      }
      judging.value = false;
      if (judgingLoading) judgingLoading.close();
    }
  },
});

//获取数据
function getSubmit() {
  config.loading = proxy.elLoading({ node: proxy.$refs.code });
  if (config.SID == -1) return;
  proxy.$get("api/submit/" + config.SID).then((res: any) => {
    let data = res.data;
    if (data.code == 0) {
      submit.init();
      // proxy.$log(data);
      submit.copy(data);
      notFound.value = false;
    }
    config.loading.close();
    proxy.codeProcessor(
      data?.code ?? 100001,
      data?.msg ?? "服务器错误\\\\error"
    );
  });
}

//结果为failed重判
function rejudge() {
  let params: { [item: string]: any } = {};
  if (submit.SID) params.SID = submit.SID;
  else {
    proxy.elMessage({ message: "数据异常，请刷新后重试", type: "error" });
    return;
  }
  proxy.$post("api/submit/rejudge/", params).then((res: any) => {
    console.log(res);
    let data = res.data;
    if (data.code == 0) {
      getSubmit();
      proxy.elNotification({ message: "重判成功!", type: "success" });
    }
    proxy.codeProcessor(
      data?.code ?? 100001,
      data?.msg ?? "服务器错误\\\\error"
    );
  });
}

//跳转到题目
function goToProblem(PID: number | string) {
  let routerName = proxy.$route.query.CID ? "ContestProblem" : "Problem";
  proxy.$router.push({
    name: routerName,
    params: {
      PID,
      CID: proxy.$route.query.CID ? proxy.$route.query.CID : undefined,
    },
  });
}

onMounted(() => {
  //同步url参数
  if (proxy.$route.query.SID) config.SID = Number(proxy.$route.query.SID);
  getSubmit();
});

onUnmounted(() => {
  //清除定时器 ，释放内存占用。
  clearTimeout(submit.autoUpdate);
});

const tableData = [
  {
  },
]

</script>

<template>
  <div v-if="notFound">
    <el-empty description="无结果" />
  </div>
  <div
    v-else
    class="Main"
    style="color: white;"
  >
    <el-container>
      <el-header
        class="Container StatusBarJUDGING"
        v-if="submit.Result == 'JUDGING'"
        :style="'background-color:' +
          proxy.Utils.StatusConstValManager.getStatusColor(submit.Result)
          "
      >
        <el-row>
          <el-icon
            size="26px"
            class="is-loading"
          >
            <Loading />
          </el-icon>
          <div class="Title Bold ArtFont Left">
            Judging
          </div>
        </el-row>
      </el-header>
      <el-header
        class="Container StatusBarJUDGING"
        v-else-if="submit.Result == 'REJUDGING'"
        :style="'background-color:' +
          proxy.Utils.StatusConstValManager.getStatusColor(submit.Result)
          "
      >
        <el-row>
          <el-icon
            size="26px"
            class="is-loading"
          >
            <Loading />
          </el-icon>
          <div class="Title Bold ArtFont Left">
            Rejudging
          </div>
        </el-row>
      </el-header>
      <el-header
        class="Container StatusBarPENDING"
        v-else-if="submit.Result == 'PENDING'"
        :style="'background-color:' +
          proxy.Utils.StatusConstValManager.getStatusColor(submit.Result)
          "
      >
        <el-row>
          <el-icon
            size="26px"
            class="is-loading"
          >
            <Loading />
          </el-icon>
          <div class="Title Bold ArtFont Left">
            Pending
          </div>
        </el-row>
      </el-header>
      <el-header
        class="Container StatusBarAC"
        v-else-if="submit.Result == 'FAILED'"
        :style="'background-color:' +
          proxy.Utils.StatusConstValManager.getStatusColor(submit.Result)
          "
      >
        <el-row>
          <el-icon size="26px">
            <WarningFilled />
          </el-icon>
          <div class="Title Bold ArtFont Left">
            Failed
          </div>
        </el-row>
      </el-header>
      <el-header
        class="Container StatusBarWA"
        v-else-if="submit.Result == 'CE'"
        :style="'background-color:' +
          proxy.Utils.StatusConstValManager.getStatusColor(submit.Result)
          "
      >
        <el-row>
          <el-icon size="26px">
            <WarningFilled />
          </el-icon>
          <div class="Title Bold ArtFont Left">
            Compile Error
          </div>
          <div
            class="Left"
            style="font-size: 16px; margin-top: 4px;"
          >通过了 {{ submit.PassSample }} / {{ submit.SampleNumber
          }} 个测试数据</div>
        </el-row>
      </el-header>
      <el-header
        class="Container"
        v-else-if="submit.Result == 'WA'"
        :style="'background-color:' +
          proxy.Utils.StatusConstValManager.getStatusColor(submit.Result)
          "
      >
        <el-row>
          <el-icon size="26px">
            <CircleCloseFilled />
          </el-icon>
          <div class="Title Bold ArtFont Left">
            Wrong Answer
          </div>
          <div
            class="Left"
            style="font-size: 16px; margin-top: 4px;"
          >通过了 {{ submit.PassSample }} / {{ submit.SampleNumber
          }} 个测试数据</div>
        </el-row>
      </el-header>
      <el-header
        class="Container"
        v-else-if="submit.Result == 'TLE'"
        :style="'background-color:' +
          proxy.Utils.StatusConstValManager.getStatusColor(submit.Result)
          "
      >
        <el-row>
          <el-icon size="26px">
            <WarningFilled />
          </el-icon>
          <div class="Title Bold ArtFont Left">
            Time Limit Exceeded
          </div>
          <div
            class="Left"
            style="font-size: 16px; margin-top: 4px;"
          >通过了 {{ submit.PassSample }} / {{ submit.SampleNumber
          }} 个测试数据</div>
        </el-row>
      </el-header>
      <el-header
        class="Container"
        v-else-if="submit.Result == 'MLE'"
        :style="'background-color:' +
          proxy.Utils.StatusConstValManager.getStatusColor(submit.Result)
          "
      >
        <el-row>
          <el-icon size="26px">
            <WarningFilled />
          </el-icon>
          <div class="Title Bold ArtFont Left">
            Memory Limit Exceeded
          </div>
          <div
            class="Left"
            style="font-size: 16px; margin-top: 4px;"
          >通过了 {{ submit.PassSample }} / {{ submit.SampleNumber
          }} 个测试数据</div>
        </el-row>
      </el-header>
      <el-header
        class="Container"
        v-else-if="submit.Result == 'PE'"
        :style="'background-color:' +
          proxy.Utils.StatusConstValManager.getStatusColor(submit.Result)
          "
      >
        <el-row>
          <el-icon size="26px">
            <CircleCloseFilled />
          </el-icon>
          <div class="Title Bold ArtFont Left">
            Partical Error
          </div>
          <div
            class="Left"
            style="font-size: 16px; margin-top: 4px;"
          >通过了 {{ submit.PassSample }} / {{ submit.SampleNumber
          }} 个测试数据</div>
        </el-row>
      </el-header>
      <el-header
        class="Container"
        v-else-if="submit.Result == 'OLE'"
        :style="'background-color:' +
          proxy.Utils.StatusConstValManager.getStatusColor(submit.Result)
          "
      >
        <el-row>
          <el-icon size="26px">
            <RemoveFilled />
          </el-icon>
          <div class="Title Bold ArtFont Left">
            Output Limit Exceeded
          </div>
          <div
            class="Left"
            style="font-size: 16px; margin-top: 4px;"
          >通过了 {{ submit.PassSample }} / {{ submit.SampleNumber
          }} 个测试数据</div>
        </el-row>
      </el-header>
      <el-header
        class="Container"
        v-else-if="submit.Result == 'RE'"
        :style="'background-color:' +
          proxy.Utils.StatusConstValManager.getStatusColor(submit.Result)
          "
      >
        <el-row>
          <el-icon size="26px">
            <RemoveFilled />
          </el-icon>
          <div class="Title Bold ArtFont Left">
            Runtime Error
          </div>
          <div
            class="Left"
            style="font-size: 16px; margin-top: 4px;"
          >通过了 {{ submit.PassSample }} / {{ submit.SampleNumber
          }} 个测试数据</div>
        </el-row>
      </el-header>
      <el-header
        class="Container StatusBarJUDGING"
        v-else-if="submit.SampleNumber == 0"
        style="background-color: #409EFF"
      >
        <el-row>
          <el-icon size="26px">
            <DocumentDelete />
          </el-icon>
          <div class="Title Bold ArtFont Left">
            本题数据缺失，请联系管理员
          </div>
        </el-row>
      </el-header>
      <el-header
        class="Container StatusBarAC"
        v-else-if="submit.Result == 'AC'"
        :style="'background-color:' +
          proxy.Utils.StatusConstValManager.getStatusColor(submit.Result)
          "
      >
        <el-row>
          <el-icon size="26px">
            <SuccessFilled />
          </el-icon>
          <div class="Title Bold ArtFont Left">
            Accepted
          </div>
          <div
            class="Left"
            style="font-size: 16px; margin-top: 4px;"
          >通过了 {{ submit.PassSample }} / {{ submit.SampleNumber
          }} 个测试数据</div>
        </el-row>
      </el-header>
      <el-header
        class="Container"
        v-else
        style="background-color: #1E1E1E;"
      >
        <el-row>
          <el-icon size="26px">
            <QuestionFilled />
          </el-icon>
          <div class="Title Bold ArtFont Left">
            Unknown Return Value
          </div>
          <div
            class="Left"
            style="font-size: 16px; margin-top: 4px;"
          >通过了 {{ submit.PassSample }} / {{ submit.SampleNumber
          }} 个测试数据</div>
        </el-row>
      </el-header>
      <el-header class="Container">
        <el-table
          :data="tableData"
          style="width: 100%"
        >
          <el-table-column
            prop="SID"
            label="提交 ID"
            align="center"
          >
            {{ submit.SID }}
          </el-table-column>
          <el-table-column
            prop="UID"
            label="用户"
            align="center"
          >
            {{ submit.UID.length > 15 ? (submit.UID.slice(0, 15) + "...") : submit.UID }}
          </el-table-column>
          <el-table-column
            prop="SubmitTime"
            label="提交时间"
            min-width="170px"
            align="center"
          >
            {{ proxy.Utils.TimeTools.timestampToTime(submit.SubmitTime) }}
          </el-table-column>
          <el-table-column
            prop="PID"
            label="题目"
            align="center"
          >
            <div
              @click="goToProblem(submit.PID)"
              class="cursor_pointer Bold ArtFont"
              style="color: #569CD6;"
            >
              {{ submit.PID }}
            </div>
          </el-table-column>
          <!-- <el-table-column prop="Status" label="状态" align="center" min-width="120px">
            <div style="text-align: center;">
              <div class="res cursor_pointer Bold" style="border-radius: 6px; width: 110px; height: 24px;" :style="'color: #ffffff; background-color:' +
                proxy.Utils.StatusConstValManager.getStatusColor(submit.Result)
                ">
                {{ submit.Result }}
              </div>
            </div>
          </el-table-column> -->
          <el-table-column
            prop="Time"
            label="用时"
            align="center"
            :style="'width: 120px;' + (submit.Result == 'TLE' ? 'color: #ff381e;' : '')"
          >
            {{ submit.UseTime }}&nbsp;ms
          </el-table-column>
          <el-table-column
            prop="Mem"
            label="内存"
            align="center"
            :style="'width: 120px;' + (submit.Result == 'MLE' ? 'color: #ff381e;' : '')"
          >
            {{ (submit.UseMemory / 1024 / 1024).toFixed(0) }}&nbsp;MB
          </el-table-column>
          <el-table-column
            prop="Lang"
            label="语言"
            align="center"
          >
            {{ proxy.Utils.StatusConstValManager.getLangString(submit.Lang) }}
          </el-table-column>
        </el-table>
      </el-header>
      <el-main
        class="Container"
        v-if="notFound"
      >
        <el-empty description="无结果" />
      </el-main>
      <!-- <el-main class="Container" v-else-if="judging">
      </el-main> -->
      <el-main
        class="Container"
        v-else-if="submit.hasCeInfo"
      >
      <div class="title">错误信息</div>
      <el-input
        v-model="submit.CeInfo"
        :autosize="{ minRows: 5 }"
        readonly
        resize="none"
        show-word-limit
        type="textarea"
      />
    </el-main>
    <el-main
      class="Container"
      v-else-if="submit.Result == 'PE'"
    >
      <div class="title">格式有误</div>
      <el-input
        v-model="constValStore.SUBMIT_RESULT_PE"
        :autosize="{ minRows: 5 }"
        readonly
        resize="none"
        show-word-limit
        type="textarea"
      />
    </el-main>
    <el-main
      class="Container"
      v-else-if="submit.Result == 'FAILED'"
    >
      <div class="title">意外的错误</div>
      <el-input
        v-model="constValStore.SUBMIT_RESULT_FAILED"
        :autosize="{ minRows: 3 }"
        readonly
        resize="none"
        show-word-limit
        type="textarea"
      />
      <div
        class="rejudge cursor_pointer"
        @click="rejudge"
      >
        重判
      </div>
    </el-main>
    <!-- <el-main class="Container" style=""> -->
    <!-- <div class="Title Bold Bottom">代码</div> -->
    <el-input
      class="Top"
      v-model="submit.Source"
      :autosize="{ minRows: 5 }"
      readonly
      resize="none"
      show-word-limit
      type="textarea"
      style="border-radius: 0px;"
    />
    <!-- </el-main> -->
  </el-container>
</div>
<div class="Main">
  <div
    id="judging"
    class="Container"
    v-show="judging"
    style="width: 100%; height: 200px;"
  >
  </div>
</div>
<div class="Main Bottom">
  <el-footer class="Container Footer ArtFont Bottom">
    <el-row>
      Anhui University of Technology
    </el-row>
    <el-row>
      Online Judge &copy; 2019 - 2023
    </el-row>
  </el-footer>
</div></template>

<style scoped lang="scss">.notFound {
  width: 100%;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.submit {
  border-radius: 10px;
  box-sizing: border-box;
  padding: $status_listPadding;

  .header {
    display: flex;
    align-items: center;
    font-size: $fontSize8;
    @include font_color("font1");
    border-bottom: 2px solid #fefefe;
    padding: 10px 0;
    justify-content: space-between;

    >div {
      text-align: center;
    }
  }

  .item {
    display: flex;
    align-items: center;
    font-size: $fontSize6;
    @include font_color("font2");
    @include fill_color("fill2");
    justify-content: space-between;
    border-bottom: 2px solid #fefefe;
    box-sizing: border-box;

    .PID {
      @include font_color("fill12");
      box-sizing: border-box;
    }

    .res {
      margin: 8px 0;
      padding: 4px 10px;
      box-sizing: border-box;
      border-radius: 6px;
      width: fit-content;
      filter: drop-shadow(0 0 1px #00000088);
    }

    >div {
      text-align: center;
    }
  }

  >div {

    >.title,
    +.title {
      margin: 30px 0 5px 0;
      font-size: $fontSize8;
      @include font_color("font1");
    }

    >.rejudge {
      box-sizing: border-box;
      padding: 10px 50px;
      text-align: center;
      font-size: $fontSize8;
      font-weight: 600;
      @include font_color("font3");
      @include fill_color("fill35");

      &:hover {
        @include font_color("font2");
        @include fill_color("fill33");
        @include box_shadow(0, 0, 2px, 1px, "border1");
      }
    }
  }

}

#judging {
  width: 100%;
  height: 400px;
  border-end-start-radius: 10px;
  border-end-end-radius: 10px;
  overflow: hidden;
}

.ce .el-textarea__inner {
  color: rgb(233, 42, 42) !important;
}</style>