<script lang="ts" setup>
import { ref } from 'vue'
const tabPosition = ref('left')
</script>

<template>
    <el-container class="main">
        <el-header class="Container">

        </el-header>
        <el-main class="Container mainContainer">
            <div class="title">

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
    // float: left;
}
</style>