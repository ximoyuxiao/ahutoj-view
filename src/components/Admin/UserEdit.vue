<template>
  <el-menu class="UserEdit" mode="horizontal">
    <router-link active-class="selected" to="/Admin/UserEdit/AddUser">
      <el-menu-item index="1">
        新增
      </el-menu-item>
    </router-link>
    <router-link active-class="selected" to="/Admin/UserEdit/UpdateUser">
      <el-menu-item index="2">
        编辑
      </el-menu-item>
    </router-link>
    <router-link active-class="selected" to="/Admin/UserEdit/BatchAddUser">
      <el-menu-item index="3">
        批量导入
      </el-menu-item>
    </router-link>
  </el-menu>
  <div class="UserEdit">
    <div class="content">
      <router-view v-slot="{ Component }">
        <transition enter-active-class="animate__animated animate__fadeInRight">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
  </div>
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
    background-color: #ffffff;
    box-sizing: border-box;
    padding: $adminCenter_contentPadding;
    width: 100%;
    min-height: 400px;
  }
}
</style>