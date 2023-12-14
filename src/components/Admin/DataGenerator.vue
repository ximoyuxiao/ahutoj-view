<template>
  <el-menu
    class="DataGenerator"
    mode="horizontal"
  >
    <router-link
      active-class="selected"
      to="/Admin/DataGenerator/V1DataGenerator"
    >
      <el-menu-item index="1">
        <el-icon>
          <FolderAdd />
        </el-icon>
        基础数据生成器
      </el-menu-item>
    </router-link>
    <router-link
      active-class="selected"
      to="/Admin/DataGenerator/V2DataGenerator"
    >
      <el-menu-item index="2">
        <el-icon>
          <DataAnalysis />
        </el-icon>
        图形化数据生成器
      </el-menu-item>
    </router-link>
    <router-link
      active-class="selected"
      to="/Admin/DataGenerator/V3DataGenerator"
    >
      <el-menu-item index="3">
        <el-icon>
          <DocumentChecked />
        </el-icon>
        Special Judge
      </el-menu-item>
    </router-link>
  </el-menu>
  <div class="">
  <div class="content">
    <router-view v-slot="{ Component }">
      <transition enter-active-class="animate__animated animate__fadeInRight">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</div></template>
  
<script lang="ts" setup>

</script>
  
<style scoped lang="scss">

.content {
  padding: 0 12px;
}

</style>