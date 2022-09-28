<template>
  <div class="contestEdit">
    <div class="nav">
      <router-link active-class="selected" to="/Admin/ContestEdit/AddContest">
        添加比赛
      </router-link>
      <el-divider direction="vertical" />
      <router-link
        active-class="selected"
        to="/Admin/ContestEdit/UpdateContest"
      >
        修改比赛
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
  name: "ContestEdit",
};
</script>

<style scoped>
.contestEdit {
  width: 100%;
  overflow: hidden;
}

.nav {
  display: flex;
  box-sizing: border-box;
  padding: 10px 10px;
  align-items: center;
  justify-content: centers;
  background-color: #e9ecef;
}

.nav > a {
  box-sizing: border-box;
  padding: 5px 15px;
  font-size: 18px;
  border-bottom: 2px solid rgba(0, 0, 0, 0);
  color: #333333;
}

.nav > a:hover {
  background-color: #e0e0e0;
}

.nav > .selected {
  border-bottom: 2px solid #5ebd00;
}

.content {
  background-color: var(--admin_bcg3);
  box-sizing: border-box;
  padding: var(--adminCenter_contentPadding);
  width: 100%;
  min-height: 400px;
}
</style>