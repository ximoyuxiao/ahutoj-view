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
  <el-menu
    class="navBar Serif"
    mode="horizontal"
    :ellipsis="false"
    :default-active="activeIndex"
    @select="handleSelect"
    router
  >
    <el-menu-item
      index="/Home"
      class="Bold navBarComponent"
    >
      AHUT OJ
    </el-menu-item>
    <el-menu-item
      index="/Problems"
      class="navBarComponent"
    >
      <el-icon>
        <Files />
      </el-icon>
      题库
    </el-menu-item>
    <el-menu-item
      index="/Contests"
      class="navBarComponent"
    >
      <el-icon>
        <SwitchFilled />
      </el-icon>
      比赛
    </el-menu-item>
    <el-menu-item
      index="/Lists"
      class="navBarComponent"
    >
      <el-icon>
        <Tickets />
      </el-icon>
      题单
    </el-menu-item>
    <el-menu-item
      index="/Status"
      class="navBarComponent"
    >
      <el-icon>
        <DataAnalysis />
      </el-icon>
      状态
    </el-menu-item>
    <el-menu-item
      index="/About"
      class="navBarComponent"
    >
      <el-icon>
        <InfoFilled />
      </el-icon>
      关于
    </el-menu-item>
    <div class="flex-grow" />
    <el-menu-item
      @click="props.config"
      index=""
    >
      <el-icon size="55px">
        <Setting />
      </el-icon>
    </el-menu-item>
    <div v-if="userDataStore.UserName == ''">
      <el-menu-item
        @click="props.login"
        index=""
      >
        登录
      </el-menu-item>
    </div>
    <div v-else>
      <el-sub-menu index="">
        <template #title>
          <div
            v-if="userDataStore.PermissionMap > 3"
            class="usertype userAdmin Bold"
          >
            OP
          </div>
          <div class="Bold"> {{ userDataStore.UserName }}</div>
        </template>
        <div @click.stop="intoUserCenter()">
          <el-menu-item
            index=""
            class="adminComponent"
          >
            <el-icon>
              <User />
            </el-icon>
            个人中心
          </el-menu-item>
        </div>
        <div
          v-if="userDataStore.PermissionMap > 3"
          @click.stop="intoAdminCenter()"
        >
          <el-menu-item
            index="7-2"
            class="adminComponent"
          >
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
.usertype {
  height: 22px;
  width: 32px;
  margin-right: 6px;
  border-radius: 6px;
  color: #fff;
  text-align: center;
  display: block;
  line-height: 22px;
}

.userAdmin {
  background-color: black;
}

.flex-grow {
  flex-grow: 1;
}

.adminComponent {
  font-size: $fontSize4;
}

.navBarComponent {
  font-size: $fontSize4;
}
</style>