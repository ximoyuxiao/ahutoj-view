<template>
  <div class="Home">
    <div
      class="error"
      v-show="config.isError"
    >
      <el-empty description="数据同步失败,可能是网络问题，请稍后重试，或者联系网站运维人员。" />
    </div>
    <div
      class="contestsPreview"
      v-show="!config.isError"
    >
      <div class="left">
        <div class="liveContests cursor_pointer"></div>
        <div class="waitingContests cursor_pointer"></div>
        <div class="overContests cursor_pointer"></div>
      </div>
      <div class="right">
        <transition
          enter-active-class="animate__animated animate__backInDown"
          leave-active-class="animate__animated animate__backOutDown"
        >
          <div
            class="liveContests"
            v-show="contests.showListIndex == 1"
          >
            <div class="title">未开始的竞赛</div>
            <div
              class="item"
              v-for="(item,index) in contests.liveList"
              :key="index"
            >
              <div class="title">
                {{item.Title}}
              </div>
              <div class="time">
                {{ item.BeginTime ?( proxy.Utils.TimeTools.timestampToTime(item.BeginTime) + " - "): ""  }}
                {{ item.EndTime ? proxy.Utils.TimeTools.timestampToTime(item.EndTime) : ""}}
              </div>
            </div>
          </div>
        </transition>
        <transition
          enter-active-class="animate__animated animate__backInDown"
          leave-active-class="animate__animated animate__backOutDown"
        >
          <div
            class="waitingContests"
            v-show="contests.showListIndex == 2"
          >
            <div class="title">未开始的竞赛</div>
            <div
              class="item"
              v-for="(item,index) in contests.waitingList"
              :key="index"
            >
              <div class="title">
                {{item.Title}}
              </div>
            </div>
          </div>
        </transition>
        <transition
          enter-active-class="animate__animated animate__backInDown"
          leave-active-class="animate__animated animate__backOutDown"
        >
          <div
            class="overContests"
            v-show="contests.showListIndex == 3"
          >
            <div class="title">未开始的竞赛</div>
            <div
              class="item"
              v-for="(item,index) in contests.overList"
              :key="index"
            >
              <div class="title">
                {{item.Title}}
              </div>
            </div>
          </div>
        </transition>
      </div>

    </div>
  </div>
</template>

<script lang="ts" setup>
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
  waitingList: any[] | null;
  liveList: any[] | null;
  overList: any[] | null;
  [item: string]: any;
};
var contests = reactive<contestsType>({
  liveList: [],
  waitingList: [],
  overList: [],
  //显示哪一个列表
  showListIndex: 1,
  init() {
    contests.liveList = [];
    contests.waitingList = [];
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
    if (data.code == 0) {
      config.time = data.time;
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
  proxy.$get("api/contest/list", { Limit: 50, Page: 0 }).then((res: any) => {
    let data = res.data;
    if (data.code == 0) {
      let tempTime = config.time;
      //初始化并且循环遍历
      contests.init();
      data.Data.forEach((con: any) => {
        //未开始的竞赛
        if (con.BeginTime > tempTime) {
          if (contests.waitingList.length < 5) contests.waitingList.push(con);
        }
        //已经开始的比赛
        else {
          //正在进行
          if (con.EndTime > tempTime) {
            if (contests.liveList.length < 10) contests.liveList.push(con);
          }
          //已经结束
          else {
            if (contests.overList.length < 5) contests.overList.push(con);
          }
        }
      });
      while (contests.waitingList.length < 5)
        contests.waitingList.push({ Title: "" });
      while (contests.liveList.length < 5)
        contests.liveList.push({ Title: "" });
      while (contests.overList.length < 5)
        contests.overList.push({ Title: "" });
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
  flex-direction: column;
  box-sizing: border-box;
  padding: $home_outerPaddingTop $home_outerPaddingLeft;

  .error {
    width: 100%;
    @include font_color("font1");
  }

  .contestsPreview {
    width: 100%;
    display: flex;

    .left {
      width: 30px;

      > div {
        height: 160px;
        width: 100%;
      }
      .liveContests {
        @include fill_color("fill23");
        border-start-start-radius: 12px;
      }

      .waitingContests {
        @include fill_color("fill13");
      }

      .overContests {
        @include fill_color("fill53");
        border-end-start-radius: 12px;
      }
    }

    .right {
      width: calc(100% - 30px);
      height: 480px;

      > div {
        height: 480px;
        width: 100%;
        border-start-end-radius: 12px;
        border-end-end-radius: 12px;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        box-sizing: border-box;
        padding: 15px 20px;

        .item {
          height: 70px;
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          border-radius: 8px;

          .title {
            font-size: $fontSize7;
          }
          .time {
            font-size: $fontSize5;
          }
        }
      }

      .liveContests {
        @include fill_color("fill23");

        .item {
          background-color: red;
          font-size: $fontSize7;
        }

        .time {
        }
      }

      .waitingContests {
        @include fill_color("fill13");
      }

      .overContests {
        @include fill_color("fill53");
      }
    }
  }
}
</style>
