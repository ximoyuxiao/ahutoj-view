<template>
  <form class="signin">
    <div class="close">
      <div class="ahutFlag">
        AHUT OJ&nbsp;&nbsp;注册
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
        name="UID"
        type="text"
        autocomplete="off"
        :onkeyup="signinInfo.UIDChecker"
        maxlength="20"
        v-model="signinInfo.UID"
      />
      <label
        class="loginLabel"
        for="UID"
      >
        账号
      </label>
    </div>
    <div class="nickname">
      <input
        class="loginInput"
        name="nickname"
        type="text"
        autocomplete="off"
        :onkeyup="signinInfo.UserNameChecker"
        maxlength="20"
        v-model="signinInfo.UserName"
      />
      <label
        class="loginLabel"
        for="nickname"
      >
        昵称
      </label>
    </div>
    <div class="password">
      <input
        class="loginInput"
        name="password"
        type="password"
        :onkeyup="signinInfo.PassChecker"
        maxlength="30"
        autocomplete="off"
        v-model="signinInfo.Pass"
      />
      <label
        class="loginLabel"
        for="password"
      >
        密码
      </label>
    </div>
    <div class="password">
      <input
        class="loginInput"
        name="password"
        type="password"
        :onkeyup="signinInfo.PassChecker"
        autocomplete="off"
        maxlength="30"
        v-model="signinInfo.PassAgain"
      />
      <label
        class="loginLabel"
        for="password"
      >
        密码
      </label>
    </div>
    <div class="email">
      <input
        class="loginInput"
        name="email"
        type="text"
        autocomplete="off"
        v-model="signinInfo.Email"
      />
      <label
        class="loginLabel"
        for="password"
      >邮箱</label>
    </div>
    <div
      class="save"
      name="save"
    >
      <input
        type="checkbox"
        name="save"
        v-model="signinInfo.save"
      />
      <label for="save">3天内自动登录</label>
    </div>
    <div class="redirect">
      已经有账号了？前往<span
        class="toLogin cursor_pointer"
        @click="props.login"
      >登录</span>
    </div>
    <div
      class="confirm cursor_pointer"
      @click="signin"
    >
      确 认
    </div>
  </form>
</template>

<script lang="ts" setup>
import { reactive, getCurrentInstance, computed, watch, onMounted } from "vue";
import { useStore } from "vuex";
const { proxy } = getCurrentInstance() as any;
const store = useStore();
type propsType = {
  close?: Function;
  login?: Function;
};
var props = withDefaults(defineProps<propsType>(), {
  close: () => {},
  login: () => {},
});

//注册表单
type signinInfoType = {
  UID: string;
  UserName: string;
  Pass: string;
  PassAgain: string;
  Email: string;
  save: false;
  [item: string]: any;
};
var signinInfo = reactive<signinInfoType>({
  UID: "",
  UserName: "",
  Pass: "",
  PassAgain: "",
  Email: "",
  save: false,
  init(): void {
    this.UID = "";
    this.UserName = "";
    this.Pass = "";
    this.PassAgain = "";
    this.Email = "";
    this.save = false;
  },
  UIDChecker(): void {
    signinInfo.UID = signinInfo.UID.replace(/[^\w_]/g, "");
  },
  UserNameChecker(): void {
    signinInfo.UserName = signinInfo.UserName.replace(
      /[^\w\u4E00-\u9FA5]/g,
      ""
    );
  },
  PassChecker(): void {
    signinInfo.Pass = signinInfo.Pass.replace(/[\u4E00-\u9FA5]/g, "");
    signinInfo.PassAgain = signinInfo.PassAgain.replace(/[\u4E00-\u9FA5]/g, "");
  },
  EmailChecker(): boolean {
    if (
      signinInfo.Email.match(
        "^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(.[a-zA-Z0-9_-]+)+$"
      )
    )
      return true;
    else return false;
  },
});

//注册
function signin() {
  if (
    signinInfo.UID == "" ||
    signinInfo.UserName == "" ||
    signinInfo.Pass == "" ||
    signinInfo.PassAgain == "" ||
    signinInfo.Email == ""
  ) {
    proxy.codeProcessor("请填写完整", "warning");
    return;
  }
  if (signinInfo.Pass != signinInfo.PassAgain) {
    proxy.codeProcessor("两次密码不一致", "warning");
    return;
  }
  if (signinInfo.UID.length < 5) {
    proxy.codeProcessor("账号至少由5位数字、字母或下划线构成", "warning");
    return;
  }
  if (signinInfo.Pass.length < 6) {
    proxy.codeProcessor("密码至少由6位数字、字母或符号构成", "warning");
    return;
  }
  if (!signinInfo.EmailChecker()) {
    proxy.codeProcessor("邮箱格式有误", "warning");
    return;
  }
  localStorage.clear();
  sessionStorage.clear();
  proxy.$axios
    .post("api/auth/register/", {
      UID: signinInfo.UID,
      UserName: signinInfo.UserName,
      Pass: signinInfo.Pass,
      Email: signinInfo.Email,
    })
    .then((res: any) => {
      let data = res.data;
      if (data.code == 0) {
        console.log(data);
        //token更新
        localStorage.setItem("ahutOjToken", data.Token);
        localStorage.setItem("ahutOjSaveLoginStatus", signinInfo.save + "");
        localStorage.setItem("ahutOjUserUid", signinInfo.UID);
        //vuex数据同步
        data.UID = signinInfo.UID;
        data.UserName = signinInfo.UserName;
        store.commit("userData/login", data);
        store.commit("userData/synchronizePermission", 3);
        store.commit("userData/sessionUserInfo");
        props.close();
      }
      proxy.codeProcessor(data.code);
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
.signin {
  position: fixed;
  top: calc(50vh - 250px);
  left: calc(50vw - 250px);
  height: 500px;
  width: 500px;
  @include fill_color("fill2");
  border-radius: 25px;
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: space-around;
  z-index: 2002;

  .username,
  .nickname,
  .password,
  .email {
    position: relative;
    width: 100%;
    padding: 5px 40px;
    box-sizing: border-box;
  }

  .close {
    padding: 15px 0;

    .ahutFlag {
      padding: 5px 20px;
      width: 180px;
      border-top-right-radius: 10px;
      border-bottom-right-radius: 10px;
      font-size: $fontSize6;
      @include font_color("font1");
      @include fill_color("fill12");
    }
  }

  .loginLabel {
    position: absolute;
    font-size: $fontSize8;
    @include font_color("font3");
    transition-duration: 400ms;
    top: 9px;
    left: 50px;
    border-radius: 10px;

    &:focus {
      @include border_color("fill12");
      @include outline_color("fill12");
    }
  }

  .loginInput {
    width: 100%;
    padding: 5px 55px;
    box-sizing: border-box;
    border-radius: 10px;
    font-size: $fontSize8;
    @include font_color("font1");
    @include fill_color("fill4");
    transition-duration: 300ms;

    &:focus + .loginLabel {
      @include font_color("fill11");
    }

    &:focus {
      @include outline_color("fill13");
    }
  }

  .save {
    display: flex;
    justify-items: center;
    margin: 0 40px;
    @include font_color("font1");

    input {
      margin: 0 5px;
      height: 20px;
      width: 20px;
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
    width: 100px;
    font-size: $fontSize9;
    text-align: center;
    box-sizing: border-box;
    padding: 5px 0;
    margin: 0 0 20px 40px;
    border-radius: 10px;
    @include font_color("font6");
    @include fill_color("fill12");
    transition-duration: 100ms;

    &:hover {
      @include fill_color("fill13");
      @include box_shadow(0, 0, 2px, 2px, "fill12");
    }
  }
}
</style>