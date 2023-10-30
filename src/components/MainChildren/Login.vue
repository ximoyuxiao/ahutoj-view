<script lang="ts" setup>
import { reactive, getCurrentInstance, computed, watch } from "vue";
import { useUserDataStore } from "../../pinia/userData";
const { proxy } = getCurrentInstance() as any;
const userDataStore = useUserDataStore();

type propsType = {
  close?: Function;
  signin?: Function;
};
var props = withDefaults(defineProps<propsType>(), {
  close: () => { },
  signin: () => { },
});

//登录表单
type loginInfoType = {
  UID: string;
  Pass: string;
  save: boolean;
  [item: string]: any;
};
var loginInfo = reactive<loginInfoType>({
  UID: "",
  Pass: "",
  save: false,
  init(): void {
    loginInfo.UID = "";
    loginInfo.Pass = "";
    loginInfo.save = false;
  },
});

//登录
function login() {
  if (loginInfo.UID == "" || loginInfo.Pass == "") {
    proxy.codeProcessor("请输入完整", "warning");
    return;
  }
  localStorage.clear();
  sessionStorage.clear();
  proxy
    .$post("api/auth/login/", {
      UID: loginInfo.UID,
      Pass: loginInfo.Pass,
    })
    .then((res: any) => {
      let data = res.data;
      if (data.code == 0) {
        // proxy.$log(data);
        //localStorage更新
        localStorage.setItem("ahutOjToken", data.Token);
        localStorage.setItem("ahutOjSaveLoginStatus", loginInfo.save + "");
        localStorage.setItem("ahutOjUserUid", loginInfo.UID);
        //vuex数据同步
        data.UID = loginInfo.UID;

        userDataStore.login(data);
        userDataStore.synchronizePermission(data.PermissionMap);
        userDataStore.sessionUserInfo();
        proxy.$log("permission 同步完成");
        props.close();
      }
      proxy.codeProcessor(
        data?.code ?? 100001,
        data?.msg ?? "服务器错误\\\\error"
      );
    });
}

var propsChange = computed(() => {
  return props;
});

watch(propsChange, (nv, ov) => { }, {
  deep: true,
});
</script>

        
<template>
  <form class="login">
    <div class="close">
      <div class="ahutFlag artFont bold">
        AHUT OJ&nbsp;&nbsp;登录
      </div>
      <!-- <img
        class="cursor_pointer"
        @click="props.close"
        src="../../assets/image/global/close.svg"
        style="
            position: absolute;
            top: 15px;
            right: 15px;
            width: 35px;
            height: 35px;
          "
      /> -->
      <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" class="cursor_pointer"
        @click="props.close" style="
            position: absolute;
            top: 15px;
            right: 15px;
            width: 35px;
            height: 35px;
          ">
        <path fill="currentColor"
          d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12z" />
      </svg>
    </div>
    <div class="username">
      <el-input placeholder="" class="loginInput" type="text" autocomplete="off" v-model="loginInfo.UID" />
      <label class="loginLabel">
        账号
      </label>
    </div>
    <div class="password">
      <el-input placeholder="" class="loginInput" type="password" v-model="loginInfo.Pass" autocomplete="off"
        show-password @keyup.enter="login" />
      <label class="loginLabel">密码</label>
    </div>
    <div class="save" style="display: flex; justify-items: center; margin: 0 40px">
      <el-checkbox label="3 天内自动登录" size="large" name="save" v-model="loginInfo.save" type="checkbox"
        style="margin: 10px 0;" />
    </div>
    <div class="redirect">
      <!-- <span class="lostPassword cursor_pointer" @click="null">忘记密码</span> | -->
      <span class="toSignin cursor_pointer" @click="props.signin">注册账户</span>
    </div>
    <el-button class="confirm" type="primary" round @click="login">登 录</el-button>
  </form>
</template>

<style lang="scss">
@media screen and (max-width:600px) {
  .login {
    position: fixed;
    top: calc(50vh - 200px);
    // left: calc(50vw - 250px);
    height: 380px;
    // width: 440px;
    @include fill_color("fill2");
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    align-content: center;
    justify-content: space-around;
    z-index: $login_zindex;
  }

}

@media screen and (min-width:600px) {
  .login {
    position: fixed;
    top: calc(50vh - 200px);
    left: calc(50vw - 250px);
    height: 380px;
    width: 440px;
    @include fill_color("fill2");
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    align-content: center;
    justify-content: space-around;
    z-index: $login_zindex;
  }

}

.login {
  .username,
  .password {
    position: relative;
    width: 100%;
    padding: 15px 40px;
    box-sizing: border-box;
  }

  .close {
    padding: 10px 0;

    .ahutFlag {
      margin: 10px 0 0 40px;
      font-size: $fontSize10;
      // // padding: 7px 20px;
      // // width: 160px;
      // // border-top-right-radius: 10px;
      // // border-bottom-right-radius: 10px;
      // font-size: $fontSize8;
      // @include font_color("font1");
      // @include fill_color("fill12");
    }
  }

  .loginLabel {
    position: absolute;
    font-size: $fontSize6;
    transition-duration: 600ms;
    top: 23px;
    left: 40px;
    border-radius: 2px;
  }

  .loginInput {
    // width: 100%;
    position: absolute;
    width: 360px;
    padding: 5px 50px;
    margin: 0 0 10px 0;
    font-size: $fontSize5;

    &:focus+.loginLabel {
      @include font_color("fill11");
    }

    &:focus {
      @include outline_color("fill13");
    }
  }

  .redirect {
    box-sizing: border-box;
    width: 100%;
    padding: 5px 40px;
    @include font_color("font1");
  }

  .lostPassword,
  .toSignin,
  .toLogin {
    @include font_color("fill11");
  }

  .confirm {
    width: 320px;
    height: 40px;
    font-size: $fontSize6;
    align-self: center;
    align-content: center;
    box-sizing: border-box;
    padding: 5px 0;
    margin: 0 40px 16px 40px;
    transition-duration: 300ms;
  }
}
</style>