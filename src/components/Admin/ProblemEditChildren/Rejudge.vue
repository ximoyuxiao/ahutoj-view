<template>
  <el-container direction="vertical">
    <el-main class="Container">
      <el-row>
        <span>Run ID</span>
        <el-input-number
          v-model="submit.SID"
          :min="0"
          class="Left"
        />
      </el-row>
      <el-row class="Top">
        <span>题目ID</span>
        <el-input
          v-model="submit.PID"
          style="width: 200px"
          class="Left"
        />
      </el-row>
      <el-row class="Top">
        <span>用户ID</span>
        <el-input
          v-model="submit.UID"
          style="width: 200px"
          class="Left"
        />
      </el-row>
      <el-row class="Top">
        <span>竞赛ID</span>
        <el-input-number
          v-model="submit.CID"
          :min="0"
          class="Left"
        />
      </el-row>
      <div class="Top">"0"或者空代表不填</div>
    </el-main>
    <el-button
      type="warning"
      v-on:click="complete()"
      class="rejudgeButton Top"
    >
      重判
    </el-button>
  </el-container>
</template>

<script lang="ts" setup>
import { getCurrentInstance, reactive } from "vue";
const { proxy } = getCurrentInstance() as any;

//题目数据
var submit = reactive({
  SID: 0,
  PID: "",
  UID: "",
  CID: 0,
  init() {
    this.SID = 0;
    this.PID = "";
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
    proxy.codeProcessor(
      data?.code ?? 100001,
      data?.msg ?? "服务器错误\\\\error"
    );
  });
}
</script>

<style scoped lang="scss">
span {
  align-self: center;
  font-size: $fontSize5;
}

.rejudgeButton {
  width: 100%;
  height: 50px;
  border-radius: 12px;
}

.Rejudge {
  width: 100%;

  >div {
    display: flex;
    align-content: center;
    justify-content: flex-start;
    box-sizing: border-box;
    margin: 5px 0;

    >span {
      display: block;
      font-size: 22px;
      width: 150px;
      @include font_color("font1");
    }
  }
}</style>