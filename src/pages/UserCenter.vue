<template>
  <div class="userCenter">
    <div class="infoBox">
      <img
        class="filter cursor_noFocus"
        src="../assets/image/temporary/user.jpg"
        alt=""
      />
      <div class="user">
        <img
          id="userImg"
          class="cursor_noFocus"
          src="../assets/image/temporary/user.jpg"
          alt=""
        />
        <div>{{ store.state.userData.UserName }}</div>
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
          >
            {{ Adept }}
          </el-tag>
        </div>
        <div>邮箱:&nbsp;{{ userInfo.Email }}</div>
        <div
          class="set cursor_pointer"
          @click="changeInfo.change"
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
      <div
        v-if="changeInfo.isInChangeMode"
        class="changeInfo"
      >
        <div style="height: 30px">修改资料</div>
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
            <Check />
          </el-icon>&nbsp;提交修改
        </div>
      </div>
    </transition>

    <div class="contentBox">
      <div class="leftBox">
        <div>绑定VJudge</div>
        <el-divider style="margin: 2px; background-color: var(--font_color4)" />
        <div>修改邮箱</div>
        <el-divider style="margin: 2px; background-color: var(--font_color4)" />
        <div>修改密码</div>
      </div>
      <div class="rightBox">
        <div class="activityCalendar">
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
            :levelMapper="activityCalendarConfig.levelMapper"
            :levelFlagText="activityCalendarConfig.levelFlagText"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup >
import {
  onMounted,
  getCurrentInstance,
  reactive,
  nextTick,
  watch,
  computed,
} from 'vue'
import { useStore } from 'vuex'
import ActivityCalendar from '../components/MyComponents/ActivityCalendar.vue'
const { proxy } = getCurrentInstance() as any
const store = useStore()

//用户资料
type userInfoType = {
  UID: string
  School: string
  Classes: string
  Major: string
  Adept: string
  Email: string
  Vjid: string
  AdeptArray: Array<string>
}
var userInfo = reactive<userInfoType>({
  UID: '',
  School: '',
  Classes: '',
  Major: '',
  Adept: '',
  Email: '',
  Vjid: '',
  AdeptArray: [],
})

//获取用户资料
function getUserInfo() {
  proxy
    .$get('api/user/info?uid=' + store.state.userData.UID)
    .then((res: any) => {
      // console.log(res)
      let data = res.data
      if (data.code == 0) {
        userInfo.UID = data.UID
        userInfo.School = data.School
        userInfo.Classes = data.Classes
        userInfo.Major = data.Major
        userInfo.Adept = data.Adept
        userInfo.Email = data.Email
        userInfo.Vjid = data.Vjid
        userInfo.AdeptArray =
          userInfo.Adept == '' ? [] : userInfo.Adept.split(';')
      }
      proxy.codeProcessor(data.code)
    })
}

//活跃度日历配置数据
type activityCalendarConfigType = {
  data: { date: string; count: number }[]
  [item: string]: any
}
var activityCalendarConfig = reactive<activityCalendarConfigType>({
  data: [],
  endDate: '',
  width: 35,
  height: 7,
  cellLength: 16,
  cellInterval: 6,
  cellBorderRadius: 3,
  showHeader: true,
  colors: ['#f5f5f5', '#ebfaff', '#e5f9ff', '#c7f3ff', '#86e0fe', '#3ecefe'],
  levelMapper: (count: number): number => {
    if (count == 0) {
      return 0
    } else if (count <= 1) {
      return 1
    } else if (count <= 3) {
      return 2
    } else if (count <= 6) {
      return 3
    } else if (count <= 9) {
      return 4
    } else {
      return 5
    }
  },
  showLevelFlag: true,
  levelFlagText: ['少', '多'],
  fontSize: 14,
  fontColor: '#707070',
  clickEvent: function clickEvent(item: object) {},
  //初始化数据
  init(data: { date: string; count: number; SubmitTime: number }[]) {
    this.endDate = proxy.Utils.timestampToDate(Date.now(), 2)
    let tempMap = new Map()
    for (let item in data) {
      let t = proxy.Utils.timestampToDate(data[item].SubmitTime, 2)
      if (tempMap.has(t)) {
        tempMap.set(t, tempMap.get(t) + 1)
      } else {
        tempMap.set(t, 1)
      }
    }
    tempMap.forEach((count: number, date: string) => {
      let item = { date, count }
      this.data.push(item)
    })
  },
})

//观察theme改变
var theme = computed(() => {
  return store.state.themeSwitch.theme
})

watch(
  theme,
  (newVal, oldVal) => {
    if (newVal == 1) {
      activityCalendarConfig.fontColor = '#707070'
      activityCalendarConfig.colors = [
        '#f5f5f5',
        '#ebfaff',
        '#e5f9ff',
        '#c7f3ff',
        '#86e0fe',
        '#3ecefe',
      ]
    } else {
      activityCalendarConfig.fontColor = '#cdcdcd'
      activityCalendarConfig.colors = [
        '#d6d6d6',
        '#e599f7',
        '#da77f2',
        '#be4bdb',
        '#ae3ec9',
        '#862e9c',
      ]
    }
  },
  { deep: true, immediate: true }
)

//获取用户提交记录
function getUserSubmit() {
  proxy
    .$get('api/submit/status', { UID: store.state.userData.UID })
    .then((res: any) => {
      // console.log(res)
      let data = res.data
      if (data.code == 0) {
        activityCalendarConfig.init(data.Data)
      } else {
        proxy.codeProcessor(data.code)
      }
    })
}

//进入修改资料模式
type changeInfoType = {
  UID: string
  UserName: string
  School: string
  Classes: string
  Major: string
  Adept: string
  Email: string
  isInChangeMode: boolean
  [item: string]: any
}
var changeInfo = reactive<changeInfoType>({
  UID: '',
  UserName: '',
  School: '',
  Classes: '',
  Major: '',
  Adept: '',
  Email: '',
  isInChangeMode: false,
  init() {
    this.UserName = store.state.userData.UserName
    this.School = userInfo.School
    this.Classes = userInfo.Classes
    this.Major = userInfo.Major
    this.Adept = userInfo.Adept
    this.Email = userInfo.Email
  },
  change() {
    if (this.isInChangeMode) {
      this.isInChangeMode = false
      setAdept.AdeptArray = []
    } else {
      this.init()
      setAdept.AdeptArray =
        userInfo.Adept == '' ? [] : userInfo.Adept.split(';')
      this.isInChangeMode = true
    }
  },
  sendForm() {
    this.Adept =
      setAdept.AdeptArray.length == 0 ? '' : setAdept.AdeptArray.join(';')
    // console.log(this);
    if (this.UserName == '') {
      proxy.elMessage({
        message: '昵称不可为空',
        type: 'warning',
      })
      return
    }
    if (
      !this.Email.match('^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(.[a-zA-Z0-9_-]+)+$')
    ) {
      proxy.elMessage({
        message: '请输入正确的邮箱',
        type: 'warning',
      })
      return
    }
    proxy.$axios
      .post('api/user/edit/', {
        UserName: this.UserName,
        School: this.School,
        Classes: this.Classes,
        Major: this.Major,
        Adept: this.Adept,
        Email: this.Email,
      })
      .then((res: any) => {
        let data = res.data
        if (data.code == 0) {
          //更新数据成功
          userInfo.School = this.School
          userInfo.Classes = this.Classes
          userInfo.Major = this.Major
          userInfo.Adept = this.Adept
          userInfo.Email = this.Email
          userInfo.Vjid = this.Vjid
          userInfo.AdeptArray =
            userInfo.Adept == '' ? [] : userInfo.Adept.split(';')
          changeInfo.isInChangeMode = false
          proxy.elMessage({ message: '修改成功', type: 'success' })
        } else {
          proxy.codeProcessor(data.code)
        }
      })
  },
})

//添加Adept标签
type setAdapt = {
  inputValue: string
  AdeptArray: string[]
  inputVisible: boolean
  [item: string]: any
}
var setAdept = reactive<setAdapt>({
  inputValue: '',
  AdeptArray: [],
  inputVisible: false,
  handleClose(tag: string): void {
    this.AdeptArray.splice(this.AdeptArray.indexOf(tag), 1)
  },
  showInput(): void {
    this.inputVisible = true
    nextTick(() => {
      proxy.$refs.InputRef.focus()
    })
  },
  //输入确认
  handleInputConfirm(): void {
    if (!this.inputVisible) return
    if (
      this.inputValue == '' ||
      this.AdeptArray.indexOf(this.inputValue) != -1
    ) {
      this.inputVisible = false
      this.inputValue = ''
      proxy.elMessage({ message: '请输入正确的名称并且不得重复' })
      return
    }
    this.AdeptArray.push(this.inputValue)
    this.inputVisible = false
    this.inputValue = ''
  },
  //输入关闭
  handleInputCancel(): void {
    this.inputVisible = false
    this.inputValue = ''
  },
})

onMounted(() => {
  if (!store.state.userData.isLogin) {
    proxy.$router.replace({ path: '/' })
    return
  }
  getUserInfo()
  getUserSubmit()
})
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
    @include box_shadow(0, 0, 8px, 1px, 'fill52');

    &:hover {
      @include fill_color('fill2');
      @include box_shadow(0, 0, 8px, 1px, 'fill51');
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

      > img {
        margin: 15px;
        height: 120px;
        width: 120px;
        border-radius: 20px;
      }

      > div {
        font-size: $fontSize12;
        font-weight: 600;
        height: 115px;
        display: flex;
        align-items: flex-end;
      }

      .acStatus {
        height: 100%;
        position: absolute;
        right: 30px;
        font-size: $fontSize5;
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
        @include font_color('font1');
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

  .changeInfo {
    margin-top: $modelDistance;
    padding: 10px 80px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;
    border-radius: 20px;
    @include box_shadow(0, 0, 8px, 1px, 'fill52');

    > div {
      @include font_color('font1');
      font-size: $fontSize6;
      letter-spacing: 1px;
      display: flex;
      min-width: 100%;
      margin: 5px 0;

      span {
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
      font-size: $fontSize5;
      @include font_color('font1');
      letter-spacing: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      @include box_shadow(0, 0, 2px, 1px, 'border2');
      transition-duration: 200ms;

      &:hover {
        @include box_shadow(0, 0, 2px, 1px, 'fill12');
        @include fill_color('fill15');
      }
    }
  }

  .contentBox {
    margin: $modelDistance 0;
    position: relative;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;

    .leftBox {
      width: $userCenter_toolnavWidth;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 10px;
      box-sizing: border-box;
      overflow: hidden;
      border-radius: 20px;
      @include box_shadow(0, 0, 8px, 1px, 'fill52');

      > div {
        margin: 5px 0;
        font-size: $fontSize7;
      }
    }

    .rightBox {
      width: calc(100% - $userCenter_toolnavWidth - $modelDistance);
      min-height: 300px;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 10px;
      box-sizing: border-box;
      overflow: hidden;
      border-radius: 20px;
      @include box_shadow(0, 0, 8px, 1px, 'fill52');
      @include fill_color('fill3');

      .activityCalendar {
        width: fit-content;
      }
    }
  }
}
</style>
