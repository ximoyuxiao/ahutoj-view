<template>
  <div class="Rejudge">
    <div>
      <span>提交ID：</span>
      <el-input-number
        v-model="submit.SID"
        :min="0"
      />
    </div>
    <div>
      <span>题目ID：</span>
      <el-input-number
        v-model="submit.PID"
        :min="0"
      />
    </div>
    <div>
      <span>用户ID：</span>
      <el-input
        v-model="submit.UID"
        style="width: 200px"
      />

    </div>
    <div>
      <span>竞赛ID：</span>
      <el-input-number
        v-model="submit.CID"
        :min="0"
      />
    </div>
    <span>"0"或者空代表不填</span>
    <div style="display: flex; justify-content: flex-start; padding: 10px 0">
      <el-button
        plain
        type="warning"
        v-on:click="complete()"
      >
        重判
      </el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { getCurrentInstance, reactive } from "vue";
const { proxy } = getCurrentInstance() as any;

//题目数据
var submit = reactive({
  SID: 0,
  PID: 0,
  UID: "",
  CID: 0,
  init() {
    this.SID = 0;
    this.PID = 0;
    this.UID = "";
    this.CID = 0;
  },
});

//重判
function complete() {
  let params: { [item: string]: any } = {};
  if (submit.SID) params.SID = submit.SID;
  if (submit.PID) params.PID = submit.PID;
  if (submit.UID) params.UID = submit.UID;
  if (submit.CID) params.CID = submit.CID;
  proxy.$post("api/submit/rejudge/", params).then((res: any) => {
    console.log(res);
    let data = res.data;
    if (data.code == 0) {
      proxy.elMessage({ message: "重判成功!", type: "success" });
    }
    proxy.codeProcessor(data.code);
  });
}
</script>

<style scoped lang="scss">
.Rejudge {
  width: 100%;

  > div {
    display: flex;
    align-content: center;
    justify-content: flex-start;
    box-sizing: border-box;
    margin: 5px 0;

    > span {
      display: block;
      font-size: 22px;
      width: 150px;
      @include font_color("font1");
    }
  }
}
</style>