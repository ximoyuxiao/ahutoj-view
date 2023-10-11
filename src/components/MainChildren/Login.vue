<template>
  <form class="login">
    <div class="close">
      <div class="ahutFlag">
        AHUT OJ&nbsp;&nbsp;登录
      </div>
      <img
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
      />
    </div>
    <div class="username">
      <input
        class="loginInput"
        type="text"
        autocomplete="off"
        v-model="loginInfo.UID"
      />
      <label class="loginLabel">
        账号
      </label>
    </div>
    <div class="password">
      <input
        class="loginInput"
        type="password"
        v-model="loginInfo.Pass"
        autocomplete="off"
        @keyup.enter="login"
      />
      <!-- <template>
        <el-input v-model="input" placeholder="Please input" />
      </template> -->



      <label class="loginLabel">密码</label>
    </div>
    <div
      class="save"
      style="display: flex; justify-items: center; margin: 0 40px"
    >
      <!-- <el-input v-model="input" placeholder="Please input"
        type="checkbox"
        name="save"
      /> -->
      <!-- <el-checkbox v-model="Checked" label="3 天内自动登录" size="large" for="save"/>  -->
      <input
        type="checkbox"
        name="save"
        v-model="loginInfo.save"
      />
      <label>3 天内自动登录</label>
    </div>
    <div class="redirect">
      <span
        class="lostPassword cursor_pointer"
        @click="null"
      >忘记密码</span> | 
      <span
        class="toSignin cursor_pointer"
        @click="props.signin"
      >注册账户</span>
    </div>
    <el-button class="confirm" type="primary" round shoudAddSpace
      @click="login"
    >登录</el-button>

  </form>
</template>

<!-- <script lang="ts" setup>
import { ref } from 'vue'
const input = ref('')
</script> -->

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
  close: () => {},
  signin: () => {},
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

watch(propsChange, (nv, ov) => {}, {
  deep: true,
});
</script>

<style lang="scss">
.login {
  position: fixed;
  top: calc(50vh - 200px);
  left: calc(50vw - 250px);
  height: 380px;
  width: 440px;
  @include fill_color("fill2");
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: space-around;
  z-index: $login_zindex;

  .username,
  .password {
    position: relative;
    width: 100%;
    padding: 5px 40px;
    box-sizing: border-box;
  }

  .close {
    padding: 15px 0;

    .ahutFlag {
      padding: 5px 20px;
      width: 160px;
      border-top-right-radius: 10px;
      border-bottom-right-radius: 10px;
      font-size: $fontSize8;
      @include font_color("font1");
      @include fill_color("fill12");
    }
  }

  .loginLabel {
    position: absolute;
    font-size: $fontSize6;
    // @include font_color("font3");
    transition-duration: 600ms;
    top: 12px;
    left: 52px;
    // border-radius: 2px;

    &:focus {
      @include border_color("fill12");
      @include outline_color("fill12");
    }
  }

  .loginInput {
    width: 100%;
    padding: 5px 55px;
    box-sizing: border-box;
    border-radius: 6px;
    font-size: $fontSize8;
    // @include font_color("font1");
    // @include fill_color("fill4");
    transition-duration: 300ms;

    // &:focus + .loginLabel {
    //   @include font_color("fill11");
    // }

    // &:focus {
    //   @include outline_color("fill13");
    // }
  }

  .save {
    display: flex;
    justify-items: center;
    margin: 0 30px;
    @include font_color("font1");

    input {
      margin: 3px 5px 0px 2px;
      height: 18px;
      width: 18px;
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
    width: 360px;
    height: 40px;
    font-size: $fontSize7;
    // align-self: center;
    align-content: center;
    box-sizing: border-box;
    padding: 5px 0;
    margin: 0 40px 16px 40px;
    // border-radius: 10px;
    // @include font_color("font6");
    // @include fill_color("fill12");
    transition-duration: 100ms;

    // &:hover {
    //   @include fill_color("fill13");
    //   @include box_shadow(0, 0, 2px, 2px, "fill12");
    // }
  }
}
</style>