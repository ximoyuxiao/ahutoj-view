<template>
  <div>题单</div>
</template>

<script lang="ts" setup>
import { onMounted } from "@vue/runtime-core";
import { getCurrentInstance } from "vue";
const { proxy } = getCurrentInstance() as any;

function getProblemsList() {
  proxy
    .$post("api/training/add", { UID: "11111", Title: "123" })
    .then((res) => {
      console.log(res);
    });
}

onMounted(() => {
  getProblemsList();
});
</script>

<style  scoped lang="scss">
</style>