<template>
  <div class="contest">
    <div
      class="notFound"
      v-show="notFound"
    >
      <el-empty description="肥肠抱歉，木有找到该比赛，返回重试吧。" />
    </div>
    <div
      v-show="!notFound"
      class="infoBox"
      ref="infoBox"
    >
      <div class="title">{{ contest.Title }}</div>
      <div class="text">创建者：{{ contest.UID }}</div>
      <div class="text">类型：{{ contest.Type == 1 ? "ACM" : "OI" }}</div>
      <div class="text">描述：{{ contest.Description }}</div>
      <!-- <div class="text" v-if="contest.ispublic == 0">
        比赛密码：{{ contest.pass }}
      </div> -->
      <div
        class="status"
        v-if="timePercent.status == 1"
      >
        <div
          class="point"
          style="background-color: #5ebd00"
        ></div>
        进行中
      </div>
      <div
        class="status"
        v-else
      >
        <div
          class="point"
          style="background-color: #ff3300"
        ></div>
        已结束
      </div>

      <div class="time">
        <div class="begin_time">
          {{ proxy.Utils.timestampToTime(contest.BeginTime) }}
        </div>
        <div class="left_time">
          {{
          proxy.Utils.timestampToInterval(
          timePercent.allTime - timePercent.lostTime,
          2
          )
          }}
        </div>
        <div class="end_time">
          {{ proxy.Utils.timestampToTime(contest.EndTime) }}
        </div>
      </div>
      <div class="process">
        <el-progress
          :text-inside="true"
          :stroke-width="24"
          :color="timePercent.color"
          :percentage="timePercent.percent"
        />
      </div>
    </div>
    <div
      v-show="!notFound"
      class="problemList"
      ref="problemList"
    >
      <div
        class="contestRank cursor_pointer"
        v-on:click="goToRank()"
      >
        查看排名
      </div>
      <div class="nav">
        <div style="width: 90px">序号</div>
        <div style="width: calc(100% - 190px)">题目</div>
        <div style="width: 100px">通过情况</div>
      </div>
      <div
        class="item"
        v-for="(item, index) in contest.Data"
        :key="index"
      >
        <div
          class="flag cursor_pointer"
          v-on:click="goToProblem(item.PID)"
        >
          {{ proxy.Utils.numberToAlpha(index + 1) }}
        </div>
        <div
          class="title cursor_pointer"
          v-on:click="goToProblem(item.PID)"
        >
          {{ item.Title }}
        </div>
        <div class="status">
          <el-progress
            type="circle"
            :width="22"
            :stroke-width="3"
            :percentage="
            item.SubmitNum == 0 ? 0 : (item.ACNum / item.SubmitNum) * 100
          "
            :show-text="false"
            style="margin: 0 10px"
          />
          {{ item.ACNum + "/" + item.SubmitNum }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, getCurrentInstance, reactive, ref, onUnmounted } from 'vue'
import { useStore } from 'vuex'
const { proxy } = getCurrentInstance() as any
const store = useStore()

var notFound = ref(true)

var loading = reactive({
  contestInfo: null,
  problemList: null,
  init() {
    if (this.contestInfo) {
      this.contestInfo.close()
    }
    if (this.problemList) {
      this.problemList.close()
    }
    this.contestInfo = null
    this.problemList = null
  },
})

type contestType = {
  Data: { PID: number; Title: string; ACNum: number; SubmitNum: number }[]
  BeginTime: number
  CID: number
  Type: number
  Description: string
  EndTime: number
  IsPublic: number
  Pass: string
  Size: number
  Title: string
  UID: string
  [item: string]: any
}
var contest = reactive<contestType>({
  Data: [],
  length: 0,
  BeginTime: 0,
  CID: null,
  Type: 1,
  Description: '',
  EndTime: 0,
  IsPublic: 1,
  Pass: null,
  Size: 0,
  Title: '',
  UID: '',
  copy(data: any) {
    let tempProblemSequence = data.Problems.split(',')
    for (let temp in tempProblemSequence) {
      for (let p in data.Data) {
        if (tempProblemSequence[temp] == data.Data[p].PID) {
          contest.Data.push({
            PID: data.Data[p].PID,
            Title: data.Data[p].Title,
            ACNum: data.Data[p].ACNum,
            SubmitNum: data.Data[p].SubmitNum,
          })
          break
        }
      }
    }
    contest.length = data.length
    contest.BeginTime = data.BeginTime
    contest.CID = data.CID
    contest.Type = data.Type
    contest.Description = data.Description
    contest.EndTime = data.EndTime
    contest.IsPublic = data.IsPublic
    contest.Pass = data.Pass
    contest.Size = data.Size
    contest.Title = data.Title
    contest.UID = data.UID
  },
})

type timePercentType = {
  status: number
  percent: number
  color: string
  timmer: any
  lostTime: number
  allTime: number
  timeDistance: number
  [item: string]: any
}
var timePercent = reactive<timePercentType>({
  status: 1,
  percent: 0,
  color: '#2cbbfe',
  timmer: null,
  lostTime: 0, //已流失时间
  allTime: 0, //比赛时间跨度
  timeDistance: 0, //本地时间与服务器时间间隔
  init() {
    timePercent.status = 1
    timePercent.percent = 0
    timePercent.color = '#2cbbfe'
    timePercent.timmer = null
    timePercent.lostTime = 0
    timePercent.allTime = 0
    timePercent.timeDistance = 0
    clearInterval(timePercent.timmer)
  },
  begin() {
    this.init()
    let now = Date.now() - this.timeDistance
    if (now >= contest.EndTime) {
      this.percent = 100
      this.color = '#9e9e9e'
      this.status = 0
      return
    }
    //已流失时间
    this.lostTime = now - contest.BeginTime
    this.allTime = Math.abs(contest.EndTime - contest.BeginTime)
    this.timmer = setInterval(() => {
      this.lostTime += 1000
      this.percent = Math.floor((this.lostTime / this.allTime) * 100)
      if (this.percent >= 100) {
        this.percent = 100
        this.color = '#9e9e9e'
        this.status = 0
        clearInterval(timePercent.timmer)
        return
      } else if (this.percent >= 90) {
        this.color = '#f03e3e'
      } else if (this.percent >= 60) {
        this.color = '#ff8c00'
      } else if (this.percent >= 40) {
        this.color = '#bcee68'
      } else {
        this.color = '#66cd00'
      }
    }, 1000)
  },
})

async function getContestById() {
  loading.init()
  loading.contestInfo = proxy.elLoading({
    node: proxy.$refs.infoBox,
  })
  loading.problemList = proxy.elLoading({
    node: proxy.$refs.problemList,
  })
  if (!proxy.$route.query.CID) {
    loading.init()
    return
  }
  contest.CID = proxy.$route.query.CID
  if (
    proxy.$route.query.Pass != null ||
    typeof proxy.$route.query.Pass == 'undefined'
  )
    contest.Pass = proxy.$route.query.Pass

  await proxy.$axios
    .get('api/contest/' + contest.CID + '?Pass=' + contest.Pass)
    .then((res) => {
      let data = res.data
      if (data.code == 0) {
        // console.log(data);
        contest.copy(data)
        notFound.value = false
      }
      if (data.code == 2000) {
        proxy.elMessage({
          message: '竞赛密码错误！',
          type: 'warning',
        })
      } else {
        proxy.codeProcessor(data.code)
      }
    })

  loading.init()
  await proxy.getServerTime().then((res: any) => {
    let now = Date.now()
    if (res.time == null || Math.abs(res.time * 1000 - now) < 1500) {
      timePercent.begin()
      return
    }
    timePercent.timeDistance = now - res.time * 1000
    timePercent.begin()
  })
}

//跳转到题目
function goToProblem(PID: number): void {
  let CID = contest.CID
  let Pass: string
  if (proxy.$route.query.Pass) Pass = proxy.$route.query.Pass
  proxy.$router.push({
    path: '/Problem',
    query: {
      PID,
      CID,
      Pass,
    },
  })
}

//跳转到当前比赛排名列表
function goToRank(): void {
  let CID = contest.CID
  let Pass: string
  if (proxy.$route.query.Pass) Pass = proxy.$route.query.Pass
  proxy.$router.push({
    path: '/ContestRank',
    query: {
      CID,
      Pass,
    },
  })
}

onMounted(() => {
  getContestById()
})

onUnmounted(() => {
  //回收定时器
  clearInterval(timePercent.timmer)
})
</script>

<style scoped lang="scss">
.contest {
  width: 100%;
  box-sizing: border-box;
  padding: $contest_outerPaddingTop $contest_outerPaddingLeft;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .infoBox {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-sizing: border-box;
    padding: 30px;
    border-radius: 10px;
    @include fill_color('fill2');

    .title {
      font-size: $fontSize9;
      @include font_color('font1');
      margin: 20px 0;
    }

    .text {
      font-size: $fontSize4;
      @include font_color('font2');
    }

    .status {
      margin-top: 20px;
      font-size: var(--FontSize4);
      color: var(--font_color2);
      display: flex;
      align-items: center;

      .point {
        border-radius: 50%;
        width: 8px;
        height: 8px;
        margin-right: 8px;
      }
    }

    .time {
      margin: 30px 0 15px 0;
      width: 100%;
      font-size: $fontSize4;
      @include font_color('font1');
      display: flex;
      justify-content: space-between;

      .left_time {
        font-size: $fontSize7;
        @include font_color('font1');
      }
    }

    .process {
      width: 100%;
      border-radius: 50%;
    }
  }

  .problemList {
    margin-top: $modelDistance;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-sizing: border-box;
    padding: 30px;
    border-radius: 10px;
    @include fill_color('fill2');

    .contestRank {
      width: 200px;
      line-height: 40px;
      @include font_color('font2');
      font-size: $fontSize9;
      @include fill_color('fill4');
      border-radius: 16px;
      text-align: center;

      &:hover {
        @include fill_color('fill3');
      }
    }

    .nav {
      width: 100%;
      display: flex;
      margin-bottom: 15px;

      > div {
        font-size: $fontSize6;
        @include font_color('font1');
      }
    }

    .item {
      box-sizing: border-box;
      padding: 15px 10px;
      width: 100%;
      display: flex;
      align-items: center;
      border-bottom: 1px solid;
      @include border_color('border1');
      @include fill_color('fill4');
      box-sizing: border-box;
      transition: all 300ms;

      &:hover {
        border-left: 8px solid;
        border-right: 8px solid;
        @include border_color('fill51');
      }

      &:last-child {
        border-bottom: none;
      }

      .flag {
        width: 80px;
        font-size: $fontSize6;
        @include font_color('fill11');
      }

      .title {
        width: calc(100% - 170px);
        font-size: $fontSize7;
        @include font_color('fill11');
      }

      .status {
        width: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: $fontSize4;
        @include font_color('font3');
      }
    }
  }
}

.notFound {
  width: 100%;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>