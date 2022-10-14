<template>
  <div class="UpdateAdmin">
    <el-input
      v-model="search.UID"
      placeholder="请输入UID"
    />
  </div>
</template>

<script lang="ts" setup>
import { getCurrentInstance, reactive } from "vue";
const { proxy } = getCurrentInstance() as any;

type searchType = {
  UID: string;
};
var search = reactive<searchType>({
  UID: "",
});
</script>

<style scoped lang="scss">
.UpdateAdmim {
}
</style>