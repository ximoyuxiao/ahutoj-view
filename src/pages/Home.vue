<template>
  <div class="Home">
    <div
      class="error"
      v-show="config.isError"
    >
      <el-empty description="数据同步失败,可能是网络问题，请稍后重试，或者联系网站运维人员。" />
    </div>
    <div
      class="left"
      v-show="!config.isError"
    >
      <div class="liveContests">
        <div
          class="liveItem"
          v-for="(item,index) in contests.liveList"
          :key="index"
        >
          {{ item }}
        </div>
      </div>
      <div class="overContests">
        <div
          class="overItem"
          v-for="(item,index) in  contests.overList"
          :key="index"
        >
          {{item}}
        </div>
      </div>
    </div>
    <div
      class="right"
      v-show="!config.isError"
    >
      <div class="sysTime">
        <div class="title">AhutOj时间</div>
        <div>
          {{proxy.Utils.TimeTools.timestampGetHMS(config.time)}}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { templateSettings } from "lodash";
import { onMounted, reactive, getCurrentInstance } from "vue";
import { useStore } from "vuex";
const { proxy } = getCurrentInstance() as any;
const store = useStore();

//页面配置
var config = reactive({
  time: 0,
  timer: null,
  isError: false,
  loads: {
    getSystemTimeLoader: null,
    getContestLoader: null,
    init() {
      if (this.getSystemTimeLoader) this.getSystemTimeLoader.close();
      if (this.getContestLoader) this.getContestLoader.close();
      this.getSystemTimeLoader = null;
      this.getContestLoader = null;
    },
  },
});

//首页ahutoj竞赛信息
type contestsType = {
  liveList: any[] | null;
  overList: any[] | null;
  [item: string]: any;
};
var contests = reactive<contestsType>({
  liveList: [],
  overList: [],
  init() {
    contests.liveList = [];
    contests.overList = [];
  },
});

//初始化
async function init() {
  config.loads.init();
  await syncSystemTime();
  recentContestsProcessor();
  getContestsInfo();
}

//同步系统时间
async function syncSystemTime() {
  config.loads.getSystemTimeLoader = proxy.elLoading({
    node: document.getElementsByClassName("Home")[0],
    text: "同步系统时间",
  });
  await proxy.$get("api/now").then((res: any) => {
    let data = res.data;
    if (data.code == 0 || data.code == 200) {
      config.time = data.time * 1000;
      clearInterval(config.timer);
      config.timer = setInterval(() => {
        config.time += 1000;
      }, 1000);
      config.isError = false;
    } else {
      config.isError = true;
    }
    //获取失败，可能网络有问题
    config.loads.getSystemTimeLoader.close();
    proxy.codeProcessor(data.code);
  });
}

//获取当前比赛列表
function getContestsInfo() {
  proxy.$get("api/contest/list", { Limit: 20, Page: 1 }).then((res: any) => {
    let data = res.data;
    if (data.code == 0) {
      let tempTime = config.time;
      //初始化并且循环遍历
      contests.init();
      data.Data.forEach((con) => {
        if (con.EndTime > tempTime) {
          contests.liveList.push(con);
        } else {
          contests.overList.push(con);
        }
      });
    }
    proxy.codeProcessor(data.code);
  });
}

//列表数据处理
function recentContestsProcessor() {
  //在获取到数据后
}

onMounted(() => {
  init();
});
</script>

<style scoped lang="scss">
.Home {
  width: 100%;
  min-height: 600px;
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
  padding: $home_outerPaddingTop $home_outerPaddingLeft;

  .error {
    width: 100%;
    @include font_color("font1");
  }

  .left {
    width: calc(100% - $home_rightWidth - $modelDistance);
    transform-style: preserve-3d;
    perspective: 600px;

    .liveContests {
      height: 200px;
      width: 200px;
      @include fill_color("fill2");
    }

    .overContests {
      height: 200px;
      width: 200px;
      background-color: blue;
    }
  }

  .right {
    width: $home_rightWidth;
    display: flex;
    flex-direction: column;

    .sysTime {
      text-align: center;
      font-size: $fontSize11;
      @include font_color("font2");
      @include fill_color("fill2");
      @include box_shadow(0, 0, 2px, 1px, "fill11");
      border-radius: 6px;
      padding: 5px 0;

      .title {
        font-size: $fontSize8;
        @include font_color("fill31");
        margin: 6px 0;
      }
    }
  }
}
</style>
