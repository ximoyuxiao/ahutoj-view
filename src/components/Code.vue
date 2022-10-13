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
      <div class="title">代码</div>
      <el-input
        v-model="submit.Source"
        :autosize="{ minRows: 5 }"
        readonly
        resize="none"
        show-word-limit
        type="textarea"
      />
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
import { useStore } from "vuex";
const { proxy } = getCurrentInstance() as any;
const store = useStore();

var notFound = ref(true);

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
  autoUpdate: null,
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
      submit.autoUpdate = setTimeout(() => {
        getSubmit();
        console.log(1);
      }, 2000);
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
    proxy.codeProcessor(data.code);
  });
}

//跳转到题目
function goToProblem(PID: number | string) {
  proxy.$router.push({
    path: "/Problem",
    query: {
      PID,
    },
  });
}

onMounted(() => {
  //同步url参数
  if (proxy.$route.query.SID) config.SID = proxy.$route.query.SID - 0;
  getSubmit();
});

onUnmounted(() => {
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

  .title {
    margin: 30px 0 5px 0;
    font-size: $fontSize8;
    @include font_color("font1");
  }
}
</style>

<style>
.ce .el-textarea__inner {
  color: rgb(233, 42, 42) !important;
}
</style>