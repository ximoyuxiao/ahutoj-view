<template>
  <div class="addUser">
    <el-row>
      <label class="loginLabel" for="username">
        账号
      </label>
      <el-input class="loginInput" name="username" type="text" autocomplete="off" maxlength="20" v-model="userInfo.UID" />
    </el-row>
    <el-row>
      <label class="loginLabel" for="nickname">
        昵称
      </label>
      <el-input class="loginInput" name="nickname" type="text" autocomplete="off" maxlength="20"
        v-model="userInfo.UserName" />
    </el-row>
    <el-row>
      <label class="loginLabel" for="password">
        密码
      </label>
      <el-input class="loginInput" name="password" type="password" v-model="userInfo.Pass" maxlength="30" show-password />
    </el-row>
    <el-row>
      <el-button class="confirm" type="primary" round shoudAddSpace @click="signin">注 册</el-button>
    </el-row>
  </div>
</template>

<script lang="ts">
import { getCurrentInstance, reactive } from "vue";
export default {
  name: "AddUser",
  setup() {
    const { proxy } = getCurrentInstance() as any;

    var userInfo = reactive({
      UID: "",
      UserName: "",
      Pass: "",
    });

    function signin() {
      if (userInfo.UID == "") {
        proxy.elMessage({
          message: "账号不能为空！",
          type: "warning",
        });
        return;
      }
      if (userInfo.UserName == "") {
        proxy.elMessage({
          message: "昵称不能为空！",
          type: "warning",
        });
        return;
      }
      if (userInfo.Pass == "") {
        proxy.elMessage({
          message: "密码不能为空！",
          type: "warning",
        });
        return;
      }
      proxy.$axios
        .post("api/auth/register/", {
          UID: userInfo.UID,
          UserName: userInfo.UserName,
          Pass: userInfo.Pass,
        })
        .then((res) => {
          let data = res.data;
          if (data.code == 0) {
            // proxy.$log(data);
            proxy.elMessage({
              message: "添加成功!",
              type: "success",
            });
          } else {
            proxy.codeProcessor(
              data?.code ?? 100001,
              data?.msg ?? "服务器错误\\\\error"
            );
          }
        });
    }

    return {
      proxy,
      userInfo,
      signin,
    };
  },
};
</script>

<style scoped lang="scss">
.addUser {
  width: 250px;
  font-size: $fontSize6;
}

.confirm {
    width: 330px;
    height: 40px;
    font-size: $fontSize7;
    box-sizing: border-box;
    padding: 5px 0;
    margin: 20px 0px 16px 0px;
  }

</style>