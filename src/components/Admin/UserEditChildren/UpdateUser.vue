<template>
  <div class="UpdateUser">
    <div class="username">
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
        v-on:focus="userInfo.init"
        v-model="userInfo.UID"
      />
    </div>
    <div
      class="confirm cursor_pointer"
      @click="getUserInfo"
    >
      查 找
    </div>
    <div
      v-if="userInfo.hasSearched"
      class="changeInfo"
    >
      <div>
        <span>昵称:&nbsp;</span>
        <el-input v-model="userInfo.UserName" />
      </div>
      <div>
        <span>学校:&nbsp;</span>
        <el-input v-model="userInfo.School" />
      </div>
      <div>
        <span>班级:&nbsp;</span>
        <el-input v-model="userInfo.Classes" />
      </div>
      <div>
        <span>专业:&nbsp;</span>
        <el-input v-model="userInfo.Major" />
      </div>
      <div>
        <span>擅长:&nbsp;</span>
        <el-input v-model="userInfo.Adept" />
      </div>
      <div>
        <span>邮箱:&nbsp;</span>
        <el-input v-model="userInfo.Email" />
      </div>
      <div
        class="btn cursor_noFocus cursor_pointer"
        v-on:click="sendForm"
      >
        <el-icon>
          <Check />
        </el-icon>&nbsp;提交修改
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { getCurrentInstance, reactive } from 'vue'
export default {
  name: 'UpdateUser',
  setup() {
    const { proxy } = getCurrentInstance() as any

    var userInfo = reactive({
      UID: '',
      UserName: '',
      Adept: '',
      Classes: '',
      Email: '',
      Major: '',
      School: '',
      Vjid: '',
      hasSearched: false,
      init() {
        this.UID = ''
        this.UserName = ''
        this.Adept = ''
        this.Classes = ''
        this.Email = ''
        this.Major = ''
        this.School = ''
        this.Vjid = ''
        this.hasSearched = false
      },
      copy(data) {
        this.UID = data.UID
        this.UserName = data.UserName
        this.Adept = data.Adept
        this.Classes = data.Classes
        this.Email = data.Email
        this.Major = data.Major
        this.School = data.School
        this.Vjid = data.Vjid
      },
    })

    function getUserInfo() {
      proxy.$axios.get('api/user/info?uid=' + userInfo.UID).then((res) => {
        let data = res.data
        if (data.code == 0) {
          userInfo.hasSearched = true
          userInfo.copy(data)
          proxy.elMessage({
            message: '查询成功!',
            type: 'success',
          })
        } else {
          proxy.codeProcessor(data.code)
        }
      })
    }

    function sendForm() {}

    return { proxy, userInfo, getUserInfo, sendForm }
  },
}
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
    @include box_shadow(0, 0, 8px, 1px, 'fill53');

    > div {
      @include font_color('font1');
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
      @include font_color('font1');
      letter-spacing: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      @include box_shadow(0, 0, 2px, 1px, 'fill52');
      transition-duration: 200ms;

      &:hover {
        @include box_shadow(0, 0, 2px, 1px, 'fill11');
        @include fill_color('fill16');
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