<template>
  <div
    class="code"
    ref="code"
  >
    <div
      class="submit"
      v-show="!notFound"
    >
      <div class="header">
        <div style="width: 120px">题目ID</div>
        <div style="width: 120px">状态</div>
        <div style="width: 140px">语言</div>
        <div style="width: 120px">用时</div>
        <div style="width: 120px">内存</div>
        <div style="width: 180px">提交时间</div>
      </div>
      <div class="item">
        <div
          class="PID cursor_pointer"
          style="width: 120px; color: var(--font_color32)"
          @click="goToProblem(submit.PID)"
        >
          {{ submit.PID }}
        </div>
        <div
          class="res"
          :style="
        'width: 120px; color: #ffffff; background-color:' +
        proxy.Utils.StatusConstValManager.getStatusColor(submit.Result)"
        >
          {{ submit.Result }}

        </div>
        <div style="width: 140px">
          {{ proxy.Utils.StatusConstValManager.getLangString(submit.Lang) }}
        </div>
        <div
          class="useTime"
          style="width: 120px"
        >
          {{ submit.UseTime }}
        </div>
        <div
          class="useMemory"
          style="width: 120px"
        >
          {{ submit.UseMemory }}
        </div>
        <div
          class="submitTime"
          style="width: 180px"
        >
          {{ proxy.Utils.TimeTools.timestampToTime(submit.SubmitTime) }}
        </div>
      </div>
      <div class="title">代码</div>
      <el-input
        v-model="submit.Source"
        :autosize="{ minRows: 5 }"
        readonly
        show-word-limit
        type="textarea"
      />
    </div>
    <div
      class="notFound"
      v-show="notFound"
    >
      <el-empty description="无结果" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { getCurrentInstance, onMounted, reactive, ref } from 'vue'
import { useStore } from 'vuex'
const { proxy } = getCurrentInstance() as any
const store = useStore()

var notFound = ref(true)

type configType = {
  SID: number
  loading: any
  [i: string]: any
}
var config = reactive<configType>({
  SID: -1,
  loading: null,
  init() {
    config.SID = -1
    config.loading = null
  },
})

type submitType = {
  Lang: number
  PID: number
  Result: string
  SID: number
  Source: string
  SubmitTime: number
  UseMemory: number
  UseTime: number
  [i: string]: any
}
var submit = reactive<submitType>({
  Lang: 1,
  PID: 0,
  Result: '',
  SID: 1,
  Source: '',
  SubmitTime: 0,
  UseMemory: 0,
  UseTime: 0,
  copy(data: any) {
    submit.Lang = data.Lang
    submit.PID = data.PID
    submit.Result = data.Result
    submit.SID = data.SID
    submit.Source = data.Source
    submit.SubmitTime = data.SubmitTime
    submit.UseMemory = data.UseMemory
    submit.UseTime = data.UseTime
  },
})

//获取数据
function getSubmit() {
  config.loading = proxy.elLoading({ node: proxy.$refs.code })
  if (config.SID == -1) return
  proxy.$get('api/submit/' + config.SID).then((res: any) => {
    let data = res.data
    if (data.code == 0) {
      console.log(data)
      submit.copy(data)
      notFound.value = false
    }
    config.loading.close()
    proxy.codeProcessor(data.code)
  })
}

//跳转到题目
function goToProblem(PID: number | string) {
  proxy.$router.push({
    path: '/Problem',
    query: {
      PID,
    },
  })
}

onMounted(() => {
  //同步url参数
  if (proxy.$route.query.SID) config.SID = proxy.$route.query.SID - 0
  getSubmit()
})
</script>

<style  scoped lang="scss">
.notFound {
  width: 100%;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.submit {
  border-radius: 10px;
  box-sizing: border-box;
  padding: $status_listPadding;

  .header {
    display: flex;
    align-items: center;
    font-size: $fontSize8;
    @include font_color('font1');
    border-bottom: 2px solid #fefefe;
    padding: 10px 0;
    justify-content: space-between;
  }

  .item {
    display: flex;
    align-items: center;
    font-size: $fontSize6;
    @include font_color('font2');
    @include fill_color('fill2');
    justify-content: space-between;
    border-bottom: 2px solid #fefefe;
    box-sizing: border-box;

    .PID {
      @include font_color('fill11');

      &:hover {
        @include font_color('fill13');
      }
    }

    .res {
      text-align: center;
      padding: 10px 0;
      border-radius: 6px;
    }
  }

  .title {
    margin: 30px 0 5px 0;
    font-size: $fontSize8;
    @include font_color('font1');
  }
}
</style>