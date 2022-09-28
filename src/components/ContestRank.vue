<template>
  <div class="ContestRank">
    <div></div>
  </div>
</template>

<script lang="ts" setup>
import { getCurrentInstance, onMounted } from 'vue'
import { useStore } from 'vuex'
const { proxy } = getCurrentInstance() as any
const store = useStore()

function getRankList() {
  let CID = null
  let Pass = null
  if (!proxy.$route.query.CID) {
    proxy.elMessage({
      message: '跳转地址错误，请重试',
      type: 'warning',
    })
    return
  }
  CID = proxy.$route.query.CID
  if (!proxy.$route.query.Pass) {
    Pass = proxy.$route.query.Pass
  }
  proxy.$get('api/contest/' + CID + '/rank' + '?Pass=' + Pass).then((res) => {
    console.log(res)
  })
}

onMounted(() => {
  getRankList()
})
</script>

<style lang="less" scoped>
</style>