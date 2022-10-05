<template>
  <div class="contest">
    <div
      class="top"
      ref="searchResult"
      v-show="contests.list.length != 0"
    >
      <div class="list">
        <div
          class="item"
          v-for="(item, index) in contests.list"
          :key="index"
        >
          <div class="goingFlag">
            <!-- 未开始 -->
            <template v-if="item.BeginTime > config.serverTime">
              <div
                class="waiting"
                style="background-color: #009acd"
              >
              </div>
            </template>
            <!-- 已开始 -->
            <template v-else>
              <div
                v-if="item.EndTime > config.serverTime"
                class="going"
                style="background-color: #5ebd00"
              >
              </div>
              <div
                v-else
                class="finish"
                style="background-color: #969696"
              >
              </div>
            </template>
          </div>
          <div class="publicFlag">
            <!-- 未开始 -->
            <template v-if="item.BeginTime > config.serverTime">
              <div
                v-if="item.IsPublic == 1"
                style="color: #009acd"
              >
                <el-icon
                  color="#009acd"
                  size="22px"
                >
                  <Timer />
                </el-icon>等待
              </div>
            </template>
            <!-- 已开始 -->
            <template v-else>
              <div
                v-if="item.IsPublic == 1"
                style="color: #5ebd00"
              >
                <el-icon
                  color="#5ebd00"
                  size="22px"
                >
                  <Unlock />
                </el-icon>公开
              </div>
              <div
                v-else
                style="color: #ff3300"
              >
                <el-icon
                  color="#ff3300"
                  size="22px"
                >
                  <Lock />
                </el-icon>私有
              </div>
            </template>

          </div>
          <div class="cidFlag">&nbsp;#{{ item.CID }}&nbsp;</div>
          <div
            class="content cursor_pointer"
            @click="() => getContestById(item)"
          >
            <div class="title">
              {{ item.Title }}
            </div>
            <div class="contestInfo">
              创建者：{{ item.UID }}
              <el-divider direction="vertical" />
              类型：{{ item.Type == 1 ? "ACM" : "OI" }}
            </div>
            <div class="timeInfo">
              开始时间：{{ proxy.Utils.TimeTools.timestampToTime(item.BeginTime) }}
              <el-divider direction="vertical" />
              结束时间：{{ proxy.Utils.TimeTools.timestampToTime(item.EndTime) }}
              <el-divider direction="vertical" />
              时长：
              {{ proxy.Utils.TimeTools.timeIntervalToTime(item.EndTime, item.BeginTime) }}
            </div>
          </div>
          <div class=""></div>
        </div>
      </div>
      <div class="pagination">
        <el-pagination
          background
          layout="prev, pager, next"
          :page-size="config.limit"
          :total="config.Count"
          :current-page="config.currentPage"
          @current-change="config.changePage"
        />
        <el-radio-group
          v-model="config.limit"
          @change="config.changePage(1)"
          style="margin: 0 20px"
        >
          <el-radio-button :label="20" />
          <el-radio-button :label="30" />
          <el-radio-button :label="50" />
        </el-radio-group>
      </div>
    </div>
    <div
      class="notFound"
      v-show="contests.list.length == 0"
    >
      <el-empty description="未找到结果" />
    </div>
  </div>
</template>

<script lang="ts" setup name="Contests">
import { getCurrentInstance, onMounted, reactive } from "vue";
import { useStore } from "vuex";
import { ElMessageBox } from "element-plus";
const { proxy } = getCurrentInstance() as any;
const store = useStore();

//页面数据
type contestsType = {
  list: {
    BeginTime: number;
    CID: number;
    EndTime: number;
    IsPublic: number;
    Title: string;
    Type: number;
    UID: string;
  }[];
};
var contests = reactive<contestsType>({
  list: [],
});

//页面配置数据
type configType = {
  Count: number;
  currentPage: number;
  limit: number;
  loading: any;
  serverTime: number;
  [item: string]: any;
};
var config = reactive<configType>({
  Count: 0,
  currentPage: 1,
  limit: 20,
  loading: null,
  serverTime: Date.now(),
  init() {
    this.Count = 0;
    this.currentPage = 1;
    this.limit = 20;
    this.loading = null;
    this.serverTime = Date.now();
  },
  //切换页面
  changePage: (page: number): void => {
    config.currentPage = page;
    SyncUrl();
    getContests();
  },
});

//获取竞赛列表
function getContests() {
  config.loading = proxy.elLoading({
    node: proxy.$refs.searchResult,
  });
  proxy
    .$get(
      "api/contest/list?Page=" +
        (config.currentPage - 1) +
        "&Limit=" +
        config.limit
    )
    .then((res: any) => {
      let data = res.data;
      if (data.code == 0) {
        // proxy.$log(data)
        config.Count = data.Size;
        contests.list = data.Data;
      }
      config.loading.close();
      proxy.codeProcessor(data.code);
    });

  //同步服务器时间
  proxy.getServerTime().then((res) => {
    let now = Date.now();
    if (res.time == null || Math.abs(res.time - now) < 1500) {
      return;
    }
    config.serverTime = res.time;
  });
}

//跳转题目
function getContestById(contest: any) {
  //竞赛未开始
  if (contest.BeginTime > config.serverTime) {
    proxy.elNotification({
      message: "竞赛还未开始哦",
      type: "warning",
      duration: 2500,
    });
    return;
  }
  //验证策略
  if (contest.IsPublic == 1) {
    proxy.$router.push({
      path: "/Contest",
      query: {
        CID: contest.CID,
      },
    });
  } else {
    ElMessageBox.prompt("请输入竞赛“" + contest.Title + "”的密码：", "验证", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      inputValidator: function f(s) {
        if (s == "") return "请输入密码";
      },
      inputErrorMessage: "",
    }).then((res) => {
      let pass: string = res.value;
      if (!pass) {
        proxy.elMessage({
          message: "密码不能为空!",
          type: "warning",
        });
        return;
      }
      proxy.$router.push({
        path: "/Contest",
        query: {
          CID: contest.CID,
          Pass: pass,
        },
      });
    });
  }
}

//用于同步浏览器url
function SyncUrl() {
  //仅用于展示实时url，可用于复制跳转
  proxy.$router.replace({
    path: "/Contests",
    query: {
      Page: config.currentPage,
      Limit: config.limit,
    },
  });
}

onMounted(() => {
  //同步url参数
  if (proxy.$route.query.Page) config.currentPage = proxy.$route.query.Page - 0;
  if (proxy.$route.query.Limit) config.limit = proxy.$route.query.Limit - 0;
  getContests();
});
</script>

<style  scoped lang="scss">
.contest {
  width: 100%;
  box-sizing: border-box;
  padding: $page_outerPaddingTop $page_outerPaddingLeft;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  .top {
    width: 100%;
    @include fill_color(fill2);
    border-radius: 10px;

    .list {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      box-sizing: border-box;
      padding: 8px;

      .item {
        width: 100%;
        height: 70px;
        box-sizing: border-box;
        padding: 3px 10px;
        margin: 5px 0;
        border-radius: 8px;
        @include border(1px, solid, "border3");
        display: flex;
        align-items: center;
        transition-duration: 300ms;

        &:hover {
          @include fill_color("fill15");
          @include border(1px, solid, "fill12");
        }

        &:hover > .goingFlag {
          width: 22px;
        }

        &:hover > .publicFlag {
          width: 80px;
          opacity: 1;
        }

        &:hover > .cidFlag {
          width: 100px;
          font-size: $fontSize8;
          @include font_color("font3");
          opacity: 1;
        }

        .content {
          width: fit-content;
          font-size: $fontSize7;
          @include font_color("font1");

          .contestInfo {
            width: fit-content;
            font-size: $fontSize3;
            @include font_color("font2");
          }

          .timeInfo {
            width: fit-content;
            font-size: $fontSize2;
            @include font_color("font3");
          }
        }

        .goingFlag {
          height: 100%;
          width: 15px;
          transition-duration: 300ms;

          .going,
          .finish,
          .waiting {
            height: 100%;
            width: 100%;
            border-top-left-radius: 5px;
            border-bottom-left-radius: 5px;
          }
        }

        .publicFlag,
        .cidFlag {
          width: 15px;
          opacity: 0;
          transition-duration: 300ms;
          overflow: hidden;
          text-align: center;
          font-size: $fontSize8;

          > div {
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
    }

    .pagination {
      margin: 25px 0;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      justify-items: center;
    }
  }

  .notFound {
    width: 100%;
    height: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>