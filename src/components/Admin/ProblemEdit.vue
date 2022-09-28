<template>
  <div class="ProblemEdit">
    <div class="nav">
      <router-link
        active-class="selected"
        to="/Admin/ProblemEdit/AddProblem"
      >
        添加题目
      </router-link>
      <el-divider direction="vertical" />
      <router-link
        active-class="selected"
        to="/Admin/ProblemEdit/UpdateProblem"
      >
        修改题目
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

<script>
export default {
  name: 'ProblemEdit',
}
</script>

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
    @include fill_color('fill1');
    box-sizing: border-box;
    padding: $adminCenter_contentPadding;
    width: 100%;
    min-height: 400px;
  }
}
</style>