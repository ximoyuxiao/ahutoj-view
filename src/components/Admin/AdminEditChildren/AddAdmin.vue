<template>
  <div class="AddAdmin">
    <div class="input">
      <span>UID：</span>
      <el-input
        v-model="search.UID"
        @focus="()=>{search.isSearched = false}"
      />
    </div>
    <el-button @click="search.getInfo">搜索</el-button>
    <!-- 任务卡片 -->
    <div
      class="userInfo"
      v-show="search.isSearched"
    >
      <div>《身份确认》</div>
      <div>用户名：{{search.UID}}</div>
      <div>昵称：{{search.UserName}}</div>
      <div>学校：{{search.School}}</div>
      <div>班级：{{search.Classes}}</div>
      <div>邮箱：{{search.Email}}</div>
      <div class="permissionTabel">
        <div
          class="header"
          v-for="(item,index) in ['超级管理员','资源管理员','竞赛管理员','题单管理员','题目管理员','管理员']"
        >
          {{item}}
        </div>
        <div
          class="select"
          v-for="(item,index) in search.permissionTabel"
        >
          <el-switch
            v-model="search.permissionTabel[index]"
            style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
            @change="search.select(index)"
            :active-value="true"
            :inactive-value="false"
          />
        </div>
      </div>
      <el-button @click="confirm" >确认</el-button>
    </div>
  </div>

</template>

<script lang="ts" setup>
import { getCurrentInstance, onMounted, reactive } from 'vue'
import { useStore } from 'vuex'
const { proxy } = getCurrentInstance() as any
const store = useStore()

type searchType = {
  UID: string
  Adept: string
  Classes: string
  Email: string
  Major: string
  School: string
  UserName: string
  Vjid: string
  getInfo: Function
  [item: string]: any
}
var search = reactive<searchType>({
  UID: '',
  Adept: '',
  Classes: '',
  Email: '',
  Major: '',
  School: '',
  UserName: '',
  Vjid: '',
  PermissionMap: 0,
  permissionTabel: [false, false, false, false, false, false],
  isSearched: false,
  copy: (data: any): void => {
    search.UID = data.UID
    search.Adept = data.Adept
    search.Classes = data.Classes
    search.Email = data.Email
    search.Major = data.Major
    search.School = data.School
    search.UserName = data.UserName
    search.Vjid = data.Vjid
  },
  getInfo: async (): Promise<void> => {
    if (!search.UID) {
      proxy.elMessage({ message: '输入的UID不能为空!', type: 'warning' })
      return
    }
    proxy.$get('api/user/info?UID=' + search.UID).then((res: any) => {
      let data = res.data
      if (data.code == 0) {
        search.copy(data)
        proxy.$get('api/admin/permission/' + search.UID).then((res: any) => {
          let data = res.data
          if (data.code == 0) {
            search.PermissionMap = Number(data.PermissionMap)
            search.isSearched = true
            if (
              (search.PermissionMap & store.state.constVal.AdministratorBit) >
              0
            )
              search.permissionTabel[5] = true
            else search.permissionTabel[5] = false
            if (
              (search.PermissionMap & store.state.constVal.ProblemAdminBit) >
              0
            )
              search.permissionTabel[5] = search.permissionTabel[4] = true
            else search.permissionTabel[4] = false
            if ((search.PermissionMap & store.state.constVal.ListAdminBit) > 0)
              search.permissionTabel[5] = search.permissionTabel[3] = true
            else search.permissionTabel[3] = false
            if (
              (search.PermissionMap & store.state.constVal.ContestAdminBit) >
              0
            )
              search.permissionTabel[5] = search.permissionTabel[2] = true
            else search.permissionTabel[2] = false
            if (
              (search.PermissionMap & store.state.constVal.SourceBorwserBit) >
              0
            )
              search.permissionTabel[5] = search.permissionTabel[1] = true
            else search.permissionTabel[1] = false
            if ((search.PermissionMap & store.state.constVal.SuperAdminBit) > 0)
              for (let i in search.permissionTabel) {
                search.permissionTabel[i] = true
              }
            else search.permissionTabel[0] = false
          }
        })
      } else {
        proxy.codeProcessor(data.code)
        return
      }
    })
  },
  select: (index: number) => {
    let result = search.permissionTabel[index]
    if (index == 0 && result) {
      for (let i in search.permissionTabel) {
        search.permissionTabel[i] = true
      }
      proxy.elMessage({
        message: '注意，你将赋予 超级管理员 权限！',
        type: 'warning',
      })
    }
    if (index == 0 && !result && store.state.userData.UID == search.UID) {
      proxy.elMessage({
        message: '注意，你将取消自己的 超级管理员 权限！',
        type: 'warning',
      })
    }
    if (index != 0 && !result && search.permissionTabel[0]) {
      proxy.elMessage({
        message: '注意，你将取消 超级管理员 的次级权限，这可能是无效的！',
        type: 'warning',
      })
    }
  },
})

function confirm() {
  proxy.$post("api/admin/")
}
</script>

<style scoped lang="scss">
.AddAdmin {
  display: flex;
  flex-direction: column;

  .input {
    display: flex;
    align-items: center;

    span {
      @include font_color('font1');
      font-size: $fontSize6;
    }
  }

  .userInfo {
    display: flex;
    flex-direction: column;
    font-size: $fontSize6;
    @include font_color('font1');

    div {
      &:nth-child(1) {
        font-size: $fontSize8;
        @include font_color('fill41');
      }
    }

    .permissionTabel {
      margin: 20px 0;
      width: 100%;
      display: grid;
      grid-template-columns: repeat(6, calc(100% / 6));
      grid-template-rows: repeat(2, 40px);
      @include fill_color('fill4');

      .header {
        font-size: $fontSize7;
        @include font_color('font1');
        @include fill_color('fill34');
        line-height: 40px;
        text-align: center;
      }

      .select {
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
}
</style>