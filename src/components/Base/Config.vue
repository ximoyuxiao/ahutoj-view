<template>
  <div class="Config">
    <div class="title">
      页面设置
    </div>
    <div class="content">
      <div class="theme">
        <div class="text">
          切换主题
        </div>
        <div class="options">
          <div :class="themeSwitch.theme == 1 ? 'img selected' : 'img'">
            <img
              src="../../assets/image/global/light.svg"
              @click.stop="switchTheme(1)"
            >
          </div>
          <div :class="themeSwitch.theme == 2 ? 'img selected' : 'img'">
            <img
              src="../../assets/image/global/dark.svg"
              @click.stop="switchTheme(2)"
            >
          </div>
          <div :class="themeSwitch.theme == 3 ? 'img selected' : 'img'">
            <img
              src="../../assets/image/global/cyberpunk.svg"
              @click.stop="switchTheme(3)"
            >
          </div>
        </div>
      </div>
      <div
        class="close cursor_pointer"
        @click="props.close"
      >
        关闭
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, watch } from "vue";
import { useThemeSwitch } from "../../pinia/themeSwitch";
const themeSwitch = useThemeSwitch();

type propsType = {
  close?: Function;
};
var props = withDefaults(defineProps<propsType>(), {
  close: () => {},
});

var propsChange = computed(() => {
  return props;
});

watch(propsChange, (nv, ov) => {}, {
  deep: true,
});

//切换主题
function switchTheme(theme: number): void {
  themeSwitch.switchTheme(theme);
}
</script>

<style lang="scss" scoped>
.Config {
  position: fixed;
  top: calc(50vh - 200px);
  left: calc(50vw - 250px);
  height: fit-content;
  width: 500px;
  box-sizing: border-box;
  padding: 20px;
  @include fill_color("fill1");
  border-radius: 25px;
  display: flex;
  align-items: center;
  flex-direction: column;
  @include box_shadow(0, 0, 4px, 1px, "border1");
  z-index: $config_zindex;

  > .title {
    font-size: $fontSize8;
    @include font_color("font1");
    letter-spacing: 2px;
    text-align: center;
    box-sizing: border-box;
    padding-bottom: 15px;
  }

  > .content {
    width: 100%;
    font-size: $fontSize6;
    display: flex;
    flex-direction: column;
    align-items: center;
    @include font_color("font2");

    .theme {
      width: 100%;
      display: flex;
      flex-direction: column;

      .text {
        box-sizing: border-box;
        padding: 5px 20px;
      }

      .options {
        display: flex;
        box-sizing: border-box;
        padding: 10px;

        .img {
          position: relative;
          height: fit-content;
          width: fit-content;
          margin: 0 10px;
          border-radius: 10px;

          &:hover {
            @include linear_gradient(to top, "fill1", "fill2");
            filter: blur(0.5px);
          }

          img {
            height: 50px;
            height: 50px;
          }
        }

        .selected {
          @include linear_gradient(to top, "fill2", "fill3");
        }
      }
    }

    .close {
      width: 200px;
      text-align: center;
      font-size: $fontSize7;
      @include font_color("font1");
      border-radius: 10px;
      box-sizing: border-box;
      padding: 5px;
      @include box_shadow(0, 0, 2px, 1px, "fill52");
    }
  }
}
</style>