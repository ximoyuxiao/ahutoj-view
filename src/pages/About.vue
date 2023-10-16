<template>
    <el-container class="mainContainer">
        <el-main class="main">
            <div class="title">
                ...
            </div>
        </el-main>
    </el-container>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
const tabPosition = ref('left')
</script>

<style scoped lang="scss">


.mainContainer {
    align-self: center;
}

.title {
    font-size: $fontSize8;
}

.bold {
    font-weight: bold;
}

.main {
    // width: 800px;
    // height: 1200px;
    margin: 20px 0 0 0;
    background-color: #fff;
    border: 1px solid #ddd;
    padding: 16px;
    border-radius: 8px;
    float: left;
}
</style>