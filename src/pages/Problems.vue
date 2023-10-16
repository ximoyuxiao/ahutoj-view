<template>
  <div class="problems">
    <div class="left">
      <div class="search">
        <!-- 根据pid -->
        <IconInput v-model="search.PID" placeholder="题目 ID" type="text">
          <template v-slot:icon>
            <el-icon size="22px" @click="getProblemById()">
              <Aim />
            </el-icon>
          </template>
        </IconInput>
        <!-- 根据title -->
        <!-- <Input
          v-model="search.Title"
          placeholder="题目标题"
          type="text"
        > -->
        <!-- </Input> -->
        <!-- 根据平台PType -->
        <div class="option">
          <div class="label">平台</div>
          <el-select v-model="search.PType" class="m-2" placeholder="Select" @change="getProblems()">
            <el-option v-for="item in search.PTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </div>
        <!-- 根据标签 -->
        <div class="option">
          <div class="label">标签</div>
          <div>

          </div>
        </div>
      </div>
      <div class="info">
        <div class="count">搜索到 {{ config.Count }} 个题目</div>
      </div>
    </div>
    <div class="right" ref="searchResult">
      <div class="notFound" v-if="search.Data.length == 0">
        <el-empty description="未找到结果" />
      </div>
      <div class="list">
        <div class="item" v-for="(item, index) in search.Data" :key="index">
          <div class="title cursor_pointer" @click="() => getProblemById(item.PID)">
            {{ item.PID }}&nbsp;-&nbsp;{{ item.Title }}
          </div>
          <div class="tag" v-if="item.Label.length > 0">
            <el-tag v-for="major in item.Label.split(';')" :key="major">
              {{ major }}
            </el-tag>
          </div>
          <div class="tag" v-else>
            <el-tag type="info">
              暂无标签
            </el-tag>
          </div>
        </div>
      </div>
      <div class="pagination">
        <el-pagination background layout="prev, pager, next" :page-size="config.limit" :total="config.Count"
          :current-page="config.currentPage" @current-change="config.changePage" />
        <el-radio-group v-model="config.limit" @change="config.changePage(1)" style="margin: 0 20px">
          <el-radio-button :label="20" />
          <el-radio-button :label="30" />
          <el-radio-button :label="50" />
        </el-radio-group>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup name = "Problems">
import { onMounted, getCurrentInstance, reactive } from "vue";
import IconInput from "../components/MyComponents/IconInput.vue";
import Input from "../components/MyComponents/Input.vue";
const { proxy } = getCurrentInstance() as any;

//页面配置
type configType = {
  Count: number;
  currentPage: number;
  limit: number;
  loading: any;
  [item: string]: any;
};
var config = reactive<configType>({
  Count: 0,
  currentPage: 1,
  limit: 20,
  loading: null,
  init() {
    config.Count = 0;
    config.currentPage = 1;
    config.limit = 20;
    config.loading = null;
  },
  //切换页面
  changePage: (page: number) => {
    config.currentPage = page;
    SyncUrl();
    getProblems();
  },
});

//页面数据 页面搜索数据配置项
type searchType = {
  PID: string;
  PType: string;
  PTypeOptions: { label: string; value: string }[];
  Title: string;
  Label: string;
  Data: { PID: string; Title: string; Label: string }[];
  [item: string]: any;
};
var search = reactive<searchType>({
  PID: null,
  PType: "",
  PTypeOptions: [
    { label: "全部", value: "" },
    { label: "AHUT", value: "LOCAL" },
    { label: "CodeForce", value: "CODEFORCES" },
    { label: "ATCoder", value: "ATCODERTYPE" },
  ],
  Title: "",
  Label: null,
  Data: [],
  init() {
    search.PID = null;
    search.Title = "";
    search.Data = [];
  },
});

//初始化
function init() {
  config.init();
  search.init();
  //获取url参数
  if (proxy.$route.query.Page) config.currentPage = proxy.$route.query.Page - 0;
  if (proxy.$route.query.Limit) config.limit = proxy.$route.query.Limit - 0;
  if (proxy.$route.query.Title) search.Title = proxy.$route.query.Title;
  if (proxy.$route.query.Label) search.Label = proxy.$route.query.Label;
  //获取题目列表
  getProblems();
}

//获取题目列表
function getProblems() {
  //显示加载效果
  config.loading = proxy.elLoading({
    node: proxy.$refs.searchResult,
  });
  let PType = search.PType;
  PType = PType ?? null;
  //开始获取数据
  proxy
    .$get("api/problem/list", {
      Page: config.currentPage - 1,
      Limit: config.limit,
      PType,
    })
    .then((res: any) => {
      let data = res.data;
      if (data.code == 0) {
        // proxy.$log(data);
        config.Count = data.Count;
        search.Data = data.Data;
      }
      proxy.codeProcessor(
        data?.code ?? 100001,
        data?.msg ?? "服务器错误\\\\error"
      );
      //关闭加载效果
      config.loading.close();
    });
}

//id搜索跳转
function getProblemById(PID?: string) {
  search.PID = PID ?? search.PID;
  if (!search.PID) {
    proxy.elMessage({
      message: "题目 ID 无效",
      type: "warning",
    });
    return;
  }
  proxy.$router.push({
    name: "Problem",
    params: {
      PID: search.PID,
    },
  });
}

//用于同步浏览器url
function SyncUrl() {
  //仅用于展示实时url，可用于复制跳转
  proxy.$router.replace({
    path: "/Problems",
    query: {
      Page: config.currentPage,
      Limit: config.limit,
      Title: search.Title ?? undefined,
      PType: search.PType,
      Label: search.Label,
    },
  });
}

onMounted(() => {
  //初始化页面
  init();
});
</script>

<style  scoped lang="scss">
.problems {
  width: 100%;
  box-sizing: border-box;
  padding: $page_outerPaddingTop $page_outerPaddingLeft;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  .left {
    width: $problems_leftWidth;

    >div {
      &:hover {
        @include fill_color("fill14");
        @include box_shadow(0, 0, 3px, 1px, "fill12");
      }
    }

    .search {
      width: 100%;
      @include fill_color("fill2");
      border-radius: 10px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      >.option {
        width: 100%;
        box-sizing: border-box;
        padding: 8px;
        display: flex;
        align-items: center;
        font-size: $fontSize5;
        @include font_color("font1");

        .label {
          width: fit-content;
          box-sizing: border-box;
          padding: 0 4px;
        }
      }
    }

    .info {
      margin-top: $modelDistance;
      width: 100%;
      @include fill_color("fill2");
      border-radius: 10px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      .count {
        box-sizing: border-box;
        padding: 10px;
        font-size: $fontSize5;
        @include font_color("font1");
      }
    }
  }

  .right {
    width: calc(100% - $problems_leftWidth - $modelDistanceMini - $modelDistanceMini );
    @include fill_color("fill2");
    border-radius: 10px;

    .notFound {
      width: 100%;
      height: 300px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .list {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      box-sizing: border-box;
      padding: 5px;

      .item {
        width: 100%;
        box-sizing: border-box;
        padding: 3px 10px;
        margin: 5px 0;
        border-radius: 8px;
        @include border(2px, solid, "border3");
        display: flex;
        flex-direction: column;
        transition-duration: 300ms;

        &:hover {
          @include fill_color("fill15");
          @include border(2px, solid, "fill12");
        }

        .title {
          width: fit-content;
          font-size: $fontSize7;
          @include font_color("font1");
        }

        .tag {
          margin: 5px 0;

          >span {
            margin: 1px 1px;
          }
        }

        .acCount {
          font-size: $fontSize5;
          @include font_color("font2");
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
}
</style>