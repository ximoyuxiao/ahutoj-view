<template>
  <div>
    <!-- 主界面 -->
    <Main v-if="config.serverActive"></Main>
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
import Main from "./pages/Main.vue";
import { reactive } from "@vue/reactivity";
import { getCurrentInstance, onMounted } from "vue";
import { useThemeSwitchStore } from "./pinia/themeSwitch";
import { useConfigStore } from "./pinia/config";
import { usePageBufferedDataStore } from "./pinia/pageBufferdData";
const { proxy } = getCurrentInstance() as any;
const ThemeSwitchStore = useThemeSwitchStore();
const configStore = useConfigStore();
const pageBufferedDataStore = usePageBufferedDataStore();

var config = reactive({
  //服务器是否请求正常
  serverActive: true,
  //是否开始心跳包
  hasHeartbeat: false,
  nextHeartbeatTime: 0,
  timer: null,
  pingServer() {
    proxy.$get("api/ping").then((res: any) => {
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
    console.log("正在测试服务器连通性");
    config.pingServer();
    configStore.hasPing();
  }
});

//初始化仓库状态
function initStore() {
  configStore.init();
  ThemeSwitchStore.init();
  pageBufferedDataStore.init();
}

onMounted(() => {
  config.pingServer();
  initStore();
});

() => {};
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
  --font1: #303133;
  --font2: #606266;
  --font3: #909399;
  --font4: #a8abb2;
  --font5: #c0c4cc;
  --font6: #ffffff;

  --border1: #cdd0d6;
  --border2: #d4d7de;
  --border3: #dcdfe6;
  --border4: #e4e7ed;
  --border5: #ebeef5;
  --border6: #f2f6fc;

  --fill1: #e6e8eb;
  --fill2: #ebedf0;
  --fill3: #f0f2f5;
  --fill4: #f5f7fa;
  --fill5: #fafafa;
  --fill6: #fafcff;
  --fill7: #ffffff;

  --fill11: #337ecc;
  --fill12: #79bbff;
  --fill13: #a0cfff;
  --fill14: #c6e2ff;
  --fill15: #d9ecff;
  --fill16: #ecf5ff;

  --fill21: #529b2e;
  --fill22: #95d475;
  --fill23: #b3e19d;
  --fill24: #d1edc4;
  --fill25: #e1f3d8;
  --fill26: #f0f9eb;

  --fill31: #b88230;
  --fill32: #eebe77;
  --fill33: #f3d19e;
  --fill34: #f8e3c5;
  --fill35: #faecd8;
  --fill36: #fdf6ec;

  --fill41: #c45656;
  --fill42: #f89898;
  --fill43: #fab6b6;
  --fill44: #fcd3d3;
  --fill45: #fde2e2;
  --fill46: #fef0f0;

  --fill51: #73767a;
  --fill52: #b1b3b8;
  --fill53: #c8c9cc;
  --fill54: #dedfe0;
  --fill55: #e9e9eb;
  --fill56: #f4f4f5;

  --base: #f2f3f5;
  --base_page: #f2f3f5;
  --base_over: #ffffff;
  --base_trans: Transparent;
  --base_black: #000000;
  --base_white: #ffffff;
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
