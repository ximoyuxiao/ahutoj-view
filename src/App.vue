<template>
  <div>
    <!-- 主界面 -->
    <Main v-if="config.serverActive"></Main>
    <!-- 底部 -->
    <!-- <Bottom></Bottom> -->
    <!-- 服务器连接失败 -->
    <div
      class="heartbeat"
      v-else
    >
      <div class="title">服务器异常</div>
      <div class="beat">正在自动发送心跳包</div>
      <div class="content">{{config.nextHeartbeatTime}}秒后自动尝试重连。</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Main from "./components/Main.vue";
import Bottom from "./components/Base/Bottom.vue";
import { reactive } from "@vue/reactivity";
import { computed, getCurrentInstance, onMounted } from "vue";
import { useThemeSwitchStore } from "./pinia/themeSwitch";
import { useConfigStore } from "./pinia/config";
import { useUserDataStore } from "./pinia/userData";
const { proxy } = getCurrentInstance() as any;
const ThemeSwitchStore = useThemeSwitchStore();
const configStore = useConfigStore();
const userDataStore = useUserDataStore();

var config = reactive({
  //服务器是否请求正常
  serverActive: true,
  //是否开始心跳包
  hasHeartbeat: false,
  nextHeartbeatTime: 0,
  timer: null,
  pingServer() {
    proxy.$get("ping").then((res: any) => {
      clearInterval(config.timer);
      if (res.status == 200) {
        config.serverActive = true;
        if (config.hasHeartbeat) {
          config.hasHeartbeat = false;
          proxy.elMessage({
            message: "重连成功！",
            type: "success",
          });
        }
      } else {
        proxy.elMessage({
          message: "服务器连接失败！",
          type: "error",
        });
        config.serverActive = false;
        config.hasHeartbeat = true;
        config.nextHeartbeatTime = 10;
        config.timer = setInterval(() => {
          config.nextHeartbeatTime -= 1;
          if (config.nextHeartbeatTime <= 0) {
            clearInterval(config.timer);
            config.pingServer();
          }
        }, 1000);
      }
    });
  },
});

//是否要ping一下服务器，用于在特定情况下测试链接状态是否通畅
configStore.$subscribe((args, state) => {
  if (state.shouldPing) {
    console.log("需要ping一下服务器");
  }
});

//初始化仓库状态
function initStore() {
  ThemeSwitchStore.init();
}

onMounted(() => {
  config.pingServer();
  initStore();
});
</script>

<style lang="scss" scoped>
.heartbeat {
  width: 100%;
  padding: 200px 0;
  text-align: center;
  @include font_color("fill41");
  font-size: $fontSize12;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .beat {
    margin: 30px 0;
    animation: beat 1s infinite;
  }

  .content {
    @include font_color("fill31");
    font-size: $fontSize10;
  }
}

@keyframes beat {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
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
}
html {
  height: 100%;
  width: 100%;
  min-height: 100vh;
  min-width: 800px;
  overflow-y: scroll;
  position: relative;
  @include fill_color("base_page");
}
body {
  position: relative;
  width: 100%;
  height: 100%;
  @include fill_color("base_page");
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
