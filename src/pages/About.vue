<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { useThemeSwitchStore } from "../pinia/themeSwitch";
import MdEditor from "md-editor-v3";
import "md-editor-v3/lib/style.css";
const tabPosition = ref('left')
const themeSwitchStore = useThemeSwitchStore();
</script>

<template>
    <el-container class="main">
        <!-- <el-header class="Container">

        </el-header> -->
        <el-main class="Container mainContainer">
            <div class="title">
                <el-tabs :tab-position="tabPosition" style="height: 200px" class="demo-tabs">
                    <el-tab-pane label="OJ 信息">
                        <!-- <iframe :src="OJInfo" frameborder="0" style="width: 100%; height: 100%;">
                        
                        </iframe> -->
                        <!-- <md-editor class="mdEditor" v-model=""
                            :theme="themeSwitchStore.theme > 0 ? 'light' : 'dark'" preview-only /> -->
                    </el-tab-pane>
                    <el-tab-pane label="比赛"></el-tab-pane>
                    <el-tab-pane label="出题要求"></el-tab-pane>
                    <el-tab-pane label="To-do"></el-tab-pane>
                </el-tabs>
            </div>
        </el-main>
        <el-footer class="Container Footer ArtFont Bottom">
            <el-row>
                Anhui University of Technology
            </el-row>
            <el-row>
                Online Judge &copy; 2019 - 2023
            </el-row>
        </el-footer>
    </el-container>
</template>

<style scoped lang="scss">
.main {
    align-self: center;
}

.title {
    font-size: $fontSize8;
}

.bold {
    font-weight: bold;
}

.mainContainer {
    width: 800px;
    height: 100%;
    padding: 24px;
    // float: left;
}
</style>