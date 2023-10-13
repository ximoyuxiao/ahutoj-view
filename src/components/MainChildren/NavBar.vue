<template>
  <!-- <el-menu class="contestEdit" mode="horizontal" style="margin: 55px 0px;"> -->
  <el-menu class="contestEdit" mode="horizontal">
    <router-link to="/Home">
      <el-menu-item>
        AHUT OJ
      </el-menu-item>
    </router-link>
    <router-link active-class="selected" id="problems" to="/Problems">
      <el-menu-item index="1">
        题库
      </el-menu-item>
    </router-link>
    <router-link active-class="selected" id="contests" to="/Contests">
      <el-menu-item index="2">
        比赛
      </el-menu-item>
    </router-link>
    <router-link active-class="selected" id="Lists" to="/Lists">
      <el-menu-item index="3">
        题单
      </el-menu-item>
    </router-link>
    <router-link active-class="selected" id="status" to="/Contests">
      <el-menu-item index="4">
        状态
      </el-menu-item>
    </router-link>
    <div class="flex-grow" />
    <!--<router-link active-class="selected" id="status" to="/Contests">
      <el-menu-item index="1">
        状态
      </el-menu-item>
    </router-link> -->
    <el-menu-item>
      <el-icon size="55px" class="config" @click="props.config">
        <Setting />
      </el-icon>
    </el-menu-item>
    <el-menu-item>

      <!-- <div class="right"> -->
        <div class="cursor_pointer" v-if="userDataStore.UserName == ''" @click.stop="props.login">
          <span>登录</span>
        </div>
        <div class="username cursor_pointer" v-else>
          <span style="font-weight: 600">
            {{ userDataStore.UserName }}
          </span>
          <div class="infoCard">
            <div style="height: 10px"></div>
            <div class="list">
              <div @click.stop="intoUserCenter()">
                <el-icon>
                  <User />
                </el-icon>&nbsp;个人中心
              </div>
              <div v-if="userDataStore.PermissionMap > 3" @click.stop="intoAdminCenter()">
                <el-icon>
                  <Operation />
                </el-icon>&nbsp;管理
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
      <!-- </div> -->
    </el-menu-item>
  </el-menu>
  <!-- <div class="navBox">
    <div id="cover"></div>
    <div class="left">
      <div id="name">
        <router-link to="/Home">AHUT OJ</router-link>
      </div>
      <router-link id="problems" active-class="selected" to="/Problems">
        题库
      </router-link>
      <router-link id="contests" active-class="selected" to="/Contests">
        比赛
      </router-link>
      <router-link id="Lists" active-class="selected" to="/Lists">
        题单
      </router-link>
      <router-link id="status" active-class="selected" to="/Status">
        状态
      </router-link>
    </div>

    <div class="right">
      <el-icon size="32px" class="config" @click="props.config">
        <Setting />
      </el-icon>
      <div class="cursor_pointer" v-if="userDataStore.UserName == ''" @click.stop="props.login">
        <span>登录</span>
      </div>
      <div class="username cursor_pointer" v-else>
        <span style="font-weight: 600">
          {{ userDataStore.UserName }}
        </span>
        <div class="infoCard">
          <div style="height: 10px"></div>
          <div class="list">
            <div @click.stop="intoUserCenter()">
              <el-icon>
                <User />
              </el-icon>&nbsp;个人中心
            </div>
            <div v-if="userDataStore.PermissionMap > 3" @click.stop="intoAdminCenter()">
              <el-icon>
                <Operation />
              </el-icon>&nbsp;管理
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
  </div> -->
</template>

<script lang="ts" setup>
import { computed, getCurrentInstance, onMounted, reactive, watch } from "vue";
import { useUserDataStore } from "../../pinia/userData";
const { proxy } = getCurrentInstance() as any;
const userDataStore = useUserDataStore();

type propsType = {
  login?: Function;
  config?: Function;
};
var props = withDefaults(defineProps<propsType>(), {
  login: () => { },
  config: () => { },
});

//为了解决props异步响应式丢失的问题
var propsChange = computed(() => {
  return props;
});

watch(propsChange, (nv, ov) => { }, {
  deep: true,
});

//点击个人中心
function intoUserCenter() {
  proxy.$router.push({ path: "/UserCenter" });
}

//进入管理员界面
function intoAdminCenter() {
  proxy.$router.push({ path: "/Admin" });
}

//初始化登录凭证
function initLoginCredentials() {
  userDataStore.logout();
  proxy.$router.replace({ path: "/" });
}
</script>

<style scoped lang="scss">

.flex-grow {
  flex-grow: 1;
}

.navBox {
  top: 0;
  position: fixed;
  width: 100%;
  min-width: 800px;
  height: 55px;
  display: flex;
  justify-content: space-between;
  z-index: $navBar_zindex;
  transition-duration: 200ms;

  &:hover {
    filter: drop-shadow(0 0 1px #99999999);
  }

  #cover {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    @include fill_color("fill1");
    // @include box_shadow(0, -4px, 3px, 5px, "fill13");
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

      &:hover>a {
        @include font_color("fill12");
      }

      a {
        height: 100%;
        display: block;
        @include font_color("font1");
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
      @include font_color("font1");
      height: 100%;
      box-sizing: border-box;
      padding: 0 18px;
      text-align: center;
      font-size: $fontSize5;
      line-height: 55px;
      transition-duration: 400ms;

      &:hover {
        @include font_color("fill11");
      }
    }

    .selected {
      border-bottom: 3px solid;
      @include border_color("fill13");
      @include fill_color("fill15");
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
      @include font_color("font1");
      height: 55px;
      line-height: 55px;
      z-index: 100;
    }

    .config {
      display: block;
      @include font_color("font1");
      transition-duration: 300ms;
      margin: 0 20px;
      box-sizing: border-box;

      &:hover {
        @include font_color("fill12");
      }
    }

    // .switch {
    //   font-size: $fontSize2;
    //   position: relative;
    //   display: inline-block;
    //   width: 3.5em;
    //   height: 2em;
    //   z-index: 100;

    //   input {
    //     opacity: 0;
    //     width: 0;
    //     height: 0;

    //     &:checked + .slider {
    //       background-color: #303136;
    //     }

    //     &:checked + .slider:before {
    //       transform: translateX(1.5em);
    //       background: #303136;
    //       box-shadow: inset -3px -2px 5px -2px #8983f7,
    //         inset -10px -5px 0 0 #a3dafb;
    //     }
    //   }

    //   .slider {
    //     position: absolute;
    //     cursor: pointer;
    //     top: 0;
    //     left: 0;
    //     right: 0;
    //     bottom: 0;
    //     background-color: #f4f4f5;
    //     transition: 0.4s;
    //     border-radius: 30px;

    //     &:before {
    //       position: absolute;
    //       content: "";
    //       height: 1.4em;
    //       width: 1.4em;
    //       border-radius: 20px;
    //       left: 0.3em;
    //       bottom: 0.3em;
    //       background: linear-gradient(40deg, #ff0080, #ff8c00 70%);
    //       transition: 0.4s;
    //     }
    //   }
    // }

    .username {
      position: relative;

      &:hover>.infoCard {
        visibility: visible;
        opacity: 1;
        transform: translateX(-30px);
      }

      &:hover>span {
        @include font_color("fill12");
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
          @include fill_color("fill1");

          div {
            display: flex;
            margin: 4px 0;
            width: calc(220px - 20px);
            height: min-content;
            border-radius: 12px;
            align-items: center;
            @include fill_color("fill3");

            &:hover {
              @include fill_color("fill2");
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