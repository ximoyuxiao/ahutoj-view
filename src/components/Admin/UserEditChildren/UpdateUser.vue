<template>
  <div class="UpdateUser">
    <div class="uid">
      <label
        class="loginLabel"
        for="uid"
      >
        账号
      </label>
      <input
        class="loginInput"
        name="uid"
        type="text"
        autocomplete="off"
        maxlength="20"
        v-model="userInfo.UID"
      />
    </div>
    <div class="password">
      <label
        class="loginLabel"
        for="username"
      >
        账号
      </label>
      <input
        class="loginInput"
        name="username"
        type="text"
        autocomplete="off"
        maxlength="20"
        v-model="userInfo.Pass"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { getCurrentInstance, reactive } from "vue";
const { proxy } = getCurrentInstance() as any;

var userInfo = reactive({
  UID: "",
  Pass: "",
  init() {
    this.UID = "";
    this.Pass = "";
  },
});

function changeUserPass() {
  // proxy.$post("api/user/edit/pass/", { userInfo.UID}).then((res: any) => {
  //   let data = res.data;
  //   if (data.code == 0) {
  //     userInfo.hasSearched = true;
  //     userInfo.copy(data);
  //     proxy.elMessage({
  //       message: "查询成功!",
  //       type: "success",
  //     });
  //   }
  //   proxy.codeProcessor(data.code);
  // });
}

function sendForm() {}
</script>

<style scoped lang="scss">
.UpdateUser {
  display: flex;
  flex-direction: column;

  > div {
    font-size: $fontSize8;
    box-sizing: border-box;
    margin: 5px 0;

    > input {
      font-size: $fontSize8;
    }
  }

  .changeInfo {
    margin-top: $modelDistance;
    padding: 10px 80px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;
    border-radius: 20px;
    @include box_shadow(0, 0, 8px, 1px, "fill53");

    > div {
      color: #565656;
      font-size: $fontSize6;
      letter-spacing: 1px;
      display: flex;
      min-width: 100%;
      margin: 5px 0;

      > span {
        width: 60px;
      }
    }

    > .btn {
      position: relative;
      overflow: hidden;
      margin: 8px 0;
      width: 220px;
      height: 40px;
      border-radius: 15px;
      font-size: $fontSize8;
      @include font_color("font1");
      letter-spacing: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      @include box_shadow(0, 0, 2px, 1px, "fill52");
      transition-duration: 200ms;

      &:hover {
        @include box_shadow(0, 0, 2px, 1px, "fill11");
        @include fill_color("fill16");
      }
    }
  }
}

.confirm {
  width: 150px;
  text-align: center;
  box-sizing: border-box;
  padding: 5px 10px;
  background-color: #ededed;
  border-radius: 10px;
}
</style>