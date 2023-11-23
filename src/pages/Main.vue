<script lang="ts" setup name="Main">
import { reactive, onMounted, getCurrentInstance } from "vue";
import NavBar from "../components/MainChildren/NavBar.vue";
import Login from "../components/MainChildren/Login.vue";
import Signin from "../components/MainChildren/Signin.vue";
import Config from "../components/MainChildren/Config.vue";
import { useConfigStore } from "../pinia/config";
import { useUserDataStore } from "../pinia/userData";
import { UserData } from "../utils/buffer/buffer";
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
    proxy.$get("api/user/info").then((res: any) => {
      //获取用户信息
      console.log(res);
      let data: any = res.data;
      if (data.code == 0) {
        //获取权限信息
        getUserPermission(data.UID);

        //store同步登录信息
        userDataStore.login(data);
        userDataStore.sessionUserInfo();
        showNav();
        proxy.$log("自动登录成功");
      }
      proxy.codeProcessor(
        data?.code ?? 100001,
        data?.msg ?? "服务器错误\\\\error"
      );
    });
  } else {
    //清除token
    UserData.clearUserLoginCertificate();
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
      data-flag="cover"
      enter-active-class="animate__animated animate__fadeInUp"
      leave-active-class="animate__animated animate__fadeOutDown"
    >
      <div
        class="coverBox"
        v-if="config.showCover"
        style="background: linear-gradient(to bottom right, #50A3A2, #53E3A6);"
      >
        <ul class="bg-bubbles">
          <li
            v-for="i in 10"
            :key="i"
          ></li>
        </ul>
        <div class="cover" />
      </div>

    </transition>
    <!-- 登录窗口 -->
    <transition
      data-flag="loginDialog"
      enter-active-class="animate__animated animate__headShake"
    >
      <component
        v-if="config.showLogin"
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
        v-if="config.showSignin"
        :is="Signin"
        :close="showNav"
        :login="loginDialog"
      />
    </transition>
    <!-- 配置窗口 -->
    <transition
      data-flag="configDialog"
      enter-active-class="animate__animated animate__fadeInDown"
      leave-active-class="animate__animated animate__fadeOutUp"
    >
      <component
        v-if="config.showConfig"
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

<style  scoped lang="scss">
.main {
  // min-height: 100vh;
  box-sizing: border-box;

  .contentBox {
    width: 100%;
    // min-width: 800px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    z-index: 1;
    @include fill_color("base_page");
  }
}

.animate__animated[data-flag="nav"] {
  animation-duration: 600ms;
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
  filter: blur(3px);
}
</style>
