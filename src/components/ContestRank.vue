<template>
  <div class="ContestRank">
    <div></div>
  </div>
</template>

<script lang="ts" setup>
import { pa } from "element-plus/es/locale";
import { getCurrentInstance, onMounted } from "vue";
import { useStore } from "vuex";
const { proxy } = getCurrentInstance() as any;
const store = useStore();

//获取竞赛提交数据
function getRankList() {
  let params: { [item: string]: any } = { Pass: "" };
  let CID = null;
  if (!proxy.$route.query.CID) {
    proxy.elMessage({
      message: "跳转地址错误，请重试",
      type: "warning",
    });
    return;
  }
  CID = proxy.$route.query.CID;
  if (proxy.$route.query.Pass) {
    params.Pass = proxy.$route.query.Pass;
  }
  params.CID = CID;
  proxy.$get("api/contest/" + CID + "/rank", params).then((res: any) => {
    proxy.$log(res.data);
  });
}

onMounted(() => {
  getRankList();
});
</script>

<style lang="less" scoped>
</style>