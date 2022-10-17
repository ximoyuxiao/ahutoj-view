<template>
  <div
    class="BindingVJ"
    data-type="form"
  >
    <div class="title">绑定VJ账号</div>
    <el-icon
      class="close cursor_pointer"
      size="30px"
      @click="props.close(2)"
    >
      <CircleClose />
    </el-icon>
    <div
      v-if="props.Vjid"
      class="bindingNow"
    >
      当前已绑定：{{props.Vjid}}
    </div>
    <div>
      <span>VJ ID:&nbsp;</span>
      <el-input
        v-model="bindingVJ.Vjid"
        placeholder="输入VJudge账号"
      />
    </div>
    <div>
      <span>VJ 密码:&nbsp;</span>
      <el-input
        v-model="bindingVJ.Vjpwd"
        placeholder="输入VJudge密码"
        type="password"
        show-password
      />
    </div>
    <div
      class="btn cursor_noFocus cursor_pointer"
      v-on:click="bindingVJ.sendForm()"
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
  Vjid: string;
  close: Function;
};
const props = withDefaults(defineProps<propsType>(), {
  Vjid: "",
  close: () => {},
});

//绑定vj
var bindingVJ = reactive({
  Vjid: props.Vjid,
  Vjpwd: "",
  isInChangeMode: false,
  init() {
    this.Vjid = props.Vjid;
    this.Vjpwd = "";
    this.isInChangeMode = false;
  },
  sendForm() {
    if (this.Vjid == "") {
      proxy.elMessage({
        message: "ID不能为空",
        type: "warning",
      });
      return;
    }
    if (this.Vjpwd == "") {
      proxy.elMessage({
        message: "密码不能为空",
        type: "warning",
      });
      return;
    }
    proxy
      .$post("api/user/vjudgeBind", {
        Vjid: bindingVJ.Vjid,
        Vjpwd: bindingVJ.Vjpwd,
      })
      .then((res: any) => {
        // proxy.$log(res);
        let data = res.data;
        if (data.code == 0) {
          proxy.elNotification({
            message: "绑定成功",
            type: "success",
            duration: 1500,
          });
          props.close(2);
        }
        proxy.codeProcessor(data.code);
      });
  },
});
</script>

<style lang="scss" scoped>
.BindingVJ {
  position: relative;
  margin-bottom: $modelDistanceMini;
  width: 100%;
  padding: 10px 80px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  border-radius: 20px;
  @include box_shadow(0, 0, 8px, 1px, "fill14");
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

  > .close {
    position: absolute;
    right: 10px;
    top: 10px;
    @include font_color("font3");

    &:hover {
      @include font_color("font1");
    }
  }

  > .title {
    font-size: $fontSize8;
  }

  > .bindingNow {
    font-size: $fontSize5;
    margin: 10px 30px;
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