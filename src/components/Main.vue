<template>
  <div class="main">
    <!-- 导航栏 -->
    <transition
      data-flag="nav"
      enter-active-class="animate__animated animate__fadeInDown"
      leave-active-class="animate__animated animate__fadeOutUp"
    >
      <component
        v-show="config.showNav"
        :is="NavBar"
        :login="loginDialog"
        :config="configDialog"
      />
    </transition>
    <!-- 登录窗口背景遮罩 -->
    <transition
      v-show="config.showCover"
      data-flag="cover"
      enter-active-class="animate__animated animate__fadeInUp"
      leave-active-class="animate__animated animate__fadeOutDown"
    >
      <div class="coverBox">
        <div class="cover" />
      </div>

    </transition>
    <!-- 登录窗口 -->
    <transition
      data-flag="loginDialog"
      enter-active-class="animate__animated animate__backInDown"
      leave-active-class="animate__animated animate__backOutDown"
    >
      <component
        v-show="config.showLogin"
        :is="Login"
        :close="showNav"
        :signin="signinDialog"
      />
    </transition>
    <!-- 注册窗口 -->
    <transition
      data-flag="signinDialog"
      enter-active-class="animate__animated animate__backInDown"
      leave-active-class="animate__animated animate__backOutDown"
    >
      <component
        v-show="config.showSignin"
        :is="Signin"
        :close="showNav"
        :login="loginDialog"
      />
    </transition>
    <!-- 配置窗口 -->
    <transition
      data-flag="configDialog"
      enter-active-class="animate__animated animate__backInDown"
      leave-active-class="animate__animated animate__backOutDown"
    >
      <component
        v-show="config.showConfig"
        :is="Config"
        :close="showNav"
      />
    </transition>
    <!-- 页面内容 -->
    <div
      class="contentBox"
      v-show="config.showNav"
    >
      <router-view
        v-if="!configStore.reload"
        v-slot="{ Component }"
      >
        <transition enter-active-class="animate__animated animate__fadeInUp">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
  </div>
</template>

<script lang="ts" setup name="Main">
import { reactive, onMounted, getCurrentInstance } from "vue";
import NavBar from "./Base/NavBar.vue";
import Login from "./Base/Login.vue";
import Signin from "./Base/Signin.vue";
import Config from "./Base/Config.vue";
import { useConfigStore } from "../pinia/config";
import { useUserDataStore } from "../pinia/userData";
const { proxy } = getCurrentInstance() as any;
const configStore = useConfigStore();
const userDataStore = useUserDataStore();

//页面配置项
type configType = {
  showNav: boolean;
  showCover: boolean;
  showLogin: boolean;
  showSignin: boolean;
  showConfig: boolean;
  init: Function;
};
var config = reactive<configType>({
  showNav: true,
  showCover: false,
  showLogin: false,
  showSignin: false,
  showConfig: false,
  init() {
    config.showNav = true;
    config.showCover = false;
    config.showSignin = false;
    config.showLogin = false;
    config.showConfig = false;
  },
});

//显示导航栏
function showNav() {
  config.init();
}

//显示登录窗口
function loginDialog() {
  config.init();
  config.showNav = false;
  config.showCover = true;
  config.showLogin = true;
}

//显示注册窗口
function signinDialog() {
  config.init();
  config.showNav = false;
  config.showCover = true;
  config.showSignin = true;
}

//显示设置窗口
function configDialog() {
  config.init();
  config.showNav = true;
  config.showCover = false;
  config.showConfig = true;
}

//session登录状态恢复与自动登录
async function autoLogin() {
  let Token = localStorage.getItem("ahutOjToken");
  let save = localStorage.getItem("ahutOjSaveLoginStatus");
  let UID = localStorage.getItem("ahutOjUserUid");
  let userInfo: any = sessionStorage.getItem("ahutOjUserInfo");
  let data = { UID: "", UserName: "", PermissionMap: 0 };
  //从session中恢复登录状态
  if (Token && userInfo && userInfo != "") {
    //重新转换为js对象
    userInfo = JSON.parse(userInfo);
    if (userInfo && userInfo.UID && userInfo.UID == UID) {
      data.UID = userInfo.UID;
      if (userInfo.UserName) {
        data.UserName = userInfo.UserName;
      } else {
        //数据不同步
        initLoginCredentials();
        return;
      }
      data.PermissionMap = userInfo.PermissionMap;

      userDataStore.login(data);
      userDataStore.synchronizePermission(data.PermissionMap);
    } else {
      //数据不同步
      initLoginCredentials();
      return;
    }
    showNav();
    return;
  }
  //自动登录
  if (save == "true" && Token != null) {
    proxy.$axios.get("api/user/info").then((res: any) => {
      //获取用户信息
      let data: any = res.data;
      if (data.code == 0) {
        //获取权限信息
        getUserPermission(data.UID);

        //vuex同步登录信息
        userDataStore.login(data);
        userDataStore.sessionUserInfo();
        showNav();
        proxy.$log("自动登录成功");
      }
      proxy.codeProcessor(data.code, data.msg);
    });
  }
}

//获取用户权限信息
async function getUserPermission(UID: string) {
  proxy.$get("api/admin/permission/" + UID).then((res: any) => {
    let data = { PermissionMap: 0 };
    if (res.data.code == 0) {
      data.PermissionMap = res.data.PermissionMap;

      userDataStore.synchronizePermission(data.PermissionMap);
      userDataStore.sessionUserInfo();
      proxy.$log("permission 同步完成");
      return 1;
    }
    proxy.codeProcessor(res.data.code);
  });
}

//初始化登录凭证
function initLoginCredentials() {
  userDataStore.logout();
  proxy.$router.replace({ path: "/" });
}

onMounted(() => {
  autoLogin();
});
</script>

<style  scoped lang="scss">
.main {
  min-height: 90vh;
  box-sizing: border-box;

  .contentBox {
    width: 100%;
    min-width: 800px;
    box-sizing: border-box;
    padding-top: $navBarHeight;
    display: flex;
    flex-direction: column;
    z-index: 1;
    @include fill_color("base_page");
  }
}

.animate__animated[data-flag="nav"] {
  animation-duration: 600ms;
}

.animate__animated[data-flag="cover"] {
  animation-duration: 900ms;
}

.animate__animated[data-flag="loginDialog"] {
  animation-duration: 800ms;
}

.animate__animated[data-flag="signinDialog"] {
  animation-duration: 800ms;
}

.animate__animated[data-flag="configDialog"] {
  animation-duration: 800ms;
}

.coverBox {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  filter: blur(35px);

  .cover {
    position: absolute;
    width: calc(max(50vw, 50vh) * 1.414 * 4);
    height: calc(max(50vw, 50vh) * 1.414 * 4);
    top: calc(50% - max(50vw, 50vh) * 1.414 * 2);
    left: calc(50% - max(50vw, 50vh) * 1.414 * 2);
    opacity: 1;
    background: linear-gradient(to right, #f0e68c, #0080ff);
    animation: cover_animation 20s ease infinite;
    animation-fill-mode: both;
  }
}

@keyframes cover_animation {
  0% {
    transform: rotateZ(0deg);
    filter: hue-rotate(0deg);
  }
  10% {
    transform: rotateZ(100deg);
    filter: hue-rotate(70deg);
  }
  20% {
    transform: rotateZ(200deg);
    filter: hue-rotate(140deg);
  }
  30% {
    transform: rotateZ(300deg);
    filter: hue-rotate(210deg);
  }
  40% {
    transform: rotateZ(400deg);
    filter: hue-rotate(280deg);
  }
  50% {
    transform: rotateZ(500deg);
    filter: hue-rotate(360deg);
  }
  60% {
    transform: rotateZ(600deg);
    filter: hue-rotate(280deg);
  }
  70% {
    transform: rotateZ(700deg);
    filter: hue-rotate(210deg);
  }
  80% {
    transform: rotateZ(800deg);
    filter: hue-rotate(140deg);
  }
  90% {
    transform: rotateZ(900deg);
    filter: hue-rotate(70deg);
  }
  100% {
    transform: rotateZ(1000deg);
    filter: hue-rotate(0);
  }
}
</style>
