<template>
  <div class="userCenter">
    <div class="infoBox">
      <!-- 头像背景效果 -->
      <img
        class="filter cursor_noFocus"
        :src="userInfo.HeadURL ? (baseURL + userInfo.HeadURL) : userInfo.defaultHeadImage.show()"
        alt=""
      />
      <div class="user">
        <div
          id="userImg"
          class="cursor_noFocus cursor_pointer"
          @click="functionConfig.show(11)"
        >
          <img :src="userInfo.HeadURL ? (baseURL + userInfo.HeadURL) : userInfo.defaultHeadImage.show()" />
          <div class="changImage">
            <el-icon size="42px">
              <Upload />
            </el-icon>
          </div>
        </div>
        <div class="username">{{ userDataStore.UserName }}</div>
        <div class="acStatus">
          <div class="acCount">
            AC&nbsp;&nbsp;&nbsp;<span>114514</span>
          </div>
          <div class="submittedCount">
            Sub&nbsp;&nbsp;&nbsp;<span>1919810</span>
          </div>
        </div>
      </div>
      <el-divider style="margin: 2px; background-color: var(--font_color4)" />
      <div class="userInfo">
        <div>学校:&nbsp;{{ userInfo.School }}</div>
        <div>班级:&nbsp;{{ userInfo.Classes }}</div>
        <div>专业:&nbsp;{{ userInfo.Major }}</div>
        <div>
          擅长:&nbsp;
          <el-tag
            v-for="Adept in userInfo.AdeptArray"
            :key="Adept"
            :effect="themeSwitch.theme == 1 ? 'light' : 'dark'"
          >
            {{ Adept }}
          </el-tag>
        </div>
        <div>邮箱:&nbsp;{{ userInfo.Email }}</div>
        <div
          class="set cursor_pointer"
          @click="functionConfig.show(0)"
        >
          <el-icon size="45px">
            <Setting />
          </el-icon>
        </div>
      </div>
    </div>
    <transition
      enter-active-class="animate__animated animate__zoomIn"
      leave-active-class="animate__animated animate__zoomOut"
    >
      <ChangeInfo
        v-if="functionConfig.showChangeInfo"
        :userInfo="userInfo"
        :close="functionConfig.close"
      >
      </ChangeInfo>
    </transition>
    <transition
      enter-active-class="animate__animated animate__zoomIn"
      leave-active-class="animate__animated animate__zoomOut"
    >
      <ChangeHeadImage
        v-if="functionConfig.showChangeHeadImage"
        :userInfo="userInfo"
        :close="functionConfig.close"
      >
      </ChangeHeadImage>
    </transition>
    <div class="contentBox">
      <div class="leftBox">
        <div
          class="functionBtn"
          @click="functionConfig.show(1)"
        >
          {{userInfo.CodeForceUser ?  "CodeForce:\n" + userInfo.CodeForceUser : "绑定CodeForce"}}
        </div>
        <div
          class="functionBtn"
          @click="functionConfig.show(2)"
        >
          {{userInfo.Vjid ?  "VJudge:\n" + userInfo.Vjid : "绑定VJudge"}}
        </div>
        <el-divider style="margin: 2px; background-color: var(--font_color4)" />
        <div
          class="functionBtn"
          @click="functionConfig.show(10)"
        >
          修改密码
        </div>
      </div>
      <div class="rightBox">
        <transition
          enter-active-class="animate__animated animate__zoomIn"
          leave-active-class="animate__animated animate__zoomOut"
        >
          <BindingCodeForce
            v-if="functionConfig.showBindingCodeForce"
            :CodeForceUser="userInfo.CodeForceUser"
            :close="functionConfig.close"
          ></BindingCodeForce>
        </transition>
        <transition
          enter-active-class="animate__animated animate__zoomIn"
          leave-active-class="animate__animated animate__zoomOut"
        >
          <BindingVJudge
            v-if="functionConfig.showBindingVJudge"
            :Vjid="userInfo.Vjid"
            :close="functionConfig.close"
          ></BindingVJudge>
        </transition>
        <transition
          enter-active-class="animate__animated animate__zoomIn"
          leave-active-class="animate__animated animate__zoomOut"
        >
          <ChangePassword
            v-if="functionConfig.showChangePassword"
            :close="functionConfig.close"
          ></ChangePassword>
        </transition>

        <div class="activityCalendarBox">
          <ActivityCalendar
            :data="activityCalendarConfig.data"
            backgroundColor="#ffffff00"
            :width="activityCalendarConfig.width"
            :height="activityCalendarConfig.height"
            :cellLength="activityCalendarConfig.cellLength"
            :cellInterval="activityCalendarConfig.cellInterval"
            :cellBorderRadius="activityCalendarConfig.cellBorderRadius"
            :fontSize="activityCalendarConfig.fontSize"
            :fontColor="activityCalendarConfig.fontColor"
            :showLevelFlag="activityCalendarConfig.showLevelFlag"
            :colors="activityCalendarConfig.colors"
            :showWeekDayFlag="true"
            :levelMapper="activityCalendarConfig.levelMapper"
            :levelFlagText="activityCalendarConfig.levelFlagText"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup >
import { onMounted, getCurrentInstance, reactive } from "vue";
import ActivityCalendar from "../components/MyComponents/ActivityCalendar.vue";
import { useThemeSwitchStore } from "../pinia/themeSwitch";
import { useUserDataStore } from "../pinia/userData";
import ChangeInfo from "../components/UserCenterChildren/ChangeInfo.vue";
import BindingCodeForce from "../components/UserCenterChildren/BindingCodeForce.vue";
import BindingVJudge from "../components/UserCenterChildren/BindingVJudge.vue";
import ChangePassword from "../components/UserCenterChildren/ChangePassword.vue";
import ChangeHeadImage from "../components/UserCenterChildren/ChangeHeadImage.vue";
import { baseURL } from "../utils/axios/axios";

const { proxy } = getCurrentInstance() as any;
const userDataStore = useUserDataStore();
const themeSwitch = useThemeSwitchStore();

//用户资料
type userInfoType = {
  UID: string;
  HeadURL: string;
  UserName: string;
  School: string;
  Classes: string;
  Major: string;
  Adept: string;
  Email: string;
  CodeForceUser: string;
  Vjid: string;
  AdeptArray: Array<string>;
  copy: Function;
  defaultHeadImage: any;
};
var userInfo = reactive<userInfoType>({
  UID: "",
  HeadURL: "",
  UserName: "",
  School: "",
  Classes: "",
  Major: "",
  Adept: "",
  Email: "",
  CodeForceUser: "",
  Vjid: "",
  AdeptArray: [],
  copy: (data: any) => {
    console.log(data);
    userInfo.UID = data.UID;
    userInfo.HeadURL = data.HeadURL;
    userInfo.UserName = data.UserName;
    userInfo.School = data.School;
    userInfo.Classes = data.Classes;
    userInfo.Major = data.Major;
    userInfo.Adept = data.Adept;
    userInfo.Email = data.Email;
    userInfo.CodeForceUser = data.CodeForceUser;
    userInfo.Vjid = data.Vjid;
    userInfo.AdeptArray = userInfo.Adept == "" ? [] : userInfo.Adept.split(";");
  },
  //获取默认头像
  defaultHeadImage: {
    images: [
      new URL("../assets/image/defaultHeadImage/0.svg", import.meta.url).href,
      new URL("../assets/image/defaultHeadImage/1.svg", import.meta.url).href,
      new URL("../assets/image/defaultHeadImage/2.svg", import.meta.url).href,
      new URL("../assets/image/defaultHeadImage/3.svg", import.meta.url).href,
      new URL("../assets/image/defaultHeadImage/4.svg", import.meta.url).href,
      new URL("../assets/image/defaultHeadImage/5.svg", import.meta.url).href,
      new URL("../assets/image/defaultHeadImage/6.svg", import.meta.url).href,
      new URL("../assets/image/defaultHeadImage/7.svg", import.meta.url).href,
      new URL("../assets/image/defaultHeadImage/8.svg", import.meta.url).href,
      new URL("../assets/image/defaultHeadImage/9.svg", import.meta.url).href,
      new URL("../assets/image/defaultHeadImage/10.svg", import.meta.url).href,
      new URL("../assets/image/defaultHeadImage/11.svg", import.meta.url).href,
    ],
    show() {
      let index = userInfo.UID.length % 12;
      return userInfo.defaultHeadImage.images[index];
    },
  },
});

//获取用户资料
function getUserInfo() {
  proxy.$get("api/user/info?uid=" + userDataStore.UID).then((res: any) => {
    // proxy.$log(res);
    let data = res.data;
    if (data.code == 0) {
      userInfo.copy(data);
      userDataStore.updateData(data);
    }
    proxy.codeProcessor(data.code, data.msg);
  });
}

//活跃度日历配置数据
type activityCalendarConfigType = {
  data: { date: string; count: number; index: number }[];
  [item: string]: any;
};
var activityCalendarConfig = reactive<activityCalendarConfigType>({
  data: [],
  endDate: "",
  width: 35,
  height: 7,
  cellLength: 20,
  cellInterval: 6,
  cellBorderRadius: 3,
  showHeader: true,
  colors: ["#f5f5f5", "#ebfaff", "#e5f9ff", "#c7f3ff", "#86e0fe", "#3ecefe"],
  levelMapper: (count: number): number => {
    if (count == 0) {
      return 0;
    } else if (count <= 1) {
      return 1;
    } else if (count <= 3) {
      return 2;
    } else if (count <= 6) {
      return 3;
    } else if (count <= 9) {
      return 4;
    } else {
      return 5;
    }
  },
  showLevelFlag: true,
  levelFlagText: ["少", "多"],
  fontSize: 12,
  fontColor: "#707070",
  clickEvent: function clickEvent(item: object) {},
  init(data: { date: string; count: number; SubmitTime: number }[]) {
    this.endDate = proxy.Utils.TimeTools.timestampToDate(Date.now(), 2);
    let tempMap = new Map();
    for (let item in data) {
      let t = proxy.Utils.TimeTools.timestampToDate(data[item].SubmitTime, 2);
      if (tempMap.has(t)) {
        tempMap.set(t, tempMap.get(t) + 1);
      } else {
        tempMap.set(t, 1);
      }
    }
    tempMap.forEach((count: number, date: string) => {
      let item = { date, count };
      this.data.push(item);
    });
  },
});

//获取用户提交记录
function getUserSubmit() {
  let storageData = sessionStorage.getItem("userSubmitData");
  if (storageData) {
    let data = JSON.parse(storageData);
    //10分钟内session周期内刷新直接取缓存
    if (data.UID == userDataStore.UID && Date.now() - data.saveTime < 600000) {
      activityCalendarConfig.init(data.data);
      return;
    }
  }
  proxy
    .$get("api/submit/status", { UID: userDataStore.UID })
    .then((res: any) => {
      // proxy.$log(res);
      let data = res.data;
      if (data.code == 0) {
        //缓存数据
        proxy.Buffer.UserCenter.submitData(data.Data, userDataStore.UID);
        activityCalendarConfig.init(data.Data);
      }
      proxy.codeProcessor(data.code, data.msg);
    });
}

//监控主题变化
themeSwitch.$subscribe(
  (args, state) => {
    if (state.theme == 1) {
      activityCalendarConfig.fontColor = "#707070";
      activityCalendarConfig.colors = [
        "#dde0e4",
        "#c5f6fa",
        "#99e9f2",
        "#66d9e8",
        "#3bc9db",
        "#22b8cf",
      ];
    } else {
      activityCalendarConfig.fontColor = "#cdcdcd";
      activityCalendarConfig.colors = [
        "#d6d6d6",
        "#e599f7",
        "#da77f2",
        "#be4bdb",
        "#ae3ec9",
        "#862e9c",
      ];
    }
  },
  {
    deep: true,
    immediate: true,
  }
);

var functionConfig = reactive({
  //修改资料窗口
  showChangeInfo: false,
  //绑定codeforce窗口
  showBindingCodeForce: false,
  //绑定vj窗口
  showBindingVJudge: false,
  //修改密码窗口
  showChangePassword: false,
  //修改头像
  showChangeHeadImage: false,
  init() {
    this.showChangeInfo = false;
    this.showBindingCodeForce = false;
    this.showBindingVJudge = false;
    this.showChangePassword = false;
    this.showChangeHeadImage = false;
  },
  show: (index: number): void => {
    switch (index) {
      case 0:
        functionConfig.showChangeInfo = true;
        break;
      case 1:
        functionConfig.showBindingCodeForce = true;
        break;
      case 2:
        functionConfig.showBindingVJudge = true;
        break;
      case 10:
        functionConfig.showChangePassword = true;
        break;
      case 11:
        functionConfig.showChangeHeadImage = true;
    }
  },
  close: (index: number): void => {
    switch (index) {
      case 0:
        functionConfig.showChangeInfo = false;
        break;
      case 1:
        functionConfig.showBindingCodeForce = false;
        break;
      case 2:
        functionConfig.showBindingVJudge = false;
        break;
      case 10:
        functionConfig.showChangePassword = false;
        break;
      case 11:
        functionConfig.showChangeHeadImage = false;
    }
  },
});

onMounted(() => {
  if (!userDataStore.isLogin) {
    proxy.$router.replace({ path: "/" });
    return;
  }
  getUserInfo();
  getUserSubmit();
});
</script>

<style  scoped lang="scss">
* {
  transition-duration: 150ms;
}

.userCenter {
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  padding: $userCenter_outerPaddingTop $userCenter_outerPaddingLeft;
  box-sizing: border-box;
  z-index: 1;

  .infoBox {
    position: relative;
    height: 280px;
    border-radius: 20px;
    overflow: hidden;
    @include box_shadow(0, 0, 8px, 1px, "fill52");

    &:hover {
      @include fill_color("fill2");
      @include box_shadow(0, 0, 8px, 1px, "fill51");
    }

    .filter {
      position: absolute;
      top: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      filter: blur(30px) opacity(0.25);
    }

    .user {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: flex-start;

      > #userImg {
        position: relative;
        margin: 15px;
        height: $userCenter_UserHeadImageSide;
        width: $userCenter_UserHeadImageSide;
        border-radius: 20px;
        @include box_shadow(0, 0, 2px, 1px, "font2");
        overflow: hidden;

        &:hover > .changImage {
          visibility: visible;
          opacity: 1;
        }

        &:hover > img {
          filter: blur(5px);
        }

        > .changImage {
          height: $userCenter_UserHeadImageSide;
          width: $userCenter_UserHeadImageSide;
          visibility: hidden;
          position: absolute;
          opacity: 0;
          background-color: #cdcdcd55;
          transition-duration: 260ms;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        > img {
          width: 100%;
          height: 100%;
        }
      }

      > div {
        font-weight: 600;
        height: 115px;
        display: flex;
        align-items: flex-end;
      }

      > .username {
        font-size: $fontSize12;
        @include font_color("font1");
      }

      .acStatus {
        height: 100%;
        position: absolute;
        right: 30px;
        font-size: $fontSize5;
        @include font_color("font2");
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        justify-content: flex-end;

        > div {
          font-weight: 500;
          margin-bottom: 5px;
        }
      }
    }

    .userInfo {
      width: 100%;
      height: 115px;
      padding: 0 20px;
      box-sizing: border-box;
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-around;

      > div {
        @include font_color("font1");
        font-size: $fontSize6;
        letter-spacing: 1px;
        display: flex;
        align-items: center;

        span {
          margin: 0 1px;
        }
      }

      .set {
        position: absolute;
        right: 20px;
        height: 115px;
        display: flex;
        align-items: center;
        transition-duration: 500ms;

        &:hover {
          transform: rotateZ(360deg);
        }
      }
    }
  }

  .contentBox {
    margin: $modelDistance 0;
    position: relative;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    transition-duration: 500ms;

    .leftBox {
      width: $userCenter_toolnavWidth;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 10px 15px;
      box-sizing: border-box;
      overflow: hidden;
      border-radius: 20px;
      @include box_shadow(0, 0, 8px, 1px, "fill34");

      &:hover {
        @include box_shadow(0, 0, 8px, 1px, "fill32");
      }

      .functionBtn {
        margin: 5px 0;
        width: 100%;
        border-radius: 8px;
        box-sizing: border-box;
        padding: 5px 0;
        @include font_color("font1");
        font-size: $fontSize7;
        line-height: $fontSize8;
        text-align: center;
        transition-duration: 260ms;
        white-space: pre;

        &:hover {
          @include fill_color("fill35");
          transform: scale(1.04);
        }
      }
    }

    .rightBox {
      width: calc(100% - $userCenter_toolnavWidth - $modelDistance);
      max-height: fit-content;
      display: flex;
      flex-direction: column;
      align-items: center;
      box-sizing: border-box;
      border-radius: 20px;
      transition-duration: 5000ms;

      .activityCalendarBox {
        width: 100%;
        box-sizing: border-box;
        padding: 10px;
        display: flex;
        flex-direction: column;
        align-items: center;
        @include box_shadow(0, 0, 8px, 1px, "fill14");
        @include fill_color("fill3");
        border-radius: 20px;
        overflow: hidden;

        &:hover {
          @include box_shadow(0, 0, 8px, 1px, "fill12");
        }
      }
    }
  }
}
</style>
