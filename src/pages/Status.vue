<template>
  <div class="status">
    <StatusSearch :query="query">
    </StatusSearch>
    <StatusList :data="status.list">
    </StatusList>
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
import StatusList from "../components/Status/StatusList.vue";
import StatusSearch from "../components/Status/StatusSearch.vue";
const { proxy } = getCurrentInstance() as any;

//页面控制
var config = reactive({
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
    let params = {};
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
    });
  },
  //同步url
  syncUrl: (query: any) => {
    let params = {};
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
      path: "/Status",
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
  PIDSetter: (value: number) => {
    query.PID = value;
  },
  UIDSetter: (value: string) => {
    query.UID = value;
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

onMounted(() => {
  //页面数据初始化
  config.update();
});
</script>

<style  scoped lang="scss">
.status {
  width: 100%;
  box-sizing: border-box;
  padding: $status_outerPaddingTop $status_outerPaddingLeft;
}
</style>