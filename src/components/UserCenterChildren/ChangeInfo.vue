
<template>
  <div class="ChangeInfo">
    <div style="height: 30px; font-size: 22px;">修改资料</div>
    <el-icon
      class="close cursor_pointer"
      size="30px"
      @click="props.close(0)"
    >
      <CircleClose />
    </el-icon>
    <div>
      <span>昵称:&nbsp;</span>
      <el-input v-model="changeInfo.UserName" />
    </div>
    <div>
      <span>学校:&nbsp;</span>
      <el-input v-model="changeInfo.School" />
    </div>
    <div>
      <span>班级:&nbsp;</span>
      <el-input v-model="changeInfo.Classes" />
    </div>
    <div>
      <span>专业:&nbsp;</span>
      <el-input v-model="changeInfo.Major" />
    </div>
    <div>
      <span>擅长:&nbsp;</span>
      <el-tag
        v-for="Adept in setAdept.AdeptArray"
        :key="Adept"
        style="min-width: fit-content; margin: 0 1px"
        closable
        :disable-transitions="false"
        @close="setAdept.handleClose(Adept)"
      >
        {{ Adept }}
      </el-tag>
      <el-input
        v-if="setAdept.inputVisible"
        ref="InputRef"
        v-model="setAdept.inputValue"
        size="small"
        class="ml-1 w-20"
        style="width: 100px"
        @keyup.enter="setAdept.handleInputConfirm()"
        @blur="setAdept.handleInputCancel()"
      />
      <el-button
        v-else
        class="button-new-tag ml-1"
        size="small"
        @click="setAdept.showInput()"
      >
        + 添加
      </el-button>
    </div>
    <div>
      <span>邮箱:&nbsp;</span>
      <el-input v-model="changeInfo.Email" />
    </div>
    <div
      class="btn cursor_noFocus cursor_pointer"
      v-on:click="changeInfo.sendForm()"
    >
      <el-icon>
        <EditPen />
      </el-icon>
      &nbsp;提交修改
    </div>
  </div>
</template>
<script lang="ts" setup>
import { getCurrentInstance, nextTick, onMounted, reactive } from "vue";
import { useThemeSwitchStore } from "../../pinia/themeSwitch";
import { useUserDataStore } from "../../pinia/userData";
const { proxy } = getCurrentInstance() as any;
const themeSwitchStore = useThemeSwitchStore();
const userDataStore = useUserDataStore();

type propsType = {
  userInfo: any;
  close: Function;
};
const props = withDefaults(defineProps<propsType>(), {
  userInfo: {},
  close: () => { },
});

//进入修改资料模式
type changeInfoType = {
  UID: string;
  UserName: string;
  School: string;
  Classes: string;
  Major: string;
  Adept: string;
  Email: string;
  [item: string]: any;
};
var changeInfo = reactive<changeInfoType>({
  UID: "",
  UserName: "",
  School: "",
  Classes: "",
  Major: "",
  Adept: "",
  Email: "",
  init() {
    this.UserName = userDataStore.UserName;
    this.School = props.userInfo.School;
    this.Classes = props.userInfo.Classes;
    this.Major = props.userInfo.Major;
    this.Adept = props.userInfo.Adept;
    this.Email = props.userInfo.Email;
    setAdept.AdeptArray = this.Adept == "" ? [] : this.Adept.split(";");
  },
  sendForm() {
    this.Adept =
      setAdept.AdeptArray.length == 0 ? "" : setAdept.AdeptArray.join(";");
    // proxy.$log(this);
    if (this.UserName == "") {
      proxy.elMessage({
        message: "昵称不可为空",
        type: "warning",
      });
      return;
    }
    if (
      !this.Email.match("^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(.[a-zA-Z0-9_-]+)+$")
    ) {
      proxy.elMessage({
        message: "请输入正确的邮箱",
        type: "warning",
      });
      return;
    }
    proxy.$axios
      .post("api/user/edit/", {
        UserName: this.UserName,
        School: this.School,
        Classes: this.Classes,
        Major: this.Major,
        Adept: this.Adept,
        Email: this.Email,
      })
      .then((res: any) => {
        let data = res.data;
        if (data.code == 0) {
          //更新数据成功
          userDataStore.UserName = this.UserName;
          props.userInfo.UserName = this.UserName;
          props.userInfo.School = this.School;
          props.userInfo.Classes = this.Classes;
          props.userInfo.Major = this.Major;
          props.userInfo.Adept = this.Adept;
          props.userInfo.Email = this.Email;
          props.userInfo.Vjid = this.Vjid;
          props.userInfo.AdeptArray =
            props.userInfo.Adept == "" ? [] : props.userInfo.Adept.split(";");
          proxy.elNotification({
            message: "修改成功",
            type: "success",
            duration: 1500,
          });
          props.close(0);
        } else {
          proxy.codeProcessor(
            data?.code ?? 100001,
            data?.msg ?? "服务器错误\\\\error"
          );
        }
      });
  },
});

//添加Adept标签
type setAdapt = {
  inputValue: string;
  AdeptArray: string[];
  inputVisible: boolean;
  [item: string]: any;
};
var setAdept = reactive<setAdapt>({
  inputValue: "",
  AdeptArray: [],
  inputVisible: false,
  handleClose(tag: string): void {
    this.AdeptArray.splice(this.AdeptArray.indexOf(tag), 1);
  },
  showInput(): void {
    this.inputVisible = true;
    nextTick(() => {
      proxy.$refs.InputRef.focus();
    });
  },
  //输入确认
  handleInputConfirm(): void {
    if (!this.inputVisible) return;
    if (
      this.inputValue == "" ||
      this.AdeptArray.indexOf(this.inputValue) != -1
    ) {
      this.inputVisible = false;
      this.inputValue = "";
      proxy.elMessage({ message: "请输入正确的名称并且不得重复" });
      return;
    }
    this.AdeptArray.push(this.inputValue);
    this.inputVisible = false;
    this.inputValue = "";
  },
  //输入关闭
  handleInputCancel(): void {
    this.inputVisible = false;
    this.inputValue = "";
  },
});

onMounted(() => {
  changeInfo.init();
});
</script>

<style lang="scss" scoped>
.ChangeInfo {
  position: relative;
  margin-top: $modelDistance;
  padding: 12px 50px 12px 40px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  border-radius: 12px;
  @include box_shadow(0, 0, 8px, 1px, "fill52");

  &:hover {
    @include fill_color("fill2");
    @include box_shadow(0, 0, 8px, 1px, "fill51");
  }

  >div {
    @include font_color("font1");
    font-size: $fontSize6;
    letter-spacing: 1px;
    display: flex;
    min-width: 100%;
    margin: 5px 0;

    span {
      width: 60px;
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