<template>
  <div class="admin">
    <transition
      enter-active-class="animate__animated animate__fadeInLeft"
      leave-active-class="animate__animated animate__fadeOutLeft"
    >
      <div
        class="nav"
        v-if="config.Administrator"
      >
        <router-link
          v-if="config.ProblemAdmin"
          active-class="selected"
          to="/Admin/ProblemEdit"
        >
          题目管理
        </router-link>
        <router-link
          v-if="config.ContestAdmin"
          active-class="selected"
          to="/Admin/ContestEdit"
        >
          竞赛管理
        </router-link>
        <router-link
          v-if="config.ListAdmin"
          active-class="selected"
          to="/Admin/ListEdit"
        >
          题单管理
        </router-link>
        <router-link
          v-if="config.Administrator"
          active-class="selected"
          to="/Admin/UserEdit"
        >
          用户管理
        </router-link>
        <router-link
          v-if="config.SuperAdmin"
          active-class="selected"
          to="/Admin/AdminEdit"
        >
          权限管理
        </router-link>
        <router-link
          v-if="config.Administrator"
          active-class="selected"
          to="/Admin/NoticeEdit"
        >
          公告管理
        </router-link>
      </div>
    </transition>

    <div class="content">
      <router-view v-slot="{ Component }">
        <transition enter-active-class="animate__animated animate__fadeInUp">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
  </div>
</template>

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
</script>

<style scoped lang="scss">
.admin {
  width: 100%;
  position: relative;
  display: flex;
  align-items: flex-start;
  box-sizing: border-box;
  z-index: 1;

  .nav {
    width: 260px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    padding: 20px 0;
    @include fill_color("fill51");

    a {
      width: 100%;
      @include font_color("font6");
      font-size: 28px;
      text-align: center;
      margin: 5px 0;

      &:hover {
        @include fill_color("fill52");
        color: #cdcdcd;
      }
    }

    .selected {
      @include fill_color("fill53");
      color: #cdcdcd;
    }
  }

  .content {
    width: calc(100% - 260px);
  }
}
</style>