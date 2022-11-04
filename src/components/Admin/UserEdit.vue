<template>
  <div class="UserEdit">
    <div class="nav">
      <router-link
        active-class="selected"
        to="/Admin/UserEdit/AddUser"
      >
        添加用户
      </router-link>
      <el-divider direction="vertical" />
      <router-link
        active-class="selected"
        to="/Admin/UserEdit/BatchAddUser"
      >
        批量添加用户
      </router-link>
      <el-divider direction="vertical" />
      <router-link
        active-class="selected"
        to="/Admin/UserEdit/UpdateUser"
      >
        修改用户
      </router-link>
    </div>

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

    > a {
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

    > .selected {
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