<script lang="ts" setup name = "Problems">
import { onMounted, getCurrentInstance, reactive } from "vue";
import { Promotion } from '@element-plus/icons-vue'
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
    { label: "Local", value: "LOCAL" },
    { label: "CodeForce", value: "CODEFORCES" },
    { label: "AtCoder", value: "ATCODERTYPE" },
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
      Label: search.Label,
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

function getProblemByLabel(Label?: string) {
  search.Label = Label ?? search.Label;
  // if (!search.Label) {
  //   proxy.elMessage({
  //     message: "标签无效",
  //     type: "warning",
  //   });
  //   return;
  // }
  getProblems();
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

<template>
  <el-container class="Main Top Bottom">
    <el-aside class="Aside">
      <el-container
        direction="vertical"
        class="AsideContainer"
      >
        <el-main class="Container gotoProblemContainer">
          <el-row class="Row">
            <span class="FontSize16 Bold DarkGray">题目 ID</span>
            <el-input
              v-model="search.PID"
              placeholder="e.g. P1000"
              type="text"
              class="Left goToProblemInput input-with-select"
            >
              <template #append>
                <el-button
                  v-on:click="getProblemById()"
                  type="primary"
                  class="goToProblemButton Bold"
                >
                  跳转
                </el-button>
              </template>
            </el-input>
          </el-row>
        </el-main>
        <el-main class="Container filterContainer Top">
          <el-row class="Row">
            <span class="FontSize16 Bold DarkGray">题库</span>
            <el-select
              v-model="search.PType"
              class="Left problemBankSelect"
              placeholder="Select"
              @change="getProblems()"
            >
              <el-option
                v-for="item in search.PTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-row>
          <el-row class="Row2 Top">
            <span class="FontSize16 Bold DarkGray">标签</span>
            <!-- <el-select class="Left">

            </el-select> -->
            <el-input
              v-model="search.Label"
              placeholder="e.g. 图论"
              type="text"
              class="Left labelInput input-with-select"
            >
              <template #append>
                <el-button
                  v-on:click="getProblemByLabel()"
                  type="primary"
                  class="goToProblemButton Bold"
                >
                  搜索
                </el-button>
              </template>
            </el-input>
          </el-row>
        </el-main>
      </el-container>
    </el-aside>
    <el-container class="Left Bottom" direction="vertical">
      <!-- <el-main class="Container Bottom">
        <el-row :gutter="12">
          <el-col
            v-for="(item, index) in search.data"
            style="margin-bottom: 12px;"
            :span="12"
            :key="index"
            class="item cursor_pointer"
            @click="() => getProblemById(item.PID)"
          >
            1
            <div class="FontSize16">
              {{ item.PID }}&nbsp;{{ item.Title }}
            </div>
            <div
              class="tag"
              v-if="item.Label.length > 0"
            >
              <el-tag
                v-for="major in item.Label.split(/;| /)"
                :key="major"
              >
                {{ major }}
              </el-tag>
            </div>
          </el-col>
        </el-row>
      </el-main> -->
      <el-main class="Container">
        <div
          class="notFound"
          v-if="search.Data.length == 0"
        >
          <el-empty description="未找到结果" />
        </div>
        <div
          class="info"
          v-else
        >
          <div class="count">检索到 {{ config.Count }} 个题目</div>
        </div>
        <div class="list">
          <div
            class="item cursor_pointer"
            v-for="(item, index) in search.Data"
            :key="index"
            @click="() => getProblemById(item.PID)"
          >
            <div class="FontSize18 Bold DarkGray">
              {{ item.PID }}&nbsp;-&nbsp;{{ item.Title }}
            </div>
            <div
              class="tag"
              v-if="item.Label.length > 0"
            >
              <el-tag
                v-for="major in item.Label.split(/;| /)"
                :key="major"
              >
                {{ major }}
              </el-tag>
            </div>
            <div
              class="tag"
              v-else
            >
              <el-tag type="info">
                暂无标签
              </el-tag>
            </div>
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
      </el-main>
    </el-container>
  </el-container>
</template>

<style  scoped lang="scss">
.Main {
  .Aside {
    width: 310px;

    .AsideContainer {
      .gotoProblemContainer {
        .Row {
          span {
            line-height: 30px;
          }

          .goToProblemInput {
            border-radius: 5px 0 0 5px;
            width: 195px;
          }

          .goToProblemButton {
            // border-radius: 0 5px 5px 0;
            // width: 100px;
          }
        }
      }

      .filterContainer {
        .Row {
          span {
            line-height: 30px;
          }

          .problemBankSelect {
            // width: 190px;
          }
        }

        .Row2 {
          span {
            line-height: 30px;
          }

          .labelInput {
            width: 218px;
          }
        }
      }
    }
  }
}

el-aside {
  // height: 100%;
}

span {
  box-sizing: border-box;
}

.searchButton {
  // @include border(2px, solid, "border3");
  // padding: 6px;
  // border-radius: 4px;
  // margin: 0 0 0 10px;
  // margin-top: 10px;
  // height: 30px;
  margin: 0 0 0 10px;
  padding: 0px 20px 0px 20px;
  border-radius: 5px;
  font-weight: bold;
  // display: inline-block;
}

.Main {
  .Container {

    .search {
      >.option {
        width: 100%;
        box-sizing: border-box;
        padding: 8px;
        display: flex;
        align-items: center;
        font-size: $fontSize5;
        @include font_color("font1");

        .label {
          width: 90px;
          box-sizing: border-box;
          padding: 0 4px;
        }
      }
    }

    .info {
      // margin-top: $modelDistance;
      // width: 100%;
      // margin: 0 5px;
      // @include fill_color("fill2");
      // @include border(1px, solid, "border3");
      // border-radius: 8px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      .count {
        box-sizing: border-box;
        padding: 3px;
        font-size: $fontSize5;
        @include font_color("font1");
      }
    }
  }

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
      @include border(1px, solid, "border3");
      display: flex;
      flex-direction: column;
      transition-duration: 200ms;
      background-color: #F2F3F5;

      &:hover {
        @include fill_color("fill15");
        @include border(1px, solid, "fill12");
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
    margin: 4px 0 0 0;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    justify-items: center;
  }

  // }
}
</style>