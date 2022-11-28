<template>
  <div class="ProblemList">
    <div class="left">
      <div class="top">
        <div class="search">
          <el-input
            v-model="config.search"
            placeholder="Please input"
            clearable
          />
          <el-button>
            <el-icon
              size="18px"
              style="margin: auto 15px;"
            >
              <Search />
            </el-icon>
          </el-button>
        </div>
      </div>
      <el-divider />
      <div class="content">
        <div class="list">
          <div
            class="item"
            v-for="(item,index) in ProblemList.list"
          >
            <div class="left">
              <div id="LID">#{{item.LID}}</div>
              <div id="Title">#{{item.Title}}</div>
            </div>
            <div id="cover"></div>
            <div class="right">
              <div id="Time">创建时间：{{proxy.Utils.TimeTools.timestampToTime(item.StartTime)}}</div>
              <div id="UID">创建者：{{item.UID}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="right">

    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive } from "vue";
import { getCurrentInstance } from "vue";
const { proxy } = getCurrentInstance() as any;

var config = reactive({
  search: "",
});

//页面数据
var ProblemList = reactive({
  //提单列表
  list: [
    {
      LID: 1000,
      UID: "11111",
      Title: "测试题单1",
      StartTime: 1688995545665,
    },
    {
      LID: 1001,
      UID: "11111",
      Title: "测试题单2",
      StartTime: 1688995545999,
    },
    {
      LID: 1002,
      UID: "11111",
      Title: "测试题单3",
      StartTime: 1688995559888,
    },
  ],
});

function getProblemsList() {
  proxy.$get("api/training/list", { Page: 0, Limit: 20 }).then((res) => {
    console.log(res);
  });
}

onMounted(() => {
  getProblemsList();
});
</script>

<style  scoped lang="scss">
.ProblemList {
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
  padding: $problemList_outerPaddingTop $problemList_outerPaddingLeft;

  > .left {
    width: calc(100% - $problemList_rightWidth - $modelDistance);
    @include fill_color("fill2");
    border-radius: 10px;
    overflow: hidden;
    .top {
      box-sizing: border-box;
      padding: $modelDistance $modelDistance 0 $modelDistance;

      .search {
        display: flex;
        align-items: center;
      }
    }

    .content {
      width: 100%;

      .list {
        width: 100%;
        box-sizing: border-box;
        padding: 0 $modelDistance $modelDistance $modelDistance;

        .item {
          position: relative;
          width: 100%;
          border-radius: 6px;
          @include fill_color("fill4");
          margin-bottom: $modelDistanceMini;
          overflow: hidden;

          &:hover {
            @include box_shadow(0, 0, 2px, 1px, "fill53");
          }

          &:hover > .right {
            transform: translateY(0);
          }

          &:hover > .left > #Title {
            transform: translateX(20px);
            @include font_color("fill12");
            filter: drop-shadow(0 0 1px #cdcdcd88);
          }

          &:hover > #cover {
            transform: translateX(0);
          }

          > .left {
            width: 100%;

            > #LID {
              padding: 5px 10px;
              font-size: $fontSize4;
              @include font_color("font3");
            }

            > #Title {
              padding: 10px 0 30px 20px;
              font-size: $fontSize7;
              @include font_color("font1");
              transition-duration: 260ms;
              font-weight: 600;
            }
          }

          > #cover {
            position: absolute;
            right: 0;
            top: 0;
            width: 70%;
            height: 100%;
            @include linear_gradient(to left, "fill2", "fill4");
            transform: translateX(100%);
            transition-duration: 300ms;
          }

          > .right {
            position: absolute;
            right: 50px;
            top: 0;
            transform: translateY(-90px);
            transition-duration: 300ms;
            width: 300px;

            > #Time {
              padding: 5px 0;
              font-size: $fontSize6;
              @include font_color("font2");
            }
            > #UID {
              font-size: $fontSize5;
              @include font_color("font3");
            }
          }
        }
      }
    }
  }

  > .right {
    width: $problemList_rightWidth;
    @include fill_color("fill2");
    border-radius: 10px;
    overflow: hidden;
    height: 500px;
  }
}
</style>