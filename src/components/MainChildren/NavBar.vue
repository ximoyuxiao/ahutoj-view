<template>
  <el-menu class="navBar" mode="horizontal" :ellipsis="false">
    <router-link to="/Home">
      <el-menu-item index="0" class="logoName navBarComponent">
        AHUT OJ
      </el-menu-item>
    </router-link>
    <router-link active-class="selected" id="problems" to="/Problems">
      <el-menu-item index="1" class="navBarComponent">
        题库
      </el-menu-item>
    </router-link>
    <router-link active-class="selected" id="contests" to="/Contests">
      <el-menu-item index="2" class="navBarComponent">
        比赛
      </el-menu-item>
    </router-link>
    <router-link active-class="selected" id="Lists" to="/Lists">
      <el-menu-item index="3" class="navBarComponent">
        题单
      </el-menu-item>
    </router-link>
    <router-link active-class="selected" id="status" to="/Status">
      <el-menu-item index="4" class="navBarComponent">
        状态
      </el-menu-item>
    </router-link>
    <div class="flex-grow" />
    <el-menu-item index="5" @click="props.config">
      <el-icon size="55px">
        <Setting />
      </el-icon>
    </el-menu-item>
    <div v-if="userDataStore.UserName == ''">
      <el-menu-item @click="props.login" index="6">
        登录
      </el-menu-item>
    </div>
    <div v-else>
      <el-sub-menu index="7">
        <template #title>
          <div class="userName"> {{ userDataStore.UserName }}</div>
        </template>
        <div @click.stop="intoUserCenter()">
          <el-menu-item index="7-1" class="adminComponent">
            <el-icon>
              <User />
            </el-icon>
            个人中心
          </el-menu-item>
        </div>
        <div v-if="userDataStore.PermissionMap > 3" @click.stop="intoAdminCenter()">
          <el-menu-item index="7-2" class="adminComponent">
            <el-icon>
              <Operation />
            </el-icon>
            OJ&nbsp;管理
          </el-menu-item>
        </div>
        <div @click.stop="initLoginCredentials()">
          <el-menu-item index="7-3">
            <el-icon>
              <Close />
            </el-icon>
            退出登录
          </el-menu-item>
        </div>
      </el-sub-menu>
    </div>
  </el-menu>
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

// 为了解决 props 异步响应式丢失的问题
var propsChange = computed(() => {
  return props;
});

watch(propsChange, (nv, ov) => { }, {
  deep: true,
});

// 点击个人中心
function intoUserCenter() {
  proxy.$router.push({ path: "/UserCenter" });
}

// 进入管理员界面
function intoAdminCenter() {
  proxy.$router.push({ path: "/Admin" });
}

// 初始化登录凭证
function initLoginCredentials() {
  userDataStore.logout();
  proxy.$router.replace({ path: "/" });
}
</script>

<style scoped lang="scss">
.flex-grow {
  flex-grow: 1;
}

.navBar {
  height: 55px;
  margin: 0 0 -60px 0;
}

.logoName {
  font-weight: 600;
  font-size: $fontSize4;
}

.userName {
  font-weight: 600;
}

.adminComponent {
  font-size: $fontSize3;
}

.navBarComponent {
  height: 55px;
  font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, \5fae\8f6f\96c5\9ed1, Arial, sans-serif;
  font-size: $fontSize4;

}
</style>