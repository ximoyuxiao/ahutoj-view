
<template>
  <div
    class="ChangePassword"
    data-type="form"
  >
    <div style="height: 30px; font-size: 22px;">修改密码</div>
    <el-icon
      class="close cursor_pointer"
      size="30px"
      @click="props.close(10)"
    >
      <CircleClose />
    </el-icon>
    <div>
      <span>旧密码:&nbsp;</span>
      <el-input
        v-model="changePassword.OldPwd"
        placeholder="输入旧密码"
        autocomplete="off"
      />
    </div>
    <div>
      <span>新密码:&nbsp;</span>
      <el-input
        v-model="changePassword.Pwd"
        placeholder="输入新密码"
        autocomplete="off"
        type="password"
        show-password
      />
    </div>
    <div>
      <span>新密码:&nbsp;</span>
      <el-input
        v-model="changePassword.PwdAgain"
        placeholder="重复一次新密码"
        autocomplete="off"
        type="password"
        show-password
      />
    </div>
    <div
      class="btn cursor_noFocus cursor_pointer"
      v-on:click="changePassword.sendForm()"
    >
      <el-icon>
        <EditPen />
      </el-icon>
      &nbsp;修改
    </div>
  </div>
</template>
<script lang="ts" setup>
import { getCurrentInstance, reactive } from "vue";
const { proxy } = getCurrentInstance() as any;

type propsType = {
  close: Function;
};
const props = withDefaults(defineProps<propsType>(), {
  close: () => { },
});

//修改密码
var changePassword = reactive({
  OldPwd: "",
  Pwd: "",
  PwdAgain: "",
  init() {
    this.OldPwd = "";
    this.Pwd = "";
    this.PwdAgain = "";
  },
  sendForm() {
    if (this.OldPwd == "") {
      proxy.elMessage({
        message: "旧密码不能为空",
        type: "warning",
      });
      return;
    }
    if (this.Pwd == "" || this.PwdAgain == "") {
      proxy.elMessage({
        message: "新密码不能为空",
        type: "warning",
      });
      return;
    }
    if (this.Pwd != this.PwdAgain) {
      proxy.elMessage({
        message: "两次输入的新密码不同",
        type: "warning",
      });
      return;
    }
    proxy
      .$post("api/user/edit/pass/", {
        OldPwd: changePassword.OldPwd,
        Pwd: changePassword.Pwd,
      })
      .then((res: any) => {
        proxy.$log(res);
        let data = res.data;
        if (data.code == 0) {
          proxy.elNotification({
            message: "修改成功",
            type: "success",
            duration: 1500,
          });
          props.close(10);
        }
        proxy.codeProcessor(
          data?.code ?? 100001,
          data?.msg ?? "服务器错误\\\\error"
        );
      });
  },
});
</script>

<style lang="scss" scoped>
.ChangePassword {
  position: relative;
  margin-bottom: $modelDistanceMini;
  width: 100%;
  padding: 12px 50px 12px 40px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  border-radius: 12px;
  @include box_shadow(0, 0, 8px, 1px, "fill14");
  @include fill_color("fill3");

  &:hover {
    @include box_shadow(0, 0, 8px, 1px, "fill12");
  }

  >div {
    @include font_color("font1");
    font-size: $fontSize6;
    letter-spacing: 1px;
    display: flex;
    min-width: 100%;
    margin: 5px 0;

    span {
      width: 100px;
    }
  }

  >.close {
    position: absolute;
    right: 10px;
    top: 10px;
    @include font_color("font3");

    &:hover {
      @include font_color("font1");
    }
  }

  >.btn {
    position: relative;
    overflow: hidden;
    margin: 8px 0;
    width: 220px;
    height: 40px;
    border-radius: 15px;
    font-size: $fontSize5;
    @include font_color("font1");
    letter-spacing: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    @include box_shadow(0, 0, 2px, 1px, "border2");
    transition-duration: 200ms;

    &:hover {
      @include box_shadow(0, 0, 2px, 1px, "fill12");
      @include fill_color("fill15");
    }
  }
}
</style>