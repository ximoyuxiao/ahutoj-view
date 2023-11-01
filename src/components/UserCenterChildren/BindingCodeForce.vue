
<template>
  <div class="BindingCodeForce">
    <div class="title">绑定 Codeforces</div>
    <el-icon
      class="close cursor_pointer"
      size="30px"
      @click="props.close(1)"
    >
      <CircleClose />
    </el-icon>
    <div
      v-if="props.CodeForceUser"
      class="bindingNow"
    >
      当前已绑定：{{props.CodeForceUser}}
    </div>
    <div>
      <span>ID:&nbsp;</span>
      <el-input
        v-model="codeForce.CodeForceUser"
        placeholder="输入CodeForce账号"
        autocomplete="off"
      />
    </div>
    <div>
      <span>密码:&nbsp;</span>
      <el-input
        v-model="codeForce.CodeForcePass"
        placeholder="输入CodeForce密码"
        autocomplete="off"
        type="password"
        show-password
      />
    </div>
    <div
      class="btn cursor_noFocus cursor_pointer"
      v-on:click="codeForce.send"
    >
      <el-icon>
        <Link />
      </el-icon>
      &nbsp;绑定
    </div>
  </div>
</template>
<script lang="ts" setup>
import { getCurrentInstance, reactive } from "vue";
const { proxy } = getCurrentInstance() as any;

type propsType = {
  CodeForceUser: string;
  close: Function;
};
const props = withDefaults(defineProps<propsType>(), {
  CodeForceUser: "",
  close: () => {},
});

var codeForce = reactive({
  CodeForceUser: props.CodeForceUser,
  CodeForcePass: "",
  send: () => {
    if (codeForce.CodeForceUser == "") {
      proxy.elMessage({
        message: "ID不能为空",
        type: "warning",
      });
      return;
    }
    if (codeForce.CodeForcePass == "") {
      proxy.elMessage({
        message: "密码不能为空",
        type: "warning",
      });
      return;
    }
    proxy
      .$post("api/user/CodeForceBind/", {
        CodeForceUser: codeForce.CodeForceUser,
        CodeForcePass: codeForce.CodeForcePass,
      })
      .then((res: any) => {
        proxy.$log(res);
        let data = res.data;
        if (data.code == 0) {
          proxy.elNotification({
            message: "绑定成功",
            type: "success",
            duration: 1500,
          });
          props.close(1);
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
.BindingCodeForce {
  position: relative;
  margin-bottom: $modelDistanceMini;
  width: 100%;
  padding: 12px 50px 12px 40px;
  box-sizing: border-box;
  display: flex;
  border-radius: 12px;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  // border-radius: 20px;
  // @include box_shadow(0, 0, 8px, 1px, "fill14");
  @include fill_color("fill3");

  &:hover {
    @include box_shadow(0, 0, 8px, 1px, "fill12");
  }

  > div {
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

  > .title {
    font-size: $fontSize8;
  }

  > .bindingNow {
    font-size: $fontSize5;
    margin: 10px 30px;
  }
  > .close {
    position: absolute;
    right: 10px;
    top: 10px;
    @include font_color("font3");

    &:hover {
      @include font_color("font1");
    }
  }

  > .btn {
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