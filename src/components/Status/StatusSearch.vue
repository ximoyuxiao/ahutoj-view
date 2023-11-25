<script lang="ts" setup>
import { inject, onMounted, reactive, ref } from "vue";
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

// const value = ref('');

const options = [
  {
    value: '不限',
    label: '不限',
  },
  {
    value: 'AC',
    label: 'AC',
  },
  {
    value: 'WA',
    label: 'WA',
  },
  {
    value: 'TLE',
    label: 'TLE',
  },
  {
    value: 'MLE',
    label: 'MLE',
  },
  {
    value: 'RE',
    label: 'RE',
  },
  {
    value: 'OLE',
    label: 'OLE',
  },
  {
    value: 'CE',
    label: 'CE',
  },
  {
    value: 'JUDGING',
    label: 'JUDGING',
  },
  {
    value: 'REJUDGING',
    label: 'REJUDGING',
  },
  {
    value: 'PENDING',
    label: 'PENDING',
  },
  {
    value: 'FAILED',
    label: 'FAILED',
  },
]

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
        <el-input
          class="Input"
          v-model="query.PID"
          placeholder="题目ID"
          type="text"
          @click="config.search(query)"
        >
        </el-input>
      </div>
      <div class="options">
        <div class="label">用户</div>
        <el-input
          class="Input"
          v-model="query.UID"
          placeholder="用户ID"
          type="text"
          @click="config.search(query)"
        >
        </el-input>
      </div>
      <div class="options">
        <div class="label">语言</div>
        <div class="input">
          <el-radio-group v-model="query.Lang">
            <el-radio-button :label="-1">不限</el-radio-button>
            <el-radio-button :label="1">C</el-radio-button>
            <!-- <el-radio-button :label="2">C++</el-radio-button> -->
            <el-radio-button :label="3">C++11</el-radio-button>
            <el-radio-button :label="4">C++17</el-radio-button>
            <!-- <el-radio-button :label="5">Java</el-radio-button> -->
            <el-radio-button :label="6">Python3</el-radio-button>
          </el-radio-group>
        </div>
      </div>
      <div class="options">
        <div class="label">结果</div>
        <el-select
          v-model="query.Result"
          placeholder="Select"
          class="Input"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <!-- <div class="input">
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
        </div> -->
      </div>
      <el-button
        class="searchButton FontSize18"
        @click="config.search(query)"
        type="primary"
        round
      >
        查&nbsp;询
      </el-button>
    </div>
  </div>
</template>


<style lang="scss" scoped>
.searchButton {
  margin: 10px 0 0 32px;
  height: 40px;
  padding: 0px 20px 0px 20px;
  border-radius: 5px;
  font-weight: bold;
  width: 354px;
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
}</style>