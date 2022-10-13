<template>
  <div>题单</div>
</template>

<script lang="ts" setup>
import { onMounted, reactive } from "@vue/runtime-core";
import { getCurrentInstance } from "vue";
const { proxy } = getCurrentInstance() as any;

var config = reactive({
  
})


//页面数据
var ProblemList = reactive({
  //
  list: []

})

function getProblemsList() {
  proxy
    .$post("api/training/add", { UID: "11111", Title: "123" })
    .then((res) => {
      console.log(res);
    });
}

onMounted(() => {
  // getProblemsList();
});
</script>

<style  scoped lang="scss">
</style>