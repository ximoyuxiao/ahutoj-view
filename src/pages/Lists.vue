<script lang="ts" setup>
import { reactive } from "vue";
import { getCurrentInstance } from "vue";
const { proxy } = getCurrentInstance() as any;

var config = reactive({
  search: 1000,
  Count: 0,
  currentPage: 1,
  limit: 20,
  loading: null,
  init() {
    this.Count = 0;
    this.currentPage = 1;
    this.limit = 20;
    this.loading = null;
  },
  //切换页面
  changePage: (page: number): void => {
    config.currentPage = page;
    SyncUrl();
    problemList.getData();
  },
});

var problemList = reactive({
  list: [],
  getData: () => {
    proxy
      .$get("api/training/list", {
        Page: config.currentPage - 1,
        Limit: config.limit,
      })
      .then((res) => {
        let data = res.data;
        if (data.code === 0) {
          console.log(data);
          config.Count = data.size;
          problemList.list = data.data;
        }
        proxy.codeProcessor(
          data?.code ?? 100001,
          data?.msg ?? "服务器错误\\\\error"
        );
      });
  },
});

function getListByLID(LID?: number) {
  config.search = LID ?? config.search;
  if (!config.search) {
    proxy.elMessage({
      message: "请输入有效的题单ID！",
      type: "warning",
    });
    return;
  }
  proxy.$router.push({
    name: "List",
    params: {
      LID: config.search,
    },
  });
}
//用于同步浏览器url
function SyncUrl() {
  //仅用于展示实时url，可用于复制跳转
  proxy.$router.replace({
    path: "/Lists",
    query: {
      Page: config.currentPage,
      Limit: config.limit,
    },
  });
}

(() => {
  problemList.getData();
})();
</script>

<template>
  <el-container class="Main">
    <el-header class="Container">
      <div
        class="search"
        style="padding: 16px;"
      >
        <div style="font-size: 16px;">题单 ID</div>
        <el-input
          class="Left"
          v-model="config.search"
          placeholder="Please input"
          clearable
          style="width: 120px;"
        />
        <el-button
          v-on:click="getListByLID()"
          class="searchButton"
          type="primary"
        >
          <el-icon size="16px">
            <Position />
          </el-icon>
          &nbsp;跳转
        </el-button>
      </div>
    </el-header>
    <el-main class="Container">
      <div
        class="ProblemList"
        style="padding: 16px;"
      >
        <div class="left">
          <div class="content">
            <div class="list">
              <div
                class="item cursor_pointer"
                v-for="(item, index) in problemList.list"
              >
                <div
                  class="left"
                  @click="() => getListByLID(item.LID)"
                >
                  <el-row>
                    <div
                      id="LID"
                      class="Bold ArtFont"
                    >#{{ item.LID }}</div>&nbsp;
                    <div
                      id="Title"
                      class="Bold Title ArtFont"
                    >{{ item.Title }}</div>
                    <div class="ltype ltypeOffcial Bold">
                      官方
                    </div>
                  </el-row>
                  <div class="Interval"></div>
                  <!-- <div id="UID">创建者：{{ item.UID }}</div> -->
                  <div id="Time">{{ proxy.Utils.TimeTools.timestampToTime(item.StartTime) }}</div>
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
              <!-- <el-radio-group v-model="config.limit" @change="config.changePage(1)" style="margin: 0 20px">
                <el-radio-button :label="20" />
                <el-radio-button :label="30" />
                <el-radio-button :label="50" />
            </el-radio-group> -->
            </div>
          </div>
        </div>
      </div>
    </el-main>
    <el-footer class="Container Footer ArtFont Bottom">
      <el-row>
        Anhui University of Technology
      </el-row>
      <el-row>
        Online Judge &copy; 2019 - 2023
      </el-row>
    </el-footer>
  </el-container>
</template>

<style  scoped lang="scss">
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

.ltype {
  padding: 3px 7px 0px 7px;
  margin: 2px 2px 2px 10px;
  border-radius: 6px;
  color: #fff;
}

.ltypeOffcial {
  background-color: #E67E22;
}

#LID {
  font-size: $fontSize6;
}

.search {
  display: flex;
  align-items: center;
}

.ProblemList {

  >.left {
    width: 100%;

    .top {
      // box-sizing: border-box;
      // padding: $modelDistance $modelDistance 0 $modelDistance;


    }

    .content {
      width: 100%;

      .list {
        width: 100%;
        box-sizing: border-box;
        // padding: 0 $modelDistance 0 $modelDistance;

        .item {
          padding: 12px;
          position: relative;
          // width: 100%;
          height: 60px;
          border-radius: 6px;
          background-color: #F2F3F5;
          margin-bottom: $modelDistanceMini;
          overflow: hidden;
          // box-shadow: 0 0 2px 1px rgb(142, 142, 142);

          &:hover {
            // @include box_shadow(0, 0, 2px, 1px, "fill53");
            box-shadow: 0 0 2px 1px #409EFF;
            background-color: #EDF6FF;
            border-color: #409EFF;
            border-width: 2px;
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
  }
}
</style>