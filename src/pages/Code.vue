<template>
  <div
    class="code"
    ref="code"
  >
    <div
      class="submit"
      v-show="!notFound"
    >
      <div class="header">
        <div style="width: 140px">提交ID</div>
        <div style="width: 120px">题目ID</div>
        <div style="width: 160px">用户</div>
        <div style="width: 120px">状态</div>
        <div style="width: 140px">语言</div>
        <div style="width: 120px">用时</div>
        <div style="width: 120px">内存</div>
        <div style="width: 180px">提交时间</div>
      </div>
      <div class="item">
        <div
          class="SID"
          style="width: 140px"
        >
          {{ submit.SID }}
        </div>
        <div
          class="PID cursor_pointer"
          style="width: 120px;  "
          @click="goToProblem(submit.PID)"
        >
          {{ submit.PID }}
        </div>
        <div
          class="UID"
          style="width: 160px"
        >
          {{ submit.UID.length >  15 ? (submit.UID.slice(0,15) + "..." ): submit.UID }}
        </div>
        <div style="width: 120px; display: flex; justify-content: center;">
          <div
            class="res cursor_pointer"
            :style="
          'color: #ffffff; background-color:' +
          proxy.Utils.StatusConstValManager.getStatusColor(submit.Result)
        "
          >
            {{ submit.Result }}
          </div>
        </div>
        <div style="width: 140px">
          {{ proxy.Utils.StatusConstValManager.getLangString(submit.Lang) }}
        </div>
        <div
          class="useTime"
          :style="'width: 120px;' + (submit.Result == 'TLE' ? 'color: #ff381e;' : '')"
        >
          {{ submit.UseTime }}&nbsp;ms
        </div>
        <div
          class="useMemory"
          :style="'width: 120px;' + (submit.Result == 'MLE' ? 'color: #ff381e;' : '')"
        >
          {{ (submit.UseMemory / 1024).toFixed(0) }}&nbsp;KB
        </div>
        <div
          class="submitTime"
          style="width: 180px"
        >
          {{ proxy.Utils.TimeTools.timestampToTime(submit.SubmitTime) }}
        </div>
      </div>
      <template v-if="!judging">
        <!-- 如果结果是 CE 则显示报错信息 -->
        <div
          class="ce"
          v-if="submit.hasCeInfo"
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
        </div>
        <!-- 如果结果是 PE 则显示提示格式有问题 -->
        <div
          class="pe"
          v-if="submit.Result == 'PE'"
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
        </div>
        <!-- 如果结果是 Failed 则显示重判按钮 -->
        <div
          class="failed"
          v-if="submit.Result == 'FAILED'"
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
        </div>
        <div class="title">代码</div>
        <el-input
          v-model="submit.Source"
          :autosize="{ minRows: 5 }"
          readonly
          resize="none"
          show-word-limit
          type="textarea"
        />
      </template>
      <!-- 判题中 -->
      <div
        id="judging"
        v-show="judging"
      >
      </div>
    </div>
    <div
      class="notFound"
      v-show="notFound"
    >
      <el-empty description="无结果" />
    </div>
  </div>
</template>
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
    proxy.codeProcessor(data.code, data.msg);
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
    proxy.codeProcessor(data.code, data.msg);
  });
}

//跳转到题目
function goToProblem(PID: number | string) {
  proxy.$router.push({
    path: "/Problem",
    query: {
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
</script>

<style scoped lang="scss">
.notFound {
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

    > div {
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

    > div {
      text-align: center;
    }
  }

  > div {
    > .title,
    + .title {
      margin: 30px 0 5px 0;
      font-size: $fontSize8;
      @include font_color("font1");
    }

    > .rejudge {
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

  #judging {
    width: 100%;
    height: 400px;
    border-end-start-radius: 10px;
    border-end-end-radius: 10px;
    overflow: hidden;
  }
}
</style>

<style>
.ce .el-textarea__inner {
  color: rgb(233, 42, 42) !important;
}
</style>