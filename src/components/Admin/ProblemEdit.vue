<script lang="ts">
export default {
  name: "ProblemEdit",
};
</script>

<template>
  <el-menu
    class="ProblemEdit"
    mode="horizontal"
  >
    <router-link
      active-class="selected"
      to="/Admin/ProblemEdit/AddProblem"
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
      to="/Admin/ProblemEdit/UpdateProblem"
    >
      <el-menu-item index="2">
        <el-icon>
          <Edit />
        </el-icon>
        编辑
      </el-menu-item>
    </router-link>
    <router-link
      active-class="selected"
      to="/Admin/ProblemEdit/EditProblemJudgeFile"
    >
      <el-menu-item index="3">
        <el-icon>
          <DocumentChecked />
        </el-icon>
        数据
      </el-menu-item>
    </router-link>
    <router-link
      active-class="selected"
      to="/Admin/ProblemEdit/Rejudge"
    >
      <el-menu-item index="4">
        <el-icon>
          <RefreshRight />
        </el-icon>
        重判
      </el-menu-item>
    </router-link>
    <router-link
      active-class="selected"
      to="/Admin/ProblemEdit/UploadProblem"
    >
      <el-menu-item index="5">
        <el-icon>
          <Upload />
        </el-icon>
        导入
      </el-menu-item>
    </router-link>
    <router-link
      active-class="selected"
      to="/Admin/ProblemEdit/DownloadProblem"
    >
      <el-menu-item index="6">
        <el-icon>
          <Download />
        </el-icon>
        导出
      </el-menu-item>
    </router-link>
  </el-menu>
  <div class="ProblemEdit">
    <div class="content">
      <router-view v-slot="{ Component }">
        <transition enter-active-class="animate__animated animate__fadeInRight">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
  </div>
</template>

<style scoped lang="scss">
.ProblemEdit {
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