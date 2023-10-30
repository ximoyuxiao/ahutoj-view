<script lang="ts" setup>
import { inject, onMounted, reactive } from "vue";
import Input from "../MyComponents/Input.vue";
var config = inject("config") as any;
//来自父组件的query数据，在mounted时根据这个数据同步一次
const props = defineProps(["query"]);
//暂存的查询数据，在点击查询后才同步到真实查询参数中
var query = reactive({
  PID: "",
  UID: "",
  CID: "",
  Lang: -1,
  Result: "不限",
});

onMounted(() => {
  //初始化
  query.PID = props.query.PID;
  query.UID = props.query.UID;
  query.Lang = props.query.Lang;
  query.Result = props.query.Result;
});
</script>

<template>
  <div class="statusSearch">
    <div class="left">
      <div class="options">
        <div class="label">题目</div>
        <el-input class="Input" v-model="query.PID" placeholder="题目ID" type="text" @click="config.search(query)">
        </el-input>
      </div>
      <div class="options">
        <div class="label">用户</div>
        <el-input class="Input" v-model="query.UID" placeholder="用户ID" type="text" @click="config.search(query)">
        </el-input>
      </div>
      <div class="options">
        <div class="label">语言</div>
        <div class="input">
          <el-radio-group v-model="query.Lang">
            <el-radio-button :label="-1">不限</el-radio-button>
            <!-- <el-radio-button :label="1">C</el-radio-button> -->
            <!-- <el-radio-button :label="2">C++</el-radio-button> -->
            <el-radio-button :label="3">C++11</el-radio-button>
            <el-radio-button :label="4">C++17</el-radio-button>
            <el-radio-button :label="5">Java</el-radio-button>
            <el-radio-button :label="6">Python3</el-radio-button>
          </el-radio-group>
        </div>
      </div>
      <div class="options">
        <div class="label">结果</div>
        <div class="input">
          <el-radio-group v-model="query.Result">
            <el-radio-button label="不限"></el-radio-button>
            <el-radio-button label="AC"></el-radio-button>
            <el-radio-button label="WA"></el-radio-button>
            <el-radio-button label="TLE"></el-radio-button>
            <el-radio-button label="MLE"></el-radio-button>
            <el-radio-button label="RE"></el-radio-button>
            <el-radio-button label="OLE"></el-radio-button>
            <el-radio-button label="CE"></el-radio-button>
            <el-radio-button label="JUDGING"></el-radio-button>
            <el-radio-button label="REJUDGING"></el-radio-button>
            <el-radio-button label="PENDING"></el-radio-button>
            <el-radio-button label="FAILED"></el-radio-button>
          </el-radio-group>
        </div>
      </div>
    </div>
  </div>
  <el-button class="cursor_pointer searchButton" @click="config.search(query)" type="primary" round>
    查询
  </el-button>
</template>


<style lang="scss" scoped>
.searchButton {
  width: calc(100% - 90px);
  height: 40px;
  font-size: $fontSize6;
  align-self: center;
  align-content: center;
  box-sizing: border-box;
  padding: 5px 0;
  margin: 0 40px 16px 40px;
  transition-duration: 300ms;
}

.statusSearch {
  display: flex;
  justify-content: space-between;
  margin-bottom: $modelDistanceMini;

  .left {
    // width: calc(100% - 120px - $modelDistanceMini);
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    // @include fill_color("fill2");
    border-radius: 10px;
    transition-duration: 200ms;

    .options {
      margin: 4px;
      display: flex;
      align-items: center;

      >.label {
        width: 80px;
        text-align: right;
        font-size: $fontSize7;
        @include font_color("font1");
        box-sizing: border-box;
        padding: 0 10px;
      }

      >.input {
        width: calc(100% - 80px);
      }
    }
  }
}
</style>