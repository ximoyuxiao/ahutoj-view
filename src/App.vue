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
  
<style>
* {
  margin: 0;
  padding: 0;
}
a:link,
a:visited,
a:active {
  text-decoration: none;
  color: var(--font_color1);
}
html {
  height: 100%;
  width: 100%;
  min-height: 800px;
  min-width: 800px;
  overflow-y: scroll;
}
body {
  position: relative;
  min-height: calc(100% - 70px);
  background-color: var(--bcg_color3);
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
/* #endregion */
</style>
  
<!-- 颜色池 -->
<style lang="scss">
:root {
  /* 颜色 */
  --bcg_color1: #ffffff;
  --bcg_color2: #f1f3f5;
  --bcg_color3: #e9ecef;
  --bcg_color4: #dee2e6;
  --bcg_color5: #adb5bd;
  --bcg_color6: #868e96;
  --bcg_color7: #787a7d;
  --bcg_color11: #f03e3e;
  --bcg_color21: #fcc419;
  --bcg_color31: #4dabf7;
  --bcg_color32: #3ecefe;
  --bcg_color33: #86e0fe;
  --bcg_color34: #c7f1ff;
  --bcg_color35: #e5f9ff;
  --bcg_color41: #5ebd00;
  --bcg_color42: #baff74;
  --bcg_color43: #e6ffcc;
  /* 字体颜色 */
  --font_color1: #000000;
  --font_color2: #495057;
  --font_color3: #868e96;
  --font_color4: #a8a8a8;
  --font_color5: #ffffff;
  --font_color11: #f03e3e;
  --font_color21: #fcc419;
  --font_color31: #296ad4;
  --font_color32: #4a86e7;
  --font_color41: #5ebd00;
  /* 配饰颜色 */
  --dec_color1: #ebfaff;
  --dec_color31: #4dabf7;
  --dec_color131: rgba(77, 171, 247, 0.08);
  --border_color1: #868e96;
  --border_color2: #aeaeae;
  --border_color31: #359ad9;
  /* 管理员界面 */
  --admin_bcg1: #212121;
  --admin_bcg2: #555b61;
  --admin_bcg3: #868e96;
  --admin_bcg4: #ffffff;
  --admin_font1: #000000;
  --admin_font2: #495057;
  --admin_font3: #868e96;
  --admin_font4: #a8a8a8;
  --admin_font5: #ffffff;
  --admin_font11: #f03e3e;
  --admin_font21: #fcc419;
  --admin_font31: #296ad4;
  --admin_font41: #5ebd00;
}
</style>
  
  <!-- 常量池 -->
<style>
:root {
  /* css常量池 */
  --FontSize1: 10px;
  --FontSize2: 12px;
  --FontSize3: 14px;
  --FontSize4: 16px;
  --FontSize5: 17px;
  --FontSize6: 18px;
  --FontSize7: 20px;
  --FontSize8: 22px;
  --FontSize9: 24px;
  --FontSize10: 25px;
  --FontSize11: 26px;
  --FontSize12: 28px;
  --FontSize13: 30px;
  --FontSize14: 32px;
  --modelDistance: 20px;
  /*页面中单个模块之间距离*/
  --modelDistanceMini: 10px;
  --modelDistanceLarge: 35px;
  --page_outerPaddingTop: 20px;
  --page_outerPaddingLeft: 100px;
  --contest_outerPaddingTop: 30px;
  --contest_outerPaddingLeft: 200px;
  --problems_leftWidth: 280px;
  --problem_rightWidth: 300px;
  --status_outerPaddingTop: 50px;
  --status_outerPaddingLeft: 240px;
  --status_listPadding: 25px;
  --userCenter_outerPaddingTop: 30px;
  --userCenter_outerPaddingLeft: 130px;
  --userCenter_toolnavWidth: 200px;
  /*下方左边操作栏宽度*/
  --adminCenter_contentPadding: 40px;
  /* animate.css 配置 */
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
