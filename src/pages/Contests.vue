<template>
  <el-container class="mainContainer frameContainer">
    <el-main class="main">
      <div class="contest">
        <div class="top" ref="searchResult" v-show="contests.list.length != 0">
          <div class="list">
            <div class="item" v-for="(item, index) in contests.list" :key="index">
              <div class="goingFlag">
                <!-- 未开始 -->
                <template v-if="item.BeginTime > config.serverTime">
                  <div class="waiting" style="background-color: #009acd">
                  </div>
                </template>
                <!-- 已开始 -->
                <template v-else>
                  <div v-if="item.EndTime > config.serverTime" class="going" style="background-color: #5ebd00">
                  </div>
                  <div v-else class="finish" style="background-color: #969696">
                  </div>
                </template>
              </div>
              <!-- <div class="publicFlag">
                <template v-if="item.BeginTime > config.serverTime">
                  <div v-if="item.IsPublic == 1" style="color: #009acd">
                    <el-icon color="#009acd" size="22px">
                      <Timer />
                    </el-icon>等待
                  </div>
                </template>
              </div> -->
              <div class="content cursor_pointer intervalVertical" @click="() => getContestById(item)">
                <el-row>
                  <div class="cidFlag artFont bold">&nbsp;#{{ item.CID }}&nbsp;</div>
                  <div class="title artFont bold">
                    {{ item.Title }}
                  </div>
                  <div class="ctype ctypeICPC bold" v-if="item.Type == 1">
                    ICPC
                  </div>
                  <div class="ctype ctypeOI bold" v-else>
                    OI
                  </div>
                  <row v-if="item.IsPublic == 1" class="openType openTypeEnabled bold">
                    <el-icon>
                      <Unlock />
                    </el-icon> 公开
                  </row>
                  <row v-else class="openType openTypedisabled bold">
                    <el-icon>
                      <Lock />
                    </el-icon> 加密
                  </row>
                </el-row>
                <div class="contestInfo interval">
                  创建者：{{ item.UID }}
                  <el-divider direction="vertical" />
                </div>
                {{ proxy.Utils.TimeTools.timestampToTime(item.BeginTime) }}
                - {{ proxy.Utils.TimeTools.timestampToTime(item.EndTime) }}
                <el-divider direction="vertical" />
                时长：
                {{ proxy.Utils.TimeTools.timeIntervalToTime(item.EndTime, item.BeginTime) }}
              </div>
            </div>
          </div>
          <div class="pagination">
            <el-pagination background layout="prev, pager, next" :page-size="config.limit" :total="config.Count"
              :current-page="config.currentPage" @current-change="config.changePage" />
            <!-- <el-radio-group v-model="config.limit" @change="config.changePage(1)" style="margin: 0 20px">
              <el-radio-button :label="20" />
              <el-radio-button :label="30" />
              <el-radio-button :label="50" />
            </el-radio-group> -->
          </div>
        </div>
        <div class="notFound" v-show="contests.list.length == 0">
          <el-empty description="未找到结果" />
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script lang="ts" setup name="Contests">
import { getCurrentInstance, onMounted, reactive } from "vue";
import { usePageBufferedDataStore } from "../pinia/pageBufferdData";
const { proxy } = getCurrentInstance() as any;
const pageBufferedDataStore = usePageBufferedDataStore();

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
      proxy.codeProcessor(
        data?.code ?? 100001,
        data?.msg ?? "服务器错误\\\\error"
      );
    });

  //同步服务器时间
  proxy.getServerTime().then((res: any) => {
    let now = Date.now();
    if (res.time == null || Math.abs(res.time - now) < 1500) {
      return;
    }
    config.serverTime = res.time;
  });
}

//跳转竞赛
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
  pageBufferedDataStore.setContestRouterData(contest.CID, contest.IsPublic);
  proxy.$router.push({
    name: "Contest",
    params: {
      CID: contest.CID,
    },
  });
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
.mainContainer {
  align-self: center;
  width: min(90%, 900px);
}

.title {
  font-size: $fontSize8;
}

.interval {
  margin: 16px 0 0 0;
}

.intervalVertical {
  margin: 0 0 0 10px;
}

.ctype {
  padding: 3px 7px 0px 7px;
  margin: 2px 2px 2px 10px;
  border-radius: 6px;
  color: #fff;
}

.ctypeICPC {
  background-color: #E67E22;
}

.ctypeOI {
  background-color: #9D3DCF;
}

.openType {
  padding: 3px 7px 0px 7px;
  margin: 2px 2px 2px 10px;
  border-radius: 6px;
  color: #fff;
}

.openTypeEnabled {
  background-color: rgb(0, 184, 0);
}

.openTypedisabled {
  background-color: rgb(255, 49, 49);
}

.main {
  // width: 100%;
  // height: 1200px;
  // margin: 20px 0 0 0;
  // background-color: #fff;
  // border: 1px solid #ddd;
  // padding: 16px;
  // border-radius: 8px;
  // // float: left;
  // // display: flex;
  // // justify-content: space-between;
  // box-sizing: border-box;
  // font-size: $fontSize3;
}

#LID {
  font-size: $fontSize6;
}

#Title {
  font-size: $fontSize8;
}


.contest {
  width: 100%;
  box-sizing: border-box;
  padding: 16px;
  // padding: $page_outerPaddingTop $page_outerPaddingLeft;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  .top {
    width: 100%;
    border-radius: 10px;

    .list {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      box-sizing: border-box;
      padding: 0px;

      .item {
        background-color: #F2F3F5;
        width: 100%;
        height: 110px;
        box-sizing: border-box;
        padding: 0 10px 0 0;
        margin: 5px 0;
        border-radius: 8px;
        // @include border(2px, solid, "border3");
        display: flex;
        align-items: center;
        transition-duration: 100ms;

        &:hover {
          @include fill_color("fill15");
          @include border(2px, solid, "fill12");
        }

        &:hover>.goingFlag {
          width: 22px;
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
      }
    }

    .pagination {
      margin: 25px 0 0 0;
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