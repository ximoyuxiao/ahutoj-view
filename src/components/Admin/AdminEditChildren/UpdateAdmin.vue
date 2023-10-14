<template>
  <div class="UpdateAdmin">
    <!-- <el-input
      v-model="search.UID"
      placeholder="请输入UID"
    /> -->
  </div>
  <div class="userInfo">
    <div class="permissionHead">
      <div class="header" v-for="(item, _) in ['用户ID', '超管', '资源', '竞赛', '题单', '题目', '管理员', '修改权限']">
        {{ item }}
      </div>
    </div>
    <div class="permissionBody">
      <div class="body" v-for="(permission, _) in adminList.list">
        <div>
          {{ permission.UID }}
        </div>
        <div class="select" v-for="(_, index) in permission.permissionTabel">
          <el-switch v-model="permission.permissionTabel[index]"
            style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
            @change="adminList.select(permission, index)" :active-value="true" :inactive-value="false" />
        </div>
        <el-button class="botton" @click="adminList.ChangePermission(permission)">
          修改
        </el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from "@vue/runtime-core";
import { getCurrentInstance, reactive } from "vue";
import { useConstValStore } from "../../../pinia/constVal";
import { useUserDataStore } from "../../../pinia/userData";
const { proxy } = getCurrentInstance() as any;
const constValStore = useConstValStore();
const userDataStore = useUserDataStore();
var page = 0
var Limit = 20
type PermissionType = {
  UID: string;
  PermissionMap: Number;
  permissionTabel: [boolean, boolean, boolean, boolean, boolean, boolean],
};
var adminList = reactive({
  list: [] as PermissionType[],
  Count: 0,
  gatAdminList: () => {
    proxy.$get("/api/admin/permission/list/?Page=" + page + "&Limit=" + Limit).then((res: any) => {
      var data = res.data;
      if (data.code === 0) {
        console.log(res.data);
        const parsedList = (data.Data as { UID: string, PermissionMap: Number }[]).map(item => {
          const permission: PermissionType = {
            UID: item.UID,
            PermissionMap: item.PermissionMap,
            permissionTabel: [false, false, false, false, false, false],
          };
          // 进行权限解析并将权限表存入 permission.permissionTabel
          adminList.ParsePermission(permission);
          return permission;
        });
        adminList.list = parsedList;
        adminList.Count = data.Count;
      }
    });
  },
  ParsePermission(permission: any) {
    console.log(permission)
    if ((permission.PermissionMap & constValStore.AdministratorBit) > 0)
      permission.permissionTabel[5] = true;
    else permission.permissionTabel[5] = false;
    if ((permission.PermissionMap & constValStore.ProblemAdminBit) > 0)
      permission.permissionTabel[5] = permission.permissionTabel[4] = true;
    else permission.permissionTabel[4] = false;
    if ((permission.PermissionMap & constValStore.ListAdminBit) > 0)
      permission.permissionTabel[5] = permission.permissionTabel[3] = true;
    else permission.permissionTabel[3] = false;
    if ((permission.PermissionMap & constValStore.ContestAdminBit) > 0)
      permission.permissionTabel[5] = permission.permissionTabel[2] = true;
    else permission.permissionTabel[2] = false;
    if ((permission.PermissionMap & constValStore.SourceBorwserBit) > 0)
      permission.permissionTabel[5] = permission.permissionTabel[1] = true;
    else permission.permissionTabel[1] = false;
    if ((permission.PermissionMap & constValStore.SuperAdminBit) > 0)
      for (let i in permission.permissionTabel) {
        permission.permissionTabel[i] = true;
      }
    else permission.permissionTabel[0] = false;
    console.log(permission)
  },

  select(permission: PermissionType, index: number) {
    let result = permission.permissionTabel[index];
    if (index == 0 && result) {
      for (let i in permission.permissionTabel) {
        permission.permissionTabel[i] = true;
      }
      proxy.elMessage({
        message: "注意，你将赋予 超级管理员 权限！",
        type: "warning",
      });
    }
    if (index == 0 && !result && userDataStore.UID == permission.UID) {
      proxy.elMessage({
        message: "注意，你将取消自己的 超级管理员 权限！",
        type: "warning",
      });
    }
    if (index != 0 && !result && permission.permissionTabel[0]) {
      proxy.elMessage({
        message: "注意，你将取消 超级管理员 的次级权限，这可能是无效的！",
        type: "warning",
      });
    }
  },
  ChangePermission(permission: PermissionType) {
    console.log(permission)
    proxy
      .$post("api/admin/permission/edit/", {
        UID: permission.UID,
        SuperAdmin: permission.permissionTabel[0],
        SourceAdmin: permission.permissionTabel[1],
        ContestAdmin: permission.permissionTabel[2],
        ListAdmin: permission.permissionTabel[3],
        ProbelmAdmin: permission.permissionTabel[4],
      })
      .then((res: any) => {
        let data = res.data;
        if (data.code == 0) {
          proxy.elMessage({
            message: "修改成功",
            type: "success",
          });
        }
        proxy.codeProcessor(
          data?.code ?? 100001,
          data?.msg ?? "服务器错误\\\\error"
        );
      });
  },
});

(() => {
  adminList.gatAdminList()
})();
</script>

<style scoped lang="scss">
.userInfo {

  display: flex;
  flex-direction: column;
  font-size: $fontSize6;
  @include font_color("font1");

  .permissionHead {
    // margin: 20px 0;
    margin-top: 20px;
    width: 100%;
    display: grid;
    grid-template-columns: repeat(8, calc(100% / 8));
    // grid-template-rows: repeat(0, 40px);
    @include fill_color("fill4");

    .header {
      font-size: $fontSize7;
      @include font_color("font1");
      @include fill_color("fill34");
      line-height: 40px;
      text-align: center;
    }


  }

  .permissionBody {
    // overflow-y: scroll;
    margin-bottom: 20px;
    width: 100%;
    display: grid;
    @include fill_color("fill4");

    .body {
      font-size: $fontSize7;
      @include font_color("font1");
      display: grid;
      grid-template-columns: repeat(8, calc(100% / 8));
      // @include fill_color("fill34");
      line-height: 40px;
      text-align: center;
    }

    .select {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .botton {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>