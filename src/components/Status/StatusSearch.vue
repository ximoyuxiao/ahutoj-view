<template>
  <div class="statusSearch">
    <div class="left">
      <div class="options">
        <div class="label">题目</div>
        <div class="input">
          <Input
            :v-model="query.PID"
            @change="query.PIDSetter"
            placeholder="题目ID"
            :onAction="config.search(query)"
            type="number"
          >
          </Input>
        </div>
      </div>
      <div class="options">
        <div class="label">用户</div>
        <div class="input">
          <Input
            :v-model="query.UID"
            @change="query.UIDSetter"
            placeholder="用户ID"
            :onAction="config.search(query)"
            type="text"
          >
          </Input>
        </div>
      </div>
      <div class="options">
        <div class="label">语言</div>
        <div class="input">
          <el-radio-group v-model="query.Lang">
            <el-radio-button :label="-1">不限</el-radio-button>
            <el-radio-button :label="1">C</el-radio-button>
            <el-radio-button :label="2">CPP</el-radio-button>
            <el-radio-button :label="3">CPP11</el-radio-button>
            <el-radio-button :label="4">CPP17</el-radio-button>
            <el-radio-button :label="5">JAVA</el-radio-button>
            <el-radio-button :label="6">PYTHON3</el-radio-button>
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
    <div
      class="right cursor_pointer"
      @click="config.search(query)"
    >
      <div>查</div>
      <div>询</div>
      <el-icon size="26px">
        <Search />
      </el-icon>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { inject, onMounted, reactive } from "vue";
import Input from "../MyComponents/Input.vue";
var config = inject("config") as any;
//来自父组件的query数据，在mounted时根据这个数据同步一次
const props = defineProps(["query"]);
//暂存的查询数据，在点击查询后才同步到真实查询参数中
var query = reactive({
  PID: null,
  UID: "",
  CID: "",
  Lang: -1,
  Result: "不限",
  PIDSetter: (value: number) => {
    query.PID = value;
  },
  UIDSetter: (value: string) => {
    query.UID = value;
  },
});

onMounted(() => {
  //初始化
  query.PID = props.query.PID;
  query.UID = props.query.UID;
  query.Lang = props.query.Lang;
  query.Result = props.query.Result;
});
</script>

<style lang="scss" scoped>
.statusSearch {
  display: flex;
  justify-content: space-between;
  margin-bottom: $modelDistanceMini;

  .left {
    width: calc(100% - 120px - $modelDistanceMini);
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    @include fill_color("fill2");
    border-radius: 10px;
    padding: 20px;
    transition-duration: 200ms;

    &:hover {
      @include fill_color("fill14");
      @include box_shadow(0, 0, 3px, 1px, "fill12");
    }
    .options {
      margin: 4px;
      display: flex;
      align-items: center;

      > .label {
        width: 80px;
        text-align: right;
        font-size: $fontSize7;
        @include font_color("font1");
        box-sizing: border-box;
        padding: 0 10px;
      }

      > .input {
        width: calc(100% - 80px);
      }
    }
  }

  .right {
    width: 120px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    @include fill_color("fill2");
    @include font_color("font3");
    font-size: $fontSize8;
    font-weight: 600;
    border-radius: 10px;
    padding: 20px;
    transition-duration: 200ms;

    &:hover {
      @include fill_color("fill14");
      @include font_color("font1");
      @include box_shadow(0, 0, 3px, 1px, "fill12");
    }

    > div {
      margin-bottom: 4px;
    }
  }
}
</style>