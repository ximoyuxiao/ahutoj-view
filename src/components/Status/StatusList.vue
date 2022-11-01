 
<template>
  <div class="statusList">
    <div
      class="notFound"
      v-show="props.data.length == 0"
    >
      <el-empty description="无结果" />
    </div>
    <div
      class="list"
      v-show="props.data.length != 0"
    >
      <div class="header">
        <div style="width: 140px">提交ID</div>
        <div style="width: 120px">题目ID</div>
        <div style="width: 160px">用户</div>
        <div style="width: 120px">状态</div>
        <div style="width: 140px">语言</div>
        <div style="width: 120px">用时</div>
        <div style="width: 120px">内存</div>
        <div style="width: 180px">提交时间</div>
      </div>
      <div
        class="item"
        v-for="(item, index) in props.data"
        :key="index"
      >
        <div
          class="SID"
          style="width: 140px"
        >
          {{ item.SID }}
        </div>
        <div
          class="PID cursor_pointer"
          style="width: 120px"
          @click="goToProblem(item.PID)"
        >
          {{ item.PID }}
        </div>
        <div
          class="UID"
          style="width: 160px"
        >
          {{ item.UID.length >  15 ? (item.UID.slice(0,15) + "..." ): item.UID}}
        </div>
        <div style="width: 120px; display: flex; justify-content: center;">
          <div
            class="res cursor_pointer"
            :style="
          'color: #ffffff; background-color:' +
          proxy.Utils.StatusConstValManager.getStatusColor(item.Result)
        "
            @click="goToSeeCode(item.SID)"
          >
            {{ item.Result }}
          </div>
        </div>

        <div style="width: 140px">
          {{ proxy.Utils.StatusConstValManager.getLangString(item.Lang) }}
        </div>
        <div
          class="useTime"
          :style="'width: 120px;' + (item.Result == 'TLE' ? 'color: #ff381e;' : '')"
        >
          {{ item.UseTime }}&nbsp;ms
        </div>
        <div
          class="useMemory"
          :style="'width: 120px;' + (item.Result == 'MLE' ? 'color: #ff381e;' : '')"
        >
          {{ (item.UseMemory / 1024).toFixed(0) }}&nbsp;KB
        </div>
        <div
          class="submitTime"
          style="width: 180px"
        >
          {{ proxy.Utils.TimeTools.timestampToTime(item.SubmitTime) }}
        </div>
      </div>
      <div class="pagination">
        <el-pagination
          background
          layout="prev, pager, next"
          :page-size=" query.Limit"
          :total=" query.Count"
          :current-page=" query.Page"
          @current-change="config.changePage"
        />
        <el-radio-group
          v-model=" query.Limit"
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

<script lang="ts" setup>
import { getCurrentInstance, inject, onMounted, reactive } from "vue";
const { proxy } = getCurrentInstance() as any;
const props = defineProps(["data"]);
//传入的参数
var query = inject("query") as any;
var functions = inject("config") as any;

//本地配置项
var config = reactive({
  loading: null,
  //切换页面
  changePage: (page: number) => {
    query.page = page;
    //更新数据
    functions.update(query);
  },
});

//跳转到题目
function goToProblem(PID: number | string) {
  proxy.$router.push({
    path: "/Problem",
    query: {
      PID,
    },
  });
}

//跳转到自己提交的代码
function goToSeeCode(SID: number | string) {
  proxy.$router.push({
    path: "/Code",
    query: {
      SID,
    },
  });
}
</script>

<style lang="scss" scoped>
.statusList {
  width: 100%;

  .notFound {
    width: 100%;
    height: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .list {
    @include fill_color("fill2");
    border-radius: 10px;
    box-sizing: border-box;
    padding: $status_listPadding;

    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: $fontSize7;
      @include font_color("font1");
      border-bottom: 2px solid;
      @include border_color("border2");
      padding: 10px 0;

      > div {
        text-align: center;
      }
    }

    .item {
      display: flex;
      align-items: center;
      font-size: $fontSize5;
      @include font_color("font2");
      @include fill_color("fill3");
      justify-content: space-between;
      border-bottom: 2px solid;
      box-sizing: border-box;
      @include border_color("border2");
      transition-duration: 200ms;

      &:hover {
        @include fill_color("fill14");
      }

      .PID {
        @include font_color("fill12");
        box-sizing: border-box;
      }
      .res {
        margin: 8px 0;
        padding: 4px 10px;
        box-sizing: border-box;
        border-radius: 6px;
        width: fit-content;
        filter: drop-shadow(0 0 1px #00000088);
      }

      > div {
        text-align: center;
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