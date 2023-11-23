<template>
  <el-menu
    class="ListEdit"
    mode="horizontal"
  >
    <router-link
      active-class="selected"
      to="/Admin/ListEdit/AddList"
    >
      <el-menu-item index="1">
        <el-icon>
          <Plus />
        </el-icon>
        新增
      </el-menu-item>
    </router-link>
    <router-link
      active-class="selected"
      to="/Admin/ListEdit/UpdateList"
    >
      <el-menu-item index="2">
        <el-icon>
          <Edit />
        </el-icon>
        编辑
      </el-menu-item>
    </router-link>
  </el-menu>
  <el-container>
    <el-main class="Container">
      <div class="ListEdit">
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

<script lang="ts" setup>
import { onMounted } from "@vue/runtime-core";
import { getCurrentInstance } from "vue";
const { proxy } = getCurrentInstance() as any;

function getProblemsList() {
  proxy
    .$get("api/training/list")
    .then((res) => {
      console.log(res);
    });
}

onMounted(() => {
  getProblemsList();
});
</script>

<style scoped lang="scss">
.ListEdit {
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
}</style>