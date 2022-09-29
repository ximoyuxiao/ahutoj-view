<template>
  <div class="navBox">
    <div id="cover"></div>
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
      <img
        v-show="store.state.themeSwitch.theme == 2"
        class="cyberpunkTheme cursor_pointer"
        src="../../assets/image/global/cyberpunk.svg"
        @click="cyberpunkTheme"
      />
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
        @click="props.login"
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
</template>

<script lang="ts" setup>
import { computed, getCurrentInstance, onMounted, reactive, watch } from 'vue'
import { useStore } from 'vuex'
const { proxy } = getCurrentInstance() as any
const store = useStore()

type propsType = {
  login?: Function
}
var props = withDefaults(defineProps<propsType>(), {
  login: () => {},
})

var config = reactive({
  //当前主题
  theme: 1,
})

//处理切换主题事件
function changeTheme() {
  if (config.theme == 1) config.theme = 2
  else config.theme = 1
  store.commit('themeSwitch/switch', config.theme)
}

//切换为赛博朋克风格
function cyberpunkTheme() {
  if (config.theme == 1) config.theme = 2
  proxy.$refs.themeSwitch.checked = true
  store.commit('themeSwitch/switchCyberpunkTheme')
}

//点击个人中心
function intoUserCenter() {
  proxy.$router.push({ path: '/UserCenter' })
}

//进入管理员界面
function intoAdminCenter() {
  proxy.$router.push({ path: '/Admin' })
}

//初始化登录凭证
function initLoginCredentials() {
  sessionStorage.clear()
  localStorage.clear()
  store.commit('userData/logout')
  proxy.$router.replace({ path: '/' })
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

//为了解决props异步响应式丢失的问题
var propsChange = computed(() => {
  return props
})

watch(propsChange, (nv, ov) => {}, {
  deep: true,
})

onMounted(() => {
  refresh()
})
</script>

<style scoped lang="scss">
.navBox {
  top: 0;
  position: fixed;
  width: 100%;
  min-width: 800px;
  height: 55px;
  display: flex;
  justify-content: space-between;
  z-index: 2001;

  #cover {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    @include fill_color('fill1');
    @include box_shadow(0, -4px, 3px, 5px, 'fill13');
    opacity: 0.9;
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
          box-shadow: inset -3px -2px 5px -2px #8983f7,
            inset -10px -5px 0 0 #a3dafb;
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
          @include fill_color('fill1');

          div {
            display: flex;
            margin: 4px 0;
            width: calc(220px - 20px);
            height: min-content;
            border-radius: 12px;
            align-items: center;
            @include fill_color('fill3');

            &:hover {
              @include fill_color('fill2');
            }
          }
        }
      }
    }

    .cyberpunkTheme {
      width: 35px;
      height: 35px;
      margin: 0 20px;
    }
  }
}
</style>