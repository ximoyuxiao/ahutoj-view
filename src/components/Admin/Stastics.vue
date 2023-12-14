<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { useThemeSwitchStore } from "../../pinia/themeSwitch";
import MdEditor from "md-editor-v3";
import "md-editor-v3/lib/style.css";
const tabPosition = ref('left')
const themeSwitchStore = useThemeSwitchStore();
</script>

<template>
  <el-container class="Main">
    <!-- <el-header class="Container">
        </el-header> -->
    <!-- <el-row>
      <el-col :span="8" class="Container">

      </el-col>
      <el-col :span="8" class="Container">

      </el-col>
      <el-col :span="8" class="Container">

      </el-col>
    </el-row> -->
    <el-main class="Container"></el-main>
  </el-container>
</template>

<style scoped lang="scss">

.Main {
  padding: 0 12px;
}

.mainContainer {
  width: 800px;
  height: 100%;
  padding: 24px;
  // float: left;
}
</style>