<template>
  <div class="recentContests">
    <div class="title">近期比赛</div>
    <div class="list">
      <div
        class="item"
        v-for="item in d.recentContests"
        :key="item.id"
      >
        {{ item }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, getCurrentInstance } from 'vue'
const { proxy } = getCurrentInstance() as any

var d = reactive({
  recentContests: [
    {
      id: 11254651,
      title: '2077年AHUT暑假ACM集训训练1',
      time: '2077-07-1 00:00 ~ 2077-07-08 00:00',
      status: 0,
    },
    {
      id: 11254652,
      title: '2077年AHUT暑假ACM集训训练2',
      time: '2077-07-8 00:00 ~ 2077-07-15 00:00',
      status: 1,
    },
    {
      id: 11254653,
      title: '2077年AHUT暑假ACM集训训练3',
      time: '2077-07-15 00:00 ~ 2077-07-22 00:00',
      status: 2,
    },
  ],
})
//初始化
function init() {
  recentContestsProcessor()
}

//列表数据处理
function recentContestsProcessor() {
  //在获取到数据后
  for (let i in d.recentContests) {
    if (d.recentContests[i].status == 0) d.recentContests[i].status = '已结束'
    else if (d.recentContests[i].status == 1)
      d.recentContests[i].status = '正在进行'
    else d.recentContests[i].status = '未开始'
  }
}

onMounted(() => {
  init()
})
</script>

<style  scoped>
</style>