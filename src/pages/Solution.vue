<template>
  <div class="solution">
    <div class="left">
      <div
        class="notFound"
        v-show="notFound"
      >
        <el-empty description="肥肠抱歉，木有找到该题，返回重试吧。" />
      </div>
      <template v-if="solutions.data.length > 0 ">
        {{solutions.data}}
        <div
          class="item"
          v-for="(item, index) in solutions.data"
        >
          <div>{{item}}</div>
        </div>
      </template>
    </div>
    <div class="right">
      
    </div>
  </div>
</template>

<script lang='ts' setup>
import { getCurrentInstance, onMounted, reactive, ref } from "vue";

const { proxy } = getCurrentInstance() as any;

var notFound = ref(true); //未找到

var solutions = reactive({
  PID: 0,
  data: [],
  Page: 1,
  Limit: 10,
  Count: 0,
  getSolutions: (PID: number | string) => {
    notFound.value = true;
    proxy.$get("forum/solution/list/" + PID).then((res: any) => {
      let data = res.data;
      if (data?.code == 0) {
        solutions.data = data.data;
        notFound.value = false;
      }
      proxy.codeProcessor(data.msg, data.msg);
    });
  },
});

onMounted(() => {
  let PID = proxy.$route.query.PID;
  solutions.PID = PID;
  solutions.getSolutions(PID);
});
</script>

<style lang='scss' scoped>
</style>