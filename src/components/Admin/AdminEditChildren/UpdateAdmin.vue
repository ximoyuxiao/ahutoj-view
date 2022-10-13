<template>
  <div class="UpdateAdmin">
    <el-input
      v-model="search.UID"
      placeholder="请输入UID"
    />
  </div>
</template>

<script lang="ts" setup>
import { getCurrentInstance, reactive } from 'vue'
import { useStore } from 'vuex'
const { proxy } = getCurrentInstance() as any
const store = useStore()
type searchType = {
  UID: string
}
var search = reactive<searchType>({
  UID: '',
})
</script>

<style scoped lang="scss">
UpdateAdmim {
}
</style>