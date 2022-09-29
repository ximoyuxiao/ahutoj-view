<template>
  <div class="status">
    <div
      class="list"
      v-show="status.list.length != 0"
    >
      <div class="header">
        <div style="width: 120px">题目ID</div>
        <div style="width: 100px">状态</div>
        <div style="width: 140px">语言</div>
        <div style="width: 100px">用时</div>
        <div style="width: 100px">内存</div>
        <div style="width: 180px">提交时间</div>
      </div>
      <div
        class="item"
        v-for="(item, index) in status.list"
        :key="index"
      >
        <div
          class="PID cursor_pointer"
          style="width: 120px; color: var(--font_color32); margin-left: 10px"
          @click="goToProblem(item.PID)"
        >
          {{ item.PID }}
        </div>
        <div
          class="res cursor_pointer"
          :style="
          'width: 100px; color: #ffffff; background-color:' +
          proxy.Utils.StatusConstValManager.getStatusColor(item.Result)
        "
          @click="goToSeeCode(item.SID)"
        >
          {{ item.Result }}
        </div>
        <div style="width: 140px">
          {{ proxy.Utils.StatusConstValManager.getLangString(item.Lang) }}
        </div>
        <div
          class="useTime"
          style="width: 100px"
        >
          {{ item.UseTime }}
        </div>
        <div
          class="useMemory"
          style="width: 100px"
        >
          {{ item.UseMemory }}
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
          :page-size="config.limit"
          :total="config.Count"
          :current-page="config.currentPage"
          @current-change="config.changePage"
        />
        <el-radio-group
          v-model="config.limit"
          @change="config.changePage(1)"
          style="margin: 0 20px"
        >
          <el-radio-button :label="20" />
          <el-radio-button :label="30" />
          <el-radio-button :label="50" />
        </el-radio-group>
      </div>
    </div>
    <div
      class="notFound"
      v-show="status.list.length == 0"
    >
      <el-empty description="无结果" />
    </div>
  </div>
</template>

<script lang="ts" setup name="Status" >
import { getCurrentInstance, onMounted, reactive } from 'vue'
import { useStore } from 'vuex'
const { proxy } = getCurrentInstance() as any
const store = useStore()

//页面配置
type configType = {
  Count: number
  currentPage: number
  limit: number
  loading: any
  [item: string]: any
}
var config = reactive<configType>({
  Count: 0,
  currentPage: 1,
  limit: 20,
  loading: null,
  init() {
    this.Count = 0
    this.currentPage = 1
    this.limit = 20
    this.loading = null
  },
  //切换页面
  changePage: (page: number) => {
    config.currentPage = page
    SyncUrl()
    getStatus()
  },
})

//页面数据
type statusType = {
  list: {
    Lang: number
    PID: number
    Result: string
    SID: number
    SubmitTime: number
    UseMemory: number
    UseTime: number
  }[]
}
var status = reactive<statusType>({ list: [] })

//获取数据
function getStatus() {
  proxy.$get('api/submit/status').then((res: any) => {
    let data = res.data
    if (data.code == 0) {
      // console.log(data)
      status.list = data.Data
    }
    proxy.codeProcessor(data.code)
  })
}

//用于同步浏览器url
function SyncUrl() {
  //仅用于展示实时url，可用于复制跳转
  proxy.$router.replace({
    path: '/Status',
    query: {
      Page: config.currentPage,
      Limit: config.limit,
    },
  })
}

//跳转到题目

function goToProblem(PID) {
  proxy.$router.push({
    path: '/Problem',
    query: {
      PID,
    },
  })
}

//跳转到自己提交的代码
function goToSeeCode(SID) {
  proxy.$router.push({
    path: '/Code',
    query: {
      SID,
    },
  })
}

onMounted(() => {
  //同步url参数
  if (proxy.$route.query.Page) config.currentPage = proxy.$route.query.Page - 0
  if (proxy.$route.query.Limit) config.limit = proxy.$route.query.Limit - 0
  getStatus()
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

.status {
  width: 100%;
  box-sizing: border-box;
  padding: $status_outerPaddingTop $status_outerPaddingLeft;

  .list {
    @include fill_color('fill2');
    border-radius: 10px;
    box-sizing: border-box;
    padding: $status_listPadding;

    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: $fontSize7;
      @include font_color('font1');
      border-bottom: 2px solid;
      @include border_color('border2');
      padding: 10px 0;
    }

    .item {
      display: flex;
      align-items: center;
      font-size: $fontSize5;
      @include font_color('font2');
      @include fill_color('fill3');
      justify-content: space-between;
      border-bottom: 2px solid;
      box-sizing: border-box;
      @include border_color('border2');

      .res {
        text-align: center;
        padding: 10px 0;
        border-radius: 6px;
      }

      div {
        //PID 突出显示
        &:nth-child(1) {
          @include font_color('fill12');
        }
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