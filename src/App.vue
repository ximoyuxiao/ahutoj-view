<template>
  <Main></Main>
  <Bottom>
  </Bottom>
</template>

<script lang="ts" setup>
import Main from './components/Main.vue'
import Bottom from './components/Base/Bottom.vue'
</script>
 
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
  min-height: 100vh;
  min-width: 800px;
  overflow-y: scroll;
  position: relative;
  @include fill_color('base_page');
}
body {
  position: relative;
  width: 100%;
  height: 100%;
  @include fill_color('base_page');
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
