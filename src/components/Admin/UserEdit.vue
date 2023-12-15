<template>
  <el-menu
    class="UserEdit"
    mode="horizontal"
    router
  >
    <el-menu-item index="/Admin/UserEdit/AddUser">
      <el-icon>
        <Plus />
      </el-icon>
      新增
    </el-menu-item>
    <el-menu-item index="/Admin/UserEdit/UpdateUser">
      <el-icon>
        <Edit />
      </el-icon>
      编辑
    </el-menu-item>
    <el-menu-item index="/Admin/UserEdit/BatchAddUser">
      <el-icon>
        <Upload />
      </el-icon>
      批量导入
    </el-menu-item>
  </el-menu>
  <el-container class="Top Bottom">
    <el-main class="Container">
      <div class="UserEdit">
        <div class="content">
          <router-view v-slot="{ Component }">
            <transition enter-active-class="animate__animated animate__fadeInRight">
              <component :is="Component" />
            </transition>
          </router-view>
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script lang="ts">
export default {
  name: 'UserEdit',
}
</script>

<style scoped lang="scss">
.UserEdit {
  width: 100%;

  .nav {
    display: flex;
    box-sizing: border-box;
    padding: 10px 10px;
    align-items: center;
    justify-content: centers;
    @include fill_color('fill3');

    >a {
      box-sizing: border-box;
      padding: 5px 15px;
      font-size: $fontSize7;
      border-bottom: 2px solid;
      @include border_color('base_trans');
      @include font_color('font2');

      &:hover {
        @include fill_color('fill1');
      }
    }

    >.selected {
      border-bottom: 2px solid;
      @include border_color('fill21');
    }
  }

  .content {
    box-sizing: border-box;
    padding: 12px;
    // padding: $adminCenter_contentPadding;
    width: 100%;
    // min-height: 500px;
  }
}
</style>