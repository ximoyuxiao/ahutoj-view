<template>
  <div class="addProblem">
    <div><span>标题：</span>
      <el-input v-model="problem.Title" />
    </div>
    <div>
      <span>题目描述：</span>
      <el-input
        v-model="problem.Description"
        type="textarea"
        autosize
      />
    </div>
    <div>
      <span>输入描述：</span>
      <el-input
        v-model="problem.Input"
        type="textarea"
        autosize
      />
    </div>
    <div>
      <span>输出描述：</span>
      <el-input
        v-model="problem.Output"
        type="textarea"
        autosize
      />
    </div>
    <div>
      <span>输入样例：</span>
      <el-input
        v-model="problem.SampleInput"
        type="textarea"
        autosize
      />
    </div>
    <div>
      <span>输出样例：</span>
      <el-input
        v-model="problem.SampleOutput"
        type="textarea"
        autosize
      />
    </div>
    <div>
      <span>时间限制：</span>
      <el-input-number
        v-model="problem.LimitTime"
        :min="1"
      />
      <span>&nbsp;毫秒</span>
    </div>
    <div>
      <span>内存限制：</span>
      <el-input-number
        v-model="problem.LimitMemory"
        :min="1"
      />
      <span>&nbsp;MB</span>
    </div>
    <div>
      <span>提示：</span>
      <el-input
        v-model="problem.Hit"
        type="textarea"
        autosize
      />
    </div>
    <div>
      <span>标签：</span>
      <el-input
        v-model="problem.Label"
        placeholder="请输入的每个标签之间用';'隔开"
      />
    </div>
    <div>
      <span>来源：</span>
      <el-select
        v-model="problem.Origin"
        class="m-2"
        placeholder="Select"
      >
        <el-option
          v-for="(item,index) in problem.Origins"
          :key="item.label"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-input
        v-show="problem.Origin != 0"
        v-model="problem.OriginPID"
        placeholder="输入题目来源OJ的PID"
      />
    </div>
    <div style="display: flex; justify-content: flex-end; padding: 10px 0">
      <el-button
        plain
        v-on:click="complete()"
      >
        添加
      </el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { getCurrentInstance, reactive } from "vue";
import { useConstValStore } from "../../../pinia/constVal";
const { proxy } = getCurrentInstance() as any;
const constValStore = useConstValStore();

//题目数据
var problem = reactive({
  PID: 0,
  Title: "",
  Description: "",
  Input: "",
  Output: "",
  SampleInput: "",
  SampleOutput: "",
  LimitTime: 0,
  LimitMemory: 0,
  Hit: "",
  Label: "",
  Origin: -1,
  OriginPID: "",
  //选项列表 const
  Origins: [
    { label: "本地", value: constValStore.PROBLEM_ORIGIN_LOCAL },
    { label: "CodeForce", value: constValStore.PROBLEM_ORIGIN_CF },
    {
      label: "AtCoder",
      value: constValStore.PROBLEM_ORIGIN_ATCODER,
    },
    { label: "洛谷", value: constValStore.PROBLEM_ORIGIN_LUOGU },
  ],
  init() {
    problem.PID = 0;
    problem.Title = "";
    problem.Description = "";
    problem.Input = "";
    problem.Output = "";
    problem.SampleInput = "";
    problem.SampleOutput = "";
    problem.LimitTime = 0;
    problem.LimitMemory = 0;
    problem.Hit = "";
    problem.Label = "";
    problem.Origin = 0;
    problem.OriginPID = "";
  },
});

//完成提交题目
function complete() {
  proxy.$axios
    .post("api/problem/add/", {
      Title: problem.Title,
      Description: problem.Description,
      Input: problem.Input,
      Output: problem.Output,
      SampleInput: problem.SampleInput,
      SampleOutput: problem.SampleOutput,
      LimitTime: problem.LimitTime,
      LimitMemory: problem.LimitMemory,
      Hit: problem.Hit,
      Label: problem.Label,
      Origin: problem.Origin,
      OriginPID: problem.OriginPID,
    })
    .then((res: any) => {
      let data = res.data;
      if (data.code == 0) {
        proxy.elMessage({ message: "添加成功!", type: "success" });
      }
      proxy.codeProcessor(data.code);
    });
}
</script>

<style scoped lang="scss">
.addProblem {
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