<template>
  <el-menu
    class="contestEdit"
    mode="horizontal"
    router
  >
    <el-menu-item index="/Admin/ContestEdit/AddContest">
      <el-icon>
        <Plus />
      </el-icon>
      新增
    </el-menu-item>
    <el-menu-item index="/Admin/ContestEdit/UpdateContest">
      <el-icon>
        <Edit />
      </el-icon>
      编辑
    </el-menu-item>
  </el-menu>
  <el-container class="Top Bottom">
    <el-main class="Container">
      <div class="contestEdit">
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
  name: 'ContestEdit',
}
</script>

<style scoped lang="scss">
.contestEdit {
  width: 100%;
  overflow: hidden;

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
    // @include fill_color('fill1');
    box-sizing: border-box;
    padding: 0 12px;
    // padding: $adminCenter_contentPadding;
    width: 100%;
    // min-height: 400px;
  }
}
</style>