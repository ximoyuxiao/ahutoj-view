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
    <div style="display: flex; justify-content: flex-end; padding: 10px 0">
      <el-button
        plain
        v-on:click="complete()"
      >添加</el-button>
    </div>
  </div>
</template>

<script>
import { getCurrentInstance, reactive } from 'vue'
export default {
  name: 'AddProblem',
  setup() {
    const { proxy } = getCurrentInstance()

    var problem = reactive({
      PID: 0,
      Title: '',
      Description: '',
      Input: '',
      Output: '',
      SampleInput: '',
      SampleOutput: '',
      LimitTime: 0,
      LimitMemory: 0,
      Hit: '',
      Label: '',
      init() {
        this.PID = 0
        this.Title = ''
        this.Description = ''
        this.Input = ''
        this.Output = ''
        this.SampleInput = ''
        this.SampleOutput = ''
        this.LimitTime = 0
        this.LimitMemory = 0
        this.Hit = ''
        this.Label = ''
      },
    })

    function complete() {
      proxy.$axios
        .post('api/problem/add/', {
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
        })
        .then((res) => {
          let data = res.data
          if (data.code == 0) {
            proxy.elMessage({ message: '添加成功!', type: 'success' })
          } else {
            proxy.codeProcessor(data.code)
          }
        })
    }

    return {
      problem,
      complete,
    }
  },
}
</script>

<style scoped lang="scss">
.addProblem {
  width: 100%;
}

.addProblem > div {
  display: flex;
  align-content: center;
  box-sizing: border-box;
  margin: 5px 0;
}

.addProblem > div > span {
  font-size: 22px;
  width: 150px;
  @include font_color('font1');
}
</style>