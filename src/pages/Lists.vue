<script lang="ts" setup>
import { reactive } from "vue";
import { getCurrentInstance } from "vue";
const { proxy } = getCurrentInstance() as any;

var config = reactive({
  search: null,
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
  <el-container class="Main Bottom Top">
    <el-aside>
      <el-main class="Container">
        <el-row class="Row">
          <span class="FontSize16 Bold DarkGray">题单 ID</span>
          <el-input
            v-model="config.search"
            placeholder="e.g. 1000"
            type="text"
            class="Left goToListInput input-with-select"
          >
            <template #append>
              <el-button
                v-on:click="getListByLID()"
                type="primary"
                class="goToProblemButton Bold"
              >
                跳转
              </el-button>
            </template>
          </el-input>
        </el-row>
      </el-main>
    </el-aside>
    <el-container class="Left">
      <el-main class="Container">
        <div class="ProblemList">
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
                        class="FontSize14 Bold"
                      >#{{ item.LID }}&nbsp;-&nbsp;</div>
                      <div
                        id="Title"
                        class="FontSize18 Bold  Bold"
                      >{{ item.Title }}</div>
                      <div class="FontSize14 ltype ltypeOffcial Bold" style="line-height: 24px;">
                        官方
                      </div>
                    </el-row>
                    <!-- <div id="UID">创建者：{{ item.UID }}</div> -->
                    <div class="Time">{{ proxy.Utils.TimeTools.timestampToTime(item.StartTime) }}</div>
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
                <!-- <el-radio-group
                  v-model="config.limit"
                  @change="config.changePage(1)"
                  style="margin: 0 20px"
                >
                  <el-radio-button :label="20" />
                  <el-radio-button :label="30" />
                  <el-radio-button :label="50" />
                </el-radio-group> -->
              </div>
            </div>
          </div>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<style  scoped lang="scss">
span {
  line-height: 30px;
}

.goToListInput {
  border-radius: 5px 0 0 5px;
  width: 195px;
}

.searchButton {
  margin: 0 0 0 10px;
  padding: 0px 20px 0px 20px;
  border-radius: 5px;
  font-weight: bold;
}

.Time {
  margin: 4px 0 4px 0;
}

.ltype {
  padding: 0 8px;
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

    .content {
      width: 100%;

      .list {
        width: 100%;
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
        padding: 10px;

        .item {
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
        }
      }

      .pagination {
        margin: 12px 0 -12px 0;
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