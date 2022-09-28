<template>
  <div style="min-height: 800px">
    <!-- 导航栏 -->
    <div :class="config.showLoginDialog == 0 ? 'navBox' : 'navHide navBox'">
      <div :id="config.showLoginDialog == 0 ? 'cover' : 'coverLogin'"></div>
      <div class="left">
        <div id="name">
          <router-link to="/Home">AHUT OJ</router-link>
        </div>
        <router-link
          id="problems"
          active-class="selected"
          to="/Problems"
        >
          题库
        </router-link>
        <router-link
          id="contests"
          active-class="selected"
          to="/Contests"
        >
          比赛
        </router-link>
        <router-link
          id="problemList"
          active-class="selected"
          to="/ProblemList"
        >
          题单
        </router-link>
        <router-link
          id="status"
          active-class="selected"
          to="/Status"
        >状态
        </router-link>
      </div>
      <div class="right">
        <label class="switch">
          <input
            ref="themeSwitch"
            type="checkbox"
            @change="changeTheme"
          />
          <span class="slider"></span>
        </label>
        <div
          class="cursor_pointer"
          v-if="store.state.userData.UserName == ''"
          @click="loginDialog"
        >
          <span>登录</span>
        </div>
        <div
          class="username cursor_pointer"
          v-else
        >
          <span style="font-weight: 600">
            {{ store.state.userData.UserName  }}
          </span>
          <div class="infoCard">
            <div style="height: 10px"></div>
            <div class="list">
              <div @click.stop="intoUserCenter()">
                <el-icon>
                  <User />
                </el-icon>&nbsp;个人中心
              </div>
              <div
                v-if="store.state.userData.PermissionMap > 3"
                @click.stop="intoAdminCenter()"
              >
                <el-icon>
                  <Operation />
                </el-icon>&nbsp;Admin
              </div>
              <el-divider style="margin: 2px" />
              <div @click.stop="initLoginCredentials()">
                <el-icon>
                  <SwitchButton />
                </el-icon>&nbsp;退出登录
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      class="login"
      v-if="config.showLoginDialog == 1"
    >
      <div
        class="close"
        style="padding: 15px 0"
      >
        <div style="
            padding: 5px 20px;
            width: 180px;
            border-top-right-radius: 10px;
            border-bottom-right-radius: 10px;
            font-size: var(--FontSize6);
            color: var(--font_color5);
            background-color: var(--dec_color31);
          ">
          AHUT OJ&nbsp;&nbsp;登录
        </div>
        <img
          class="cursor_pointer"
          @click="loginDialog"
          src="../assets/image/global/close.svg"
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
          name="username"
          type="text"
          autocomplete="off"
          v-model="loginInfo.UID"
        />
        <label
          class="loginLabel"
          for="username"
        >账号</label>
      </div>
      <div class="password">
        <input
          class="loginInput"
          name="password"
          type="password"
          v-model="loginInfo.Pass"
          @keyup.enter="login"
        />
        <label
          class="loginLabel"
          for="password"
        >密码</label>
      </div>
      <div
        class="save"
        style="display: flex; justify-items: center; margin: 0 40px"
      >
        <input
          type="checkbox"
          name="save"
          v-model="loginInfo.save"
          style="height: 20px; width: 20px"
        />
        <label
          for="save"
          style="margin: 0 5px; color: var(--font_color1)"
        >3天内自动登录</label>
      </div>
      <div class="redirect">
        您是否<span
          class="lostPassword cursor_pointer"
          @click="null"
        >忘记密码 </span>？或者您需要<span
          class="toSignin cursor_pointer"
          @click="toSignin"
        >注册</span>一个新的账户
      </div>
      <div
        class="confirm cursor_pointer"
        @click="login"
      >确 认</div>
    </div>

    <div
      class="signin"
      v-if="config.showLoginDialog == 2"
    >
      <div
        class="close"
        style="padding: 15px 0;"
      >
        <div style="
            padding: 5px 20px;
            width: 180px;
            border-top-right-radius: 10px;
            border-bottom-right-radius: 10px;
            font-size: var(--FontSize6);
            color: var(--font_color5);
            background-color: var(--dec_color31);
          ">
          AHUT OJ&nbsp;&nbsp;注册
        </div>
        <img
          class="cursor_pointer"
          @click="loginDialog"
          src="../assets/image/global/close.svg"
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
          name="username"
          type="text"
          autocomplete="off"
          :onkeyup="signinInfo.UIDChecker"
          maxlength="20"
          v-model="signinInfo.UID"
        />
        <label
          class="loginLabel"
          for="username"
        >账号</label>
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
        >昵称</label>
      </div>
      <div class="password">
        <input
          class="loginInput"
          name="password"
          type="password"
          :onkeyup="signinInfo.PassChecker"
          maxlength="30"
          v-model="signinInfo.Pass"
        />
        <label
          class="loginLabel"
          for="password"
        >密码</label>
      </div>
      <div class="password">
        <input
          class="loginInput"
          name="password"
          type="password"
          :onkeyup="signinInfo.PassChecker"
          maxlength="30"
          v-model="signinInfo.PassAgain"
        />
        <label
          class="loginLabel"
          for="password"
        >密码</label>
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
        style="display: flex; justify-items: center; margin: 0 40px"
      >
        <input
          type="checkbox"
          name="save"
          v-model="signinInfo.save"
          style="height: 20px; width: 20px"
        />
        <label
          for="save"
          style="margin: 0 5px; color: var(--font_color1)"
        >3天内自动登录</label>
      </div>
      <div class="redirect">
        已经有账号了？前往<span
          class="toLogin cursor_pointer"
          @click="toLogin"
        >登录</span>
      </div>
      <div
        class="confirm cursor_pointer"
        @click="signin"
      >确 认</div>
    </div>

    <!-- 页面内容 -->
    <div class="contentBox">
      <router-view
        v-if="!store.state.config.reload"
        v-slot="{ Component }"
      >
        <transition enter-active-class="animate__animated animate__fadeInUp">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>

    <div style="height: 50px"></div>
  </div>
</template>

<script lang="ts" setup name="Main">
import { reactive, onMounted, getCurrentInstance } from 'vue'
import { useStore } from 'vuex'
const { proxy } = getCurrentInstance() as any
const store = useStore()

//页面配置数据
type configType = {
  theme: number
  showLoginDialog: number
}
var config = reactive<configType>({
  theme: 1,
  showLoginDialog: 0,
})

//登录表单
type loginInfoType = {
  UID: string
  Pass: string
  save: boolean
  [item: string]: any
}
var loginInfo = reactive<loginInfoType>({
  UID: '',
  Pass: '',
  save: false,
  init(): void {
    this.UID = ''
    this.Pass = ''
    this.save = false
  },
})

//注册表单
type signinInfoType = {
  UID: string
  UserName: string
  Pass: string
  PassAgain: string
  Email: string
  save: false
  [item: string]: any
}
var signinInfo = reactive<signinInfoType>({
  UID: '',
  UserName: '',
  Pass: '',
  PassAgain: '',
  Email: '',
  save: false,
  init(): void {
    this.UID = ''
    this.UserName = ''
    this.Pass = ''
    this.PassAgain = ''
    this.Email = ''
    this.save = false
  },
  UIDChecker(): void {
    signinInfo.UID = signinInfo.UID.replace(/[^\w_]/g, '')
  },
  UserNameChecker(): void {
    signinInfo.UserName = signinInfo.UserName.replace(/[^\w\u4E00-\u9FA5]/g, '')
  },
  PassChecker(): void {
    signinInfo.Pass = signinInfo.Pass.replace(/[\u4E00-\u9FA5]/g, '')
    signinInfo.PassAgain = signinInfo.PassAgain.replace(/[\u4E00-\u9FA5]/g, '')
  },
  EmailChecker(): boolean {
    if (
      signinInfo.Email.match(
        '^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(.[a-zA-Z0-9_-]+)+$'
      )
    )
      return true
    else return false
  },
})

//跳转到登录界面
function toLogin() {
  config.showLoginDialog = 1
  signinInfo.init()
}

//跳转到注册界面
function toSignin() {
  config.showLoginDialog = 2
  loginInfo.init()
}

//点击个人中心
function intoUserCenter() {
  proxy.$router.push({ path: '/UserCenter' })
}

//进入管理员界面
function intoAdminCenter() {
  proxy.$router.push({ path: '/Admin' })
}

//处理切换主题事件
function changeTheme() {
  if (config.theme == 1) config.theme = 2
  else config.theme = 1
  store.commit('themeSwitch/switch', config.theme)
}

//登录窗口
function loginDialog() {
  config.showLoginDialog = config.showLoginDialog == 0 ? 1 : 0
  loginInfo.init()
  signinInfo.init()
}

//登录
function login() {
  if (loginInfo.UID == '' || loginInfo.Pass == '') {
    proxy.codeProcessor('请输入完整', 'warning')
    return
  }
  localStorage.clear()
  sessionStorage.clear()
  proxy.$axios
    .post('api/auth/login/', {
      UID: loginInfo.UID,
      Pass: loginInfo.Pass,
    })
    .then((res: any) => {
      let data = res.data
      if (data.code == 0) {
        // console.log(data);
        //localStorage更新
        localStorage.setItem('ahutOjToken', data.Token)
        localStorage.setItem('ahutOjSaveLoginStatus', loginInfo.save + '')
        localStorage.setItem('ahutOjUserUid', loginInfo.UID)
        //vuex数据同步
        data.UID = loginInfo.UID
        store.commit('userData/login', data)
        store.commit('userData/synchronizePermission', data.PermissionMap)
        store.commit('userData/sessionUserInfo')
        console.log('permission 同步完成')
        config.showLoginDialog = 0
      } else {
        proxy.codeProcessor(data.code)
      }
    })
}

//注册
function signin() {
  if (
    signinInfo.UID == '' ||
    signinInfo.UserName == '' ||
    signinInfo.Pass == '' ||
    signinInfo.PassAgain == '' ||
    signinInfo.Email == ''
  ) {
    proxy.codeProcessor('请填写完整', 'warning')
    return
  }
  if (signinInfo.Pass != signinInfo.PassAgain) {
    proxy.codeProcessor('两次密码不一致', 'warning')
    return
  }
  if (signinInfo.UID.length < 5) {
    proxy.codeProcessor('账号至少由5位数字、字母或下划线构成', 'warning')
    return
  }
  if (signinInfo.Pass.length < 6) {
    proxy.codeProcessor('密码至少由6位数字、字母或符号构成', 'warning')
    return
  }
  if (!signinInfo.EmailChecker()) {
    proxy.codeProcessor('邮箱格式有误', 'warning')
    return
  }
  localStorage.clear()
  sessionStorage.clear()
  proxy.$axios
    .post('api/auth/register/', {
      UID: signinInfo.UID,
      UserName: signinInfo.UserName,
      Pass: signinInfo.Pass,
      Email: signinInfo.Email,
    })
    .then((res: any) => {
      let data = res.data
      if (data.code == 0) {
        console.log(data)
        //token更新
        localStorage.setItem('ahutOjToken', data.Token)
        localStorage.setItem('ahutOjSaveLoginStatus', signinInfo.save + '')
        localStorage.setItem('ahutOjUserUid', signinInfo.UID)
        //vuex数据同步
        data.UID = signinInfo.UID
        data.UserName = signinInfo.UserName
        store.commit('userData/login', data)
        store.commit('userData/synchronizePermission', 3)
        store.commit('userData/sessionUserInfo')
        config.showLoginDialog = 0
      } else {
        proxy.codeProcessor(data.code)
      }
    })
}

//自动登录
async function autoLogin() {
  let Token = localStorage.getItem('ahutOjToken')
  let save = localStorage.getItem('ahutOjSaveLoginStatus')
  let UID = localStorage.getItem('ahutOjUserUid')
  let userInfo: any = sessionStorage.getItem('ahutOjUserInfo')
  let data = { UID: '', UserName: '', PermissionMap: 0 }
  let status = [false]
  //从session中恢复登录状态
  if (Token && userInfo && userInfo != '') {
    //重新转换为js对象
    userInfo = JSON.parse(userInfo)
    if (userInfo && userInfo.UID && userInfo.UID == UID) {
      data.UID = userInfo.UID
      if (userInfo.UserName) {
        data.UserName = userInfo.UserName
      } else {
        //数据不同步
        initLoginCredentials()
        return
      }
      data.PermissionMap = userInfo.PermissionMap
      store.commit('userData/login', data)
      store.commit('userData/synchronizePermission', data.PermissionMap)
    } else {
      //数据不同步
      initLoginCredentials()
      return
    }
    config.showLoginDialog = 0
    return
  }
  //自动登录
  if (save == 'true' && Token != null) {
    await proxy.$axios.get('api/user/info').then((res: any) => {
      // console.log(res)
      let data: { code: number; [item: string]: any } = res.data
      if (data.code == 0) {
        status[0] = true
      } else {
        proxy.codeProcessor(data.code)
      }
    })

    //获取权限信息
    if (!status[0]) return
    getUserPermission(data.UID)

    //vuex同步登录信息
    console.log(store)
    store.commit('userData/login', data)
    store.commit('userData/sessionUserInfo')
    config.showLoginDialog = 0
    console.log('自动登录成功')
  }
}

//获取用户权限信息
async function getUserPermission(UID: string) {
  proxy.$get('api/admin/permission/' + UID).then((res: any) => {
    let data = { PermissionMap: 0 }
    if (res.data.code == 0) {
      data.PermissionMap = res.data.PermissionMap
      store.commit('userData/synchronizePermission', data.PermissionMap)
      store.commit('userData/sessionUserInfo')
      console.log('permission 同步完成')
      return 1
    } else {
      proxy.codeProcessor(res.data.code)
    }
  })
}

//刷新页面状态
function refresh() {
  //维护页面theme
  let theme: number = Number(localStorage.getItem('theme'))
  if (theme == 0) theme = 1
  if (theme == 1) {
    config.theme = theme
    proxy.$refs.themeSwitch.checked = false
    store.commit('themeSwitch/switch', theme)
  } else if (theme == 2) {
    config.theme = theme
    proxy.$refs.themeSwitch.checked = true
    store.commit('themeSwitch/switch', theme)
  }
}

//初始化登录凭证
function initLoginCredentials() {
  sessionStorage.clear()
  localStorage.clear()
  store.commit('userData/logout')
  proxy.$router.replace({ path: '/' })
}

onMounted(() => {
  autoLogin()
  refresh()
})
</script>

<style  scoped lang="scss">
.navBox {
  top: 0;
  position: fixed;
  width: 100%;
  min-width: 800px;
  height: 55px;
  display: flex;
  justify-content: space-between;
  transition-duration: 800ms;
  z-index: 2001;

  #cover {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    @include fill_color('fill1');
    opacity: 0.9;
  }

  #coverLogin {
    position: absolute;
    width: 200%;
    height: 300%;
    top: -50%;
    left: -50%;
    opacity: 1;
    background: linear-gradient(to right, #f0e68c, #0080ff);
    animation: infinite 10s login_bcg;
  }

  .left {
    height: 55px;
    display: flex;
    align-items: center;
    z-index: 10000;

    div {
      height: 100%;
      box-sizing: border-box;
      transition-duration: 300ms;
      z-index: 100;
      &:hover > a {
        @include font_color('fill12');
      }
      a {
        height: 100%;
        display: block;
        @include font_color('font1');
        box-sizing: border-box;
        padding: 0 18px;
        text-align: center;
        font-size: $fontSize6;
        line-height: 55px;
        transition-duration: 260ms;
      }
    }

    a {
      display: block;
      @include font_color('font1');
      height: 100%;
      box-sizing: border-box;
      padding: 0 18px;
      text-align: center;
      font-size: $fontSize5;
      line-height: 55px;
      transition-duration: 400ms;
      &:hover {
        @include font_color('fill11');
      }
    }
    .selected {
      border-bottom: 3px solid;
      @include border_color('fill13');
      @include fill_color('fill15');
      border-bottom-left-radius: 5px;
      border-bottom-right-radius: 5px;
    }
  }

  .right {
    height: 55px;
    display: flex;
    align-items: center;
    z-index: 10000;

    div {
      padding: 0 28px;
      font-size: $fontSize6;
      @include font_color('font1');
      height: 55px;
      line-height: 55px;
      z-index: 100;
    }

    .username {
      position: relative;
      &:hover > .infoCard {
        visibility: visible;
        opacity: 1;
        transform: translateX(-30px);
      }

      &:hover > span {
        @include font_color('fill12');
      }

      .infoCard {
        position: absolute;
        top: 55px;
        right: 0;
        width: 220px;
        visibility: hidden;
        opacity: 0;
        transition-duration: 350ms;
        transform: translateX(100px);

        .list {
          border-radius: 12px;
          width: 220px;
          padding-top: 5px;
          padding-bottom: 5px;
          height: max-content;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-around;
          @include fill_color('fill2');

          div {
            display: flex;
            margin: 4px 0;
            width: calc(220px - 20px);
            height: min-content;
            border-radius: 12px;
            align-items: center;
            @include fill_color('fill5');

            &:hover {
              @include fill_color('fill3');
            }
          }
        }
      }
    }
  }
}
.navHide {
  position: fixed;
  width: 100%;
  height: 120%;
  display: flex;
  transform: translateY(-10%);
  overflow: hidden;
}

.login {
  position: fixed;
  top: calc(50vh - 200px);
  left: calc(50vw - 250px);
  height: 400px;
  width: 500px;
  @include fill_color('fill2');
  border-radius: 25px;
  animation: backwards 900ms login;
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: space-around;
  z-index: 2002;

  .username,
  .password {
    position: relative;
    width: 100%;
    padding: 5px 40px;
    box-sizing: border-box;
  }
}

.signin {
  position: fixed;
  top: calc(50vh - 250px);
  left: calc(50vw - 250px);
  height: 500px;
  width: 500px;
  @include fill_color('fill2');
  border-radius: 25px;
  animation: backwards 800ms login;
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
}

.loginLabel {
  position: absolute;
  font-size: $fontSize8;
  @include font_color('font3');
  transition-duration: 400ms;
  top: 9px;
  left: 50px;
  border-radius: 10px;

  &:focus {
    @include border_color('fill12');
    @include outline_color('fill12');
  }
}

.loginInput {
  width: 100%;
  padding: 5px 55px;
  box-sizing: border-box;
  border-radius: 10px;
  font-size: $fontSize8;
  @include font_color('font1');
  @include fill_color('fill4');
  transition-duration: 300ms;

  &:focus + .loginLabel {
    transform: translateY(-18px);
    @include font_color('fill11');
    @include fill_color('fill3');
    font-size: $fontSize6;
  }
}

.redirect {
  box-sizing: border-box;
  width: 100%;
  padding: 5px 40px;
  @include font_color('font1');
}

.confirm {
  width: 100px;
  font-size: $fontSize9;
  text-align: center;
  box-sizing: border-box;
  padding: 5px 0;
  margin: 0 0 20px 40px;
  border-radius: 10px;
  @include font_color('font6');
  @include fill_color('fill12');
  transition-duration: 100ms;

  &:hover {
    @include fill_color('fill13');
    @include box_shadow(0, 0, 2px, 2px, 'fill12');
  }
}

.lostPassword,
.toSignin,
.toLogin {
  @include font_color('fill11');
}

.contentBox {
  width: 100%;
  min-width: 800px;
  margin: 55px 0;
  display: flex;
  flex-direction: column;
  z-index: 1;
  @include fill_color('base_page');
}

.switch {
  font-size: $fontSize2;
  position: relative;
  display: inline-block;
  width: 3.5em;
  height: 2em;
  z-index: 100;

  input {
    opacity: 0;
    width: 0;
    height: 0;

    &:checked + .slider {
      background-color: #303136;
    }

    &:checked + .slider:before {
      transform: translateX(1.5em);
      background: #303136;
      box-shadow: inset -3px -2px 5px -2px #8983f7, inset -10px -5px 0 0 #a3dafb;
    }
  }

  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #f4f4f5;
    transition: 0.4s;
    border-radius: 30px;

    &:before {
      position: absolute;
      content: '';
      height: 1.4em;
      width: 1.4em;
      border-radius: 20px;
      left: 0.3em;
      bottom: 0.3em;
      background: linear-gradient(40deg, #ff0080, #ff8c00 70%);
      transition: 0.4s;
    }
  }
}

@keyframes login_bcg {
  0% {
    transform: rotateZ(0deg);
    filter: hue-rotate(0deg);
  }

  20% {
    transform: rotateZ(100deg);
    filter: hue-rotate(70deg);
  }

  40% {
    transform: rotateZ(180deg);
    filter: hue-rotate(140deg);
  }

  60% {
    transform: rotateZ(180deg);
    filter: hue-rotate(210deg);
  }

  80% {
    transform: rotateZ(300deg);
    filter: hue-rotate(280deg);
  }

  100% {
    transform: rotateZ(400deg);
    filter: hue-rotate(0);
  }
}

@keyframes login {
  0% {
    opacity: 0;
    /* transform: translateY(-150px); */
  }

  100% {
    opacity: 1;
  }
}
</style>
