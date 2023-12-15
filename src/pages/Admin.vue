<script lang="ts" setup>
import { getCurrentInstance, onMounted, reactive } from "vue";
import { useConstValStore } from "../pinia/constVal";
import { useUserDataStore } from "../pinia/userData";
const { proxy } = getCurrentInstance() as any;
const userDataStore = useUserDataStore();
const constValStore = useConstValStore();

//页面配置
type configType = {
  Administrator: boolean;
  ProblemAdmin: boolean;
  ContestAdmin: boolean;
  SourceBorwser: boolean;
  ListAdmin: boolean;
  SuperAdmin: boolean;
};
var config = reactive<configType>({
  Administrator: false,
  ProblemAdmin: false,
  ContestAdmin: false,
  SourceBorwser: false,
  ListAdmin: false,
  SuperAdmin: false,
});

//身份验证
function checkPermission() {
  let Token = localStorage.getItem("ahutOjToken");
  let UID = localStorage.getItem("ahutOjUserUid");
  if (!userDataStore.isLogin) {
    proxy.elMessage({ message: "登录状态无效!", type: "warning" });
    exit();
    return;
  }
  if (userDataStore.UID != UID || !Token) {
    proxy.elMessage({
      message: "登录身份验证不通过!",
      type: "warning",
    });
    exit();
    return;
  }

  //服务器权限验证
  proxy.$axios.get("api/admin/permission/" + UID).then((res) => {
    let data = res.data;
    if (data.code == 0) {
      // proxy.$log(data);
      permissionParser(data.PermissionMap);
    }
    proxy.codeProcessor(
      data?.code ?? 100001,
      data?.msg ?? "服务器错误\\\\error"
    );
  });
}

//权限解析器
function permissionParser(PermissionMap) {
  // proxy.$log(permission);
  if (PermissionMap <= 3) {
    proxy.elMessage({
      message: "权限验证未通过，你无权访问",
      type: "error",
    });
    exit();
    return;
  }
  //管理员身份验证通过
  config.Administrator = true;
  let permissionTabel =
    "<span>你的权限表:</span><br/>\
        <span style='color: #00ccff'>管理员</span>";

  //超管
  if ((PermissionMap & constValStore.SuperAdminBit) != 0) {
    config.SuperAdmin = true;
    config.ProblemAdmin = true;
    config.ContestAdmin = true;
    config.ListAdmin = true;
    config.SourceBorwser = true;
  }
  permissionTabel += config.SuperAdmin
    ? "<br /><span style='color: #6741d9'>超级管理员</span>"
    : "<br /><span style='color: #ff3300'>超级管理员</span>";

  //题目编辑
  if ((PermissionMap & constValStore.ProblemAdminBit) != 0) {
    config.ProblemAdmin = true;
  }
  permissionTabel += config.ProblemAdmin
    ? "<br /><span style='color: #5ebd00'>题目编辑</span>"
    : "<br /><span style='color: #ff3300'>题目编辑</span>";

  //竞赛编辑
  if ((PermissionMap & constValStore.ContestAdminBit) != 0) {
    config.ContestAdmin = true;
  }
  permissionTabel += config.ContestAdmin
    ? "<br /><span style='color: #5ebd00'>竞赛编辑</span>"
    : "<br /><span style='color: #ff3300'>竞赛编辑</span>";

  //资源管理
  if ((PermissionMap & constValStore.SourceBorwserBit) != 0) {
    config.SourceBorwser = true;
  }
  permissionTabel += config.SourceBorwser
    ? "<br /><span style='color: #5ebd00'>资源管理</span>"
    : "<br /><span style='color: #ff3300'>资源管理</span>";

  //题单编辑
  if ((PermissionMap & constValStore.ListAdminBit) != 0) {
    config.ListAdmin = true;
  }
  permissionTabel += config.ListAdmin
    ? "<br /><span style='color: #5ebd00'>题单编辑</span>"
    : "<br /><span style='color: #ff3300'>题单编辑</span>";

  proxy.elNotification({
    title: "欢迎来到管理界面",
    message: permissionTabel,
    type: "success",
    duration: 3000,
    dangerouslyUseHTMLString: true,
    offset: 100,
  });
}

//退出
function exit() {
  proxy.$router.replace({ path: "Home" });
}

onMounted(() => {
  checkPermission();
});

const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
};
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
};

</script>

<template>
  <el-container
    v-if="config.Administrator"
    class="main"
  >
    <el-aside class="main-aside">
      <el-menu
        active-text-color="#ffd04b"
        background-color="#262626"
        class="menu"
        default-active="/Admin/Stastics"
        text-color="#fff"
        @open="handleOpen"
        @close="handleClose"
        router
      >
        <el-menu-item index="/Admin/Stastics">
          <el-icon>
            <DataAnalysis />
          </el-icon>
          <span>报表</span>
        </el-menu-item>
        <el-menu-item
          index="/Admin/ProblemEdit"
          v-if="config.ProblemAdmin"
        >
          <el-icon>
            <Tickets />
          </el-icon>
          <span>题目</span>
        </el-menu-item>
        <el-menu-item index="/Admin/DataGenerator">
          <el-icon>
            <Tickets />
          </el-icon>
          <span>数据生成器</span>
        </el-menu-item>
        <!-- <el-sub-menu
          index="2"
          v-if="config.ProblemAdmin"
        >
          <template #title>
            <el-icon>
              <Tickets />
            </el-icon>
            <span>题目</span>
          </template>
          <el-menu-item-group title="Group One">
            <el-menu-item index="1-1">item one</el-menu-item>
            <el-menu-item index="1-2">item two</el-menu-item>
          </el-menu-item-group>
          <el-sub-menu index="1-4">
            <template #title>item four</template>
            <el-menu-item index="1-4-1">item one</el-menu-item>
          </el-sub-menu>
        </el-sub-menu> -->
        <!-- <el-menu-item index="2">
          <el-icon>
            <Coin />
          </el-icon>
          <span>数据</span>
        </el-menu-item> -->
        <el-menu-item
          index="/Admin/ContestEdit"
          v-if="config.ContestAdmin"
        >
          <el-icon>
            <SwitchFilled />
          </el-icon>
          <span>比赛</span>
        </el-menu-item>
        <el-menu-item
          index="/Admin/ListEdit"
          v-if="config.ListAdmin"
        >
          <el-icon>
            <Files />
          </el-icon>
          <span>题单</span>
        </el-menu-item>
        <el-menu-item
          index="/Admin/UserEdit"
          v-if="config.Administrator"
        >
          <el-icon>
            <User />
          </el-icon>
          <span>用户</span>
        </el-menu-item>
        <el-menu-item
          index="/Admin/AdminEdit"
          v-if="config.SuperAdmin"
        >
          <el-icon>
            <Lock />
          </el-icon>
          <span>权限</span>
        </el-menu-item>
        <el-menu-item
          index="/Admin/NoticeEdit"
          v-if="config.Administrator"
        >
          <el-icon>
            <Notification />
          </el-icon>
          <span>公告</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-main class="mainComponent">
      <div class="admin Bottom">
        <router-view v-slot="{ Component }">
          <transition enter-active-class="animate__animated animate__fadeInUp">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </el-main>
  </el-container>
</template>

<style scoped lang="scss">

.mainComponent {
  padding: 0;
}

.main {
  // height: 100%;
  height: calc(100vh - 57.8px);

  .main-aside {
    width: 160px;

    .menu {
      width: 160px;
      height: 100%;
    }
  }
}


.admin {
  width: min(100%, 1200px);
}
</style>