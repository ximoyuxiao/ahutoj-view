<template>
  <div class="contestStatus">
    <template v-if="config.correct">
      <div
        class="contestID cursor_pointer"
        @click="contest.backToContest"
      >
        <el-icon size="32px">
          <Back />
        </el-icon>
        <div>
          #{{config.CID}}&nbsp;-&nbsp;{{contest.info.Title}}
        </div>
      </div>
      <StatusSearch :query="query">
      </StatusSearch>
      <div class="filterByPID">
        <div class="title">按题号筛选</div>
        <div class="problemBox">
          <div
            class="problem cursor_pointer"
            v-for="(item, index) in contest.info.Data"
            :key="index"
            @click="query.queryPID(item.PID)"
          >
            {{ item.PID }}
          </div>
        </div>
      </div>

      <StatusList :data="status.list">
      </StatusList>
    </template>
    <template v-else>
      <div class="error">
        <el-result
          icon="warning"
          title="数据异常"
          sub-title="请确保当前为正常跳转，或者联系网站运维检查。"
        >
        </el-result>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup name="Status" >
import {
  getCurrentInstance,
  onBeforeMount,
  onMounted,
  provide,
  reactive,
} from "vue";
import StatusList from "../../components/Status/StatusList.vue";
import StatusSearch from "../../components/Status/StatusSearch.vue";
const { proxy } = getCurrentInstance() as any;

var loadings = {
  list: null,
};

//页面控制
var config = reactive({
  correct: false,
  //当期竞赛状态的CID
  CID: -1,
  Pass: "",
  //搜索
  search: (tempQuery: any) => {
    query.Page = 1;
    query.PID = tempQuery.PID;
    query.UID = tempQuery.UID;
    query.Lang = tempQuery.Lang;
    query.Result = tempQuery.Result;
    config.update();
  },
  //更新数据
  update: () => {
    loadings.list = proxy.elLoading({
      node: document.getElementsByClassName("statusList")[0],
    });
    let params = {};
    if (!config.CID || config.CID == -1) {
      //该页面CID参数严格
      config.correct = false;
      return;
    }
    params["CID"] = config.CID;
    if (query.Page) {
      params["Page"] = query.Page - 1;
    }
    if (query.Limit) {
      params["Limit"] = query.Limit;
    }
    if (query.PID && query.PID > 0) {
      params["PID"] = query.PID;
    }
    if (query.UID && query.UID != "") {
      params["UID"] = query.UID;
    }
    if (query.Lang && query.Lang > 0) {
      params["Lang"] = query.Lang;
    }
    if (query.Result && query.Result != "不限") {
      params["Result"] = query.Result;
    }
    proxy.$get("api/submit/status", params).then((res: any) => {
      let data = res.data;
      if (data.code == 0) {
        // proxy.$log(data);
        query.Count = data.Count;
        status.list = data.Data;
        config.syncUrl(query);
      }
      proxy.codeProcessor(data.code, data.msg);
      loadings.list.close();
    });
  },
  //同步url
  syncUrl: (query: any) => {
    let params = {};
    if (config.CID) {
      params["CID"] = config.CID;
    }
    if (config.Pass) {
      params["Pass"] = config.Pass;
    }
    if (query.Limit) {
      params["Limit"] = query.Limit;
    }
    if (query.Page) {
      params["Page"] = query.Page;
    }
    if (query.Limit) {
      params["Limit"] = query.Limit;
    }
    if (query.PID && query.PID > 0) {
      params["PID"] = query.PID;
    }
    if (query.UID && query.UID != "") {
      params["UID"] = query.UID;
    }
    if (query.Lang && query.Lang > 0) {
      params["Lang"] = query.Lang;
    }
    if (query.Result && query.Result != "不限") {
      params["Result"] = query.Result;
    }
    proxy.$router.replace({
      path: "/ContestStatus",
      query: params,
    });
  },
});

//页面查询参数
var query = reactive({
  PID: null,
  UID: "",
  Lang: -1,
  Result: "不限",
  Count: 0,
  Page: 1,
  Limit: 20,
  queryPID: (PID: number) => {
    query.PID = PID;
    config.update();
  },
  PIDSetter: (value: number) => {
    query.PID = value;
  },
  UIDSetter: (value: string) => {
    query.UID = value;
  },
});

//竞赛题目的竞赛数据
type contestType = {
  CID: number;
  Pass: string;
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
//当前竞赛信息
var contest = reactive<contestType>({
  CID: null,
  Pass: null,
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
  //检查竞赛跳转是否合理
  checkContest: async () => {
    await proxy
      .$get("api/contest/" + config.CID + "?Pass=" + config.Pass)
      .then((res) => {
        let data = res.data;
        if (data.code == 0) {
          // proxy.$log(data);
          contest.copy(data);
          config.correct = true;
        }
        proxy.codeProcessor(data.code, data.msg);
      });
  },
  //返回比赛界面
  backToContest: () => {
    let params: { Pass?: string; CID?: string } = {
      Pass: null,
      CID: null,
    };
    if (proxy.$route.query.CID) {
      params.CID = proxy.$route.query.CID;
    } else {
      proxy.elMessage({
        message: "数据异常，请重新进入比赛界面",
        type: "warning",
      });
      return;
    }
    if (proxy.$route.query.Pass) {
      params.Pass = proxy.$route.query.Pass;
    }
    proxy.$router.push({
      path: "/Contest",
      query: params,
    });
  },
});

//页面数据
type statusType = {
  list: {
    UID: string;
    Lang: number;
    PID: number;
    Result: string;
    SID: number;
    SubmitTime: number;
    UseMemory: number;
    UseTime: number;
  }[];
};
var status = reactive<statusType>({ list: [] });

provide("config", config);
provide("query", query);

onBeforeMount(() => {
  //同步url参数
  if (!proxy.$route.query.CID) {
    return;
  }
  config.CID = Number(proxy.$route.query.CID);
  config.Pass = proxy.$route.query.Pass;
  if (proxy.$route.query.Page) query.Page = Number(proxy.$route.query.Page);
  if (proxy.$route.query.Limit) query.Limit = Number(proxy.$route.query.Limit);

  if (typeof proxy.$route.query.PID != "undefined")
    query.PID = Number(proxy.$route.query.PID);
  if (typeof proxy.$route.query.UID != "undefined")
    query.UID = proxy.$route.query.UID;
  if (typeof proxy.$route.query.Result != "undefined")
    query.Result = proxy.$route.query.Result;
  if (typeof proxy.$route.query.Lang != "undefined")
    query.Lang = Number(proxy.$route.query.Lang);
});

onMounted(async () => {
  //检查跳转正确性
  await contest.checkContest();
  //检查正确再继续查询数据
  if (config.correct) {
    config.update();
  }
});
</script>

<style  scoped lang="scss">
.contestStatus {
  width: 100%;
  box-sizing: border-box;
  padding: $status_outerPaddingTop $status_outerPaddingLeft;

  > .contestID {
    margin-bottom: 30px;
    font-size: $fontSize14;
    @include font_color("font4");
    @include fill_color("fill1");
    display: flex;
    align-items: center;
    border-radius: 10px;
    width: fit-content;
    box-sizing: border-box;
    padding: 4px 16px;

    &:hover {
      @include fill_color("fill14");
      @include font_color("font2");
    }

    > div {
      margin: 0 10px;
    }
  }

  .filterByPID {
    box-sizing: border-box;
    padding: 10px 15px 15px 15px;
    @include fill_color("fill2");
    margin-bottom: $modelDistanceMini;
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 10px;

    .title {
      @include font_color("font1");
      font-size: $fontSize6;
      margin: 10px 0;
    }

    .problemBox {
      width: 100%;
      display: grid;
      grid-template-columns: repeat(8, calc(100% / 8 - 8px));
      grid-template-rows: 40px;
      grid-gap: 8px;

      > .problem {
        width: 100%;
        text-align: center;
        line-height: 40px;
        @include font_color("font2");
        @include fill_color("fill4");
        @include box_shadow(0, 0, 2px, 0, "border1");
        font-size: $fontSize4;
        border-radius: 10px;

        &:hover {
          @include font_color("font1");
          @include fill_color("fill14");
          @include box_shadow(0, 0, 2px, 0, "fill11");
        }
      }
    }
  }
}
</style>