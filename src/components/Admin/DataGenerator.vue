<template>
  <el-menu
    class="DataGenerator"
    mode="horizontal"
    router
  >
    <el-menu-item index="/Admin/DataGenerator/V1DataGenerator">
      <el-icon>
        <FolderAdd />
      </el-icon>
      基础数据生成器
    </el-menu-item>
    <el-menu-item index="/Admin/DataGenerator/V2DataGenerator">
      <el-icon>
        <DataAnalysis />
      </el-icon>
      图形化数据生成器
    </el-menu-item>
    <el-menu-item index="/Admin/DataGenerator/V3DataGenerator">
      <el-icon>
        <DocumentChecked />
      </el-icon>
      Special Judge
    </el-menu-item>
  </el-menu>
  <div class="Top Bottom">
    <div class="content">
      <router-view v-slot="{ Component }">
        <transition enter-active-class="animate__animated animate__fadeInRight">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
  </div>
</template>
  
<script lang="ts" setup>

</script>
  
<style scoped lang="scss">
.content {
  padding: 0 12px;
}
</style>