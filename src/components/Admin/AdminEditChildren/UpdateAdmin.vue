<script lang="ts" setup>
import { onMounted } from "@vue/runtime-core";
import { getCurrentInstance, reactive } from "vue";
import { useConstValStore } from "../../../pinia/constVal";
import { useUserDataStore } from "../../../pinia/userData";
const { proxy } = getCurrentInstance() as any;
const constValStore = useConstValStore();
const userDataStore = useUserDataStore();
// var page = 0
// var Limit = 20
type PermissionType = {
  UID: string;
  PermissionMap: Number;
  permissionTabel: [boolean, boolean, boolean, boolean, boolean, boolean],
};

var config = reactive({
  search: null,
  Count: 0,
  currentPage: 1,
  limit: 20,
  loading: null,
  init() {
    this.Count = 0;
    this.currentPage = 1;
    this.limit = 20;
    this.loading = null;
  },
  //切换页面
  changePage: (page: number): void => {
    config.currentPage = page;
    SyncUrl();
    adminList.getAdminList();
  },
});

//用于同步浏览器url
function SyncUrl() {
  //仅用于展示实时url，可用于复制跳转
  proxy.$router.replace({
    path: "/Admin/AdminEdit/UpdateAdmin",
    query: {
      Page: config.currentPage,
      Limit: config.limit,
    },
  });
}

var adminList = reactive({
  list: [] as PermissionType[],
  Count: 0,
  getAdminList: () => {
    proxy
      .$get("/api/admin/permission/list/?Page="
        + (config.currentPage - 1)
        + "&Limit="
        + config.limit).then((res: any) => {
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
            config.Count = data.Count;
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
  adminList.getAdminList()
})();
</script>

<template>
  <div class="UpdateAdmin">
    <!-- <el-input
      v-model="search.UID"
      placeholder="请输入UID"
    /> -->
  </div>
  <div class="userInfo">
    <div class="permissionHead">
      <div
        class="header"
        v-for="(item, _) in ['ID', '超管', '资源', '竞赛', '题单', '题目', '管理员', '']"
      >
        {{ item }}
      </div>
    </div>
    <div class="permissionBody">
      <div
        class="body"
        v-for="(permission, _) in adminList.list"
      >
        <div>
          {{ permission.UID }}
        </div>
        <div
          class="select"
          v-for="(_, index) in permission.permissionTabel"
        >
          <el-switch
            v-model="permission.permissionTabel[index]"
            @change="adminList.select(permission, index)"
            :active-value="true"
            :inactive-value="false"
          />
        </div>
        <el-button
          class="botton"
          @click="adminList.ChangePermission(permission)"
        >
          修改
        </el-button>
      </div>
    </div>
  </div>
  <div class="pagination">
    <el-pagination
      background
      layout="prev, pager, next"
      :page-size="config.limit"
      :total="config.Count"
      :current-page="config.currentPage"
      @current-change="config.changePage"
    />
    <!-- <el-radio-group v-model="config.limit" @change="config.changePage(1)" style="margin: 0 20px">
      <el-radio-button :label="20" />
      <el-radio-button :label="30" />
      <el-radio-button :label="50" />
    </el-radio-group> -->
  </div>
</template>

<style scoped lang="scss">
.pagination {
  margin: 12px 0 -12px 0;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  justify-items: center;
}

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