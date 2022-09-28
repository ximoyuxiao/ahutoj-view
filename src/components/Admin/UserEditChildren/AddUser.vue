<template>
  <div class="AddUser">
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
        v-model="userInfo.UID"
      />
    </div>
    <div class="nickname">
      <label
        class="loginLabel"
        for="nickname"
      >
        昵称
      </label>
      <input
        class="loginInput"
        name="nickname"
        type="text"
        autocomplete="off"
        maxlength="20"
        v-model="userInfo.UserName"
      />
    </div>
    <div class="password">
      <label
        class="loginLabel"
        for="password"
      >
        密码
      </label>
      <input
        class="loginInput"
        name="password"
        type="password"
        maxlength="30"
        v-model="userInfo.Pass"
      />
    </div>
    <div
      class="confirm cursor_pointer"
      @click="signin"
    >
      确 认
    </div>
  </div>
</template>

<script>
import { getCurrentInstance, reactive } from 'vue'
export default {
  name: 'AddUser',
  setup() {
    const { proxy } = getCurrentInstance()

    var userInfo = reactive({
      UID: '',
      UserName: '',
      Pass: '',
    })

    function signin() {
      if (userInfo.UID == '') {
        proxy.elMessage({
          message: '账号不能为空！',
          type: 'warning',
        })
        return
      }
      if (userInfo.UserName == '') {
        proxy.elMessage({
          message: '昵称不能为空！',
          type: 'warning',
        })
        return
      }
      if (userInfo.Pass == '') {
        proxy.elMessage({
          message: '密码不能为空！',
          type: 'warning',
        })
        return
      }
      proxy.$axios
        .post('api/auth/register/', {
          UID: userInfo.UID,
          UserName: userInfo.UserName,
          Pass: userInfo.Pass,
        })
        .then((res) => {
          let data = res.data
          if (data.code == 0) {
            // console.log(data);
            proxy.elMessage({
              message: '添加成功!',
              type: 'success',
            })
          } else {
            proxy.codeProcessor(data.code)
          }
        })
    }

    return {
      proxy,
      userInfo,
      signin,
    }
  },
}
</script>

<style scoped>
.AddUser {
  display: flex;
  flex-direction: column;
}

.AddUser > div {
  font-size: var(--FontSize8);
  box-sizing: border-box;
  margin: 5px 0;
}

.AddUser > div > input {
  font-size: var(--FontSize8);
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
 