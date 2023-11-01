<script lang="ts" setup>
import { computed, getCurrentInstance, onMounted, reactive, watch } from "vue";
import { useUserDataStore } from "../../pinia/userData";
import { ref } from 'vue'
const activeIndex = ref('1')
const activeIndex2 = ref('1')
const handleSelect = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
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
<template>
  <el-menu class="navBar Serif" mode="horizontal" :ellipsis="false" :default-active="activeIndex" @select="handleSelect">
    <router-link to="/Home">
      <el-menu-item index="0" class="Bold navBarComponent">
        AHUT OJ
      </el-menu-item>
    </router-link>
    <router-link active-class="selected" id="problems" to="/Problems">
      <el-menu-item index="1" class="navBarComponent">
        <el-icon>
          <Files />
        </el-icon>
        题库
      </el-menu-item>
    </router-link>
    <router-link active-class="selected" id="contests" to="/Contests">
      <el-menu-item index="2" class="navBarComponent">
        <el-icon>
          <SwitchFilled />
        </el-icon>
        比赛
      </el-menu-item>
    </router-link>
    <router-link active-class="selected" id="Lists" to="/Lists">
      <el-menu-item index="3" class="navBarComponent">
        <el-icon>
          <Tickets />
        </el-icon>
        题单
      </el-menu-item>
    </router-link>
    <router-link active-class="selected" id="status" to="/Status">
      <el-menu-item index="4" class="navBarComponent">
        <el-icon>
          <DataAnalysis />
        </el-icon>
        状态
      </el-menu-item>
    </router-link>
    <router-link active-class="selected" id="status" to="/About">
      <el-menu-item index="5" class="navBarComponent">
        <el-icon>
          <InfoFilled />
        </el-icon>
        关于
      </el-menu-item>
    </router-link>
    <div class="flex-grow" />
    <el-menu-item index="6" @click="props.config">
      <el-icon size="55px">
        <Setting />
      </el-icon>
    </el-menu-item>
    <div v-if="userDataStore.UserName == ''">
      <el-menu-item @click="props.login" index="7">
        登录
      </el-menu-item>
    </div>
    <div v-else>
      <el-sub-menu index="8">
        <template #title>
          <div class="Bold"> {{ userDataStore.UserName }}</div>
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


<style scoped lang="scss">
.flex-grow {
  flex-grow: 1;
}

.navBar {
}

.adminComponent {
  font-size: $fontSize4;
}

.navBarComponent {
  font-size: $fontSize4;
}
</style>