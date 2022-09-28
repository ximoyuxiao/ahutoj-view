<template>
  <Main></Main>
  <div class="bottom">
    <Bottom>
    </Bottom>
  </div>
</template>

<script lang="ts" setup>
import Main from './components/Main.vue'
import Bottom from './components/Bottom.vue'
</script>

<style scoped>
.bottom {
  width: 100%;
  position: absolute;
  bottom: 0;
}
</style>
  
<style lang="scss">
* {
  margin: 0;
  padding: 0;
}
a:link,
a:visited,
a:active {
  text-decoration: none;
  @include font_color('fill1');
}
html {
  height: 100%;
  width: 100%;
  min-height: 800px;
  min-width: 800px;
  overflow-y: scroll;
  @include fill_color('base_page');
}
body {
  position: relative;
  min-height: calc(100% - 70px);
  @include fill_color('base_page');
  width: 100%;
}
pre {
  white-space: pre-wrap;
  white-space: -moz-pre-wrap;
  white-space: -pre-wrap;
  white-space: -o-pre-wrap;
  *word-wrap: break-word;
  *white-space: normal;
}
:root {
  --animate-duration: 300ms !important;
}
</style>
 

<!-- 便捷通用样式 -->
<style>
/* 鼠标指针效果 */
.cursor_pointer {
  cursor: pointer;
}
/* 文字图片无选中、拖拽 */
.cursor_noFocus {
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
  -webkit-user-drag: none;
}
</style>
