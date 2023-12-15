<template>
  <el-menu
    class="contestEdit"
    mode="horizontal"
    router
  >
    <el-menu-item index="/Admin/AdminEdit/AddAdmin">
      <el-icon>
        <Plus />
      </el-icon>
      新增权限
    </el-menu-item>
    <el-menu-item index="/Admin/AdminEdit/UpdateAdmin">
      <el-icon>
        <Tickets />
      </el-icon>
      权限列表
    </el-menu-item>
  </el-menu>
  <div class="AdminEdit Top Bottom">
    <div class="content">
      <router-view v-slot="{ Component }">
        <transition enter-active-class="animate__animated animate__fadeInRight">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { getCurrentInstance } from "vue";
const { proxy } = getCurrentInstance() as any;
</script>

<style scoped lang="scss">
.AdminEdit {
  width: 100%;
  overflow: hidden;

  .nav {
    display: flex;
    box-sizing: border-box;
    padding: 10px 10px;
    align-items: center;
    justify-content: centers;
    @include fill_color("fill3");

    >a {
      box-sizing: border-box;
      padding: 5px 15px;
      font-size: $fontSize7;
      border-bottom: 2px solid;
      @include border_color("base_trans");
      @include font_color("font2");

      &:hover {
        @include fill_color("fill1");
      }
    }

    >.selected {
      border-bottom: 2px solid;
      @include border_color("fill21");
    }
  }

  .content {
    // @include fill_color("fill1");
    box-sizing: border-box;
    padding: 12px;
    // padding: $adminCenter_contentPadding;
    width: 100%;
    // min-height: 400px;
  }
}
</style>