<template>
  <div class="problems">
    <div class="left">
      <div class="search">
        <div class="searchById">
          <input
            class="input"
            v-model="search.PID"
            placeholder="题目ID"
            @keydown.enter="getProblemsById()"
            type="number"
          />
          <div
            class="cursor_pointer"
            @click="getProblemsById()"
          >
            <el-icon size="22px">
              <Aim />
            </el-icon>
          </div>
        </div>
        <div class="searchByTitle">
          <input
            class="input"
            v-model="search.Title"
            placeholder="题目标题"
            type="text"
          />
          <div
            class="cursor_pointer"
            @click="getProblemByTitle()"
          >
            <el-icon size="22px">
              <Search />
            </el-icon>
          </div>
        </div>
      </div>
    </div>
    <div
      class="right"
      ref="searchResult"
    >
      <div
        class="notFound"
        v-if="search.Data.length == 0"
      >
        <el-empty description="未找到结果" />
      </div>
      <div class="list">
        <div
          class="item"
          v-for="(item ,index) in search.Data"
          :key="index"
        >
          <div
            class="title cursor_pointer"
            @click="() => getProblemsById(item.PID)"
          >
            {{ item.PID }}&nbsp;-&nbsp;{{ item.Title }}
          </div>
          <div
            class="tag"
            v-if="item.Label.length > 0"
          >
            <el-tag
              v-for="major in item.Label.split(';')"
              :key="major"
              :effect="store.state.themeSwitch.theme == 1 ? 'light' : 'dark'"
            >
              {{ major }}
            </el-tag>
          </div>
          <div
            class="tag"
            v-else
          >
            <el-tag
              type="info"
              :effect="store.state.themeSwitch.theme == 1 ? 'light' : 'dark'"
            >
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
    </div>
  </div>
</template>

<script lang="ts" setup name = "Problems">
import { onMounted, getCurrentInstance, reactive } from "vue";
import { useStore } from "vuex";

const { proxy } = getCurrentInstance() as any;
const store = useStore();

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
  PID: number;
  Title: string;
  Label: string;
  Data: { PID: number; Title: string; Label: string }[];
  [item: string]: any;
};
var search = reactive<searchType>({
  PID: null,
  Title: null,
  Label: null,
  Data: [],
  init() {
    search.PID = null;
    search.Title = null;
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
function getProblems(PID: number = null, Title: string = null) {
  //显示加载效果
  config.loading = proxy.elLoading({
    node: proxy.$refs.searchResult,
  });
  //开始获取数据
  proxy
    .$get(
      "api/problem/list?Page=" +
        (config.currentPage - 1) +
        "&Limit=" +
        config.limit
    )
    .then((res: any) => {
      let data = res.data;
      if (data.code == 0) {
        // proxy.$log(data);
        config.Count = data.Count;
        search.Data = data.Data;
      } else {
        proxy.codeProcessor(data.code);
      }
      //关闭加载效果
      config.loading.close();
    });
}

//id搜索
function getProblemsById(PID: number = null) {
  if (PID != null) search.PID = PID;
  if (search.PID == null || search.PID <= 0) {
    proxy.elMessage({
      message: "请输入有效的题目ID！",
      type: "warning",
    });
    return;
  }
  proxy.$router.push({
    path: "/Problem",
    query: {
      PID: search.PID,
    },
  });
}

//title搜索
function getProblemByTitle() {}

//用于同步浏览器url
function SyncUrl() {
  //仅用于展示实时url，可用于复制跳转
  proxy.$router.replace({
    path: "/Problems",
    query: {
      Page: config.currentPage,
      Limit: config.limit,
      Title: search.Title,
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

    .search {
      width: 100%;
      @include fill_color("fill2");
      border-radius: 10px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      div {
        input {
          box-sizing: border-box;
          height: 30px;
          width: calc(100% - 32px);
          padding: 2px 10px;
          border-radius: 8px;
          font-size: $fontSize5;
          @include font_color("font1");
          @include fill_color("fill4");

          &:focus,
          &:hover + div,
          &:focus + div {
            outline: none;
            border: 2px solid;
            @include border_color("fill12");
            @include font_color("fill12");
          }

          &::placeholder {
            @include font_color("font3");
          }
        }
      }
    }

    .searchById,
    .searchByTitle {
      width: 94%;
      padding: 10px 0;
      display: flex;
      align-items: center;
      justify-content: space-between;

      div {
        height: 30px;
        width: 30px;
        @include fill_color("fill4");
        box-sizing: border-box;
        border: 2px solid;
        @include border_color("border1");
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      &:hover > div {
        @include border_color("fill12");
        @include font_color("fill12");
      }
    }
  }

  .right {
    width: calc(
      100% - $problems_leftWidth - $modelDistanceMini - $modelDistanceMini
    );
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

          > span {
            margin: 0 1px;
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