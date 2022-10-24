<template>
  <div class="Config">
    <el-drawer
      v-model="customTheme.showConfig"
      direction="ttb"
      size="74%"
    >
      <template #header>
        <h4>你的主题，你做主~</h4>
      </template>
      <template #default>
        <div class="text">为每一类页面组件选择两个颜色，它会作为渐变色两端的颜色值</div>
        <div class="color">
          <div class="text">字体颜色</div>
          <el-color-picker v-model="customTheme.colors.font.first" />
          <el-color-picker v-model="customTheme.colors.font.last" />
        </div>
        <div class="color">
          <div class="text">填充颜色</div>
          <el-color-picker v-model="customTheme.colors.fill.first" />
          <el-color-picker v-model="customTheme.colors.fill.last" />
        </div>
        <div class="color">
          <div class="text">填充蓝色</div>
          <el-color-picker v-model="customTheme.colors.fill1.first" />
          <el-color-picker v-model="customTheme.colors.fill1.last" />
        </div>
        <div class="color">
          <div class="text">填充绿色</div>
          <el-color-picker v-model="customTheme.colors.fill2.first" />
          <el-color-picker v-model="customTheme.colors.fill2.last" />
        </div>
        <div class="color">
          <div class="text">填充黄色</div>
          <el-color-picker v-model="customTheme.colors.fill3.first" />
          <el-color-picker v-model="customTheme.colors.fill3.last" />
        </div>
        <div class="color">
          <div class="text">填充红色</div>
          <el-color-picker v-model="customTheme.colors.fill4.first" />
          <el-color-picker v-model="customTheme.colors.fill4.last" />
        </div>
        <div class="color">
          <div class="text">填充灰色</div>
          <el-color-picker v-model="customTheme.colors.fill5.first" />
          <el-color-picker v-model="customTheme.colors.fill5.last" />
        </div>
        <div class="color">
          <div class="text">边框</div>
          <el-color-picker v-model="customTheme.colors.border.first" />
          <el-color-picker v-model="customTheme.colors.border.last" />
        </div>
        <div class="color">
          <div class="text">页面底色</div>
          <el-color-picker v-model="customTheme.colors.base_page" />
        </div>
        <div class="color">
          <div class="text">是否是亮色主题</div>
          <el-select
            v-model="customTheme.colors.type"
            placeholder="Select"
          >
            <el-option
              v-for="item in customTheme.themeType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
      </template>
      <template #footer>
        <div style="flex: auto">
          <el-button
            type="primary"
            @click="customTheme.confirm"
          >
            应用
          </el-button>
        </div>
      </template>
    </el-drawer>
    <div class="title">
      页面设置
    </div>
    <div class="content">
      <div class="theme">
        <div class="text">
          切换主题
        </div>
        <div class="options">
          <div :class="themeSwitchStore.theme == 1 ? 'img selected' : 'img'">
            <img
              src="../../assets/image/global/light.svg"
              @click.stop="switchTheme(1)"
            >
          </div>
          <div :class="themeSwitchStore.theme == -1 ? 'img selected' : 'img'">
            <img
              src="../../assets/image/global/dark.svg"
              @click.stop="switchTheme(-1)"
            >
          </div>
          <div :class="themeSwitchStore.theme == -2 ? 'img selected' : 'img'">
            <img
              src="../../assets/image/global/cyberpunk.svg"
              @click.stop="switchTheme(-2)"
            >
          </div>
          <div :class="themeSwitchStore.theme == 8 ? 'img selected' : 'img'">
            <img
              src="../../assets/image/global/chinese.svg"
              @click.stop="switchTheme(8)"
            >
          </div>
          <div :class="(themeSwitchStore.theme == 10 || themeSwitchStore.theme == -10) ? 'img selected' : 'img'">
            <img
              src="../../assets/image/global/custom.svg"
              @click.stop="customTheme.useCustomTheme"
            >
          </div>
        </div>
      </div>
      <div class="submit">
        <div class="text">提交后跳转到提交状态页</div>
        <el-switch
          v-model="configStore.submitThenRedirectToCode"
          size="large"
        />
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
import { computed, getCurrentInstance, onMounted, reactive, watch } from "vue";
import { useConfigStore } from "../../pinia/config";
import { useThemeSwitchStore } from "../../pinia/themeSwitch";
import { useUserDataStore } from "../../pinia/userData";
const { proxy } = getCurrentInstance() as any;
const themeSwitchStore = useThemeSwitchStore();
const configStore = useConfigStore();
const userDataStore = useUserDataStore();

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

var customTheme = reactive({
  showConfig: false,
  themeType: [
    {
      label: "亮色",
      value: 10,
    },
    {
      label: "暗色",
      value: -10,
    },
  ],
  colors: {
    font: {
      first: "#303133",
      last: "#ffffff",
    },
    fill: {
      first: "#e6e8eb",
      last: "#ffffff",
    },
    fill1: {
      first: "#337ecc",
      last: "#ecf5ff",
    },
    fill2: {
      first: "#529b2e",
      last: "#f0f9eb",
    },
    fill3: {
      first: "#b88230",
      last: "#fdf6ec",
    },
    fill4: {
      first: "#c45656",
      last: "#fef0f0",
    },
    fill5: {
      first: "#73767a",
      last: "#f4f4f5",
    },
    border: {
      first: "#cdd0d6",
      last: "#f2f6fc",
    },
    base_page: "#f2f3f5",
    type: 10,
  },
  init() {
    let customThemeData = localStorage.getItem("customThemeData") as any;
    customThemeData = JSON.parse(customThemeData) as any;
    if (!customThemeData) return;
    this.colors = customThemeData;
  },
  useCustomTheme: () => {
    customTheme.showConfig = true;
  },
  confirm: () => {
    themeSwitchStore.newCustomTheme(customTheme.colors);
    customTheme.showConfig = false;
  },
});

var config = reactive({});

configStore.$subscribe((a, b) => {
  //监测到config发生改变，更新store中的配置信息
  if (!userDataStore.isLogin) {
    proxy.elMessage({ message: "请登录后修改配置", type: "warning" });
    return;
  }
  configStore.save();
});

//切换主题
function switchTheme(theme: number): void {
  themeSwitchStore.switchTheme(theme);
}

onMounted(() => {
  customTheme.init();
});
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

  .el-drawer__body {
    .color {
      display: flex;
      align-items: center;
    }
  }

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
      box-sizing: border-box;
      padding: 5px 20px;

      .text {
        box-sizing: border-box;
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

    .submit {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-sizing: border-box;
      padding: 10px 20px;

      .text {
        box-sizing: border-box;
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