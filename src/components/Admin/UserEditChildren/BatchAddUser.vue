<template>
  <div class="BatchAddUser">
    <el-upload
      ref="upload"
      class="uploadJson"
      drag
      accept=".json,.xlsx"
      :auto-upload="false"
      :on-change="uploadParser"
      :show-file-list="true"
    >
      <el-icon class="el-icon--upload">
        <upload-filled />
      </el-icon>
      <div class="el-upload__text">
        以Json、Excel（xlsx）格式文件上传用户数据 <em>点击</em>或者<em>拖拽</em>
      </div>
    </el-upload>
    <div class="example">
      <div class="title">
        查看Json示例数据
      </div>
      <pre class="exampleText">
    [
      {
        "UID": "12345",
        "UserName": "13东月关",
        "Pass": "123"
      },
      {
        "UID": "45678",
        "UserName": "13东月关",
        "Pass": "123"
      },
      {
        "UID": "78912",
        "UserName": "13东月关",
        "Pass": "123"
      }
    ]</pre>
    </div>
    <div class="setColumnName">
      <div class="title">
        自定义列名
      </div>
      <div>UID列名</div>
      <Input v-model="userList.columnName.UID" />
      <div>UserName列名</div>
      <Input v-model="userList.columnName.UserName" />
      <div>Pass列名</div>
      <Input v-model="userList.columnName.Pass" />
    </div>
    <div
      class="userList"
      v-show="userList.showList"
    >
      <div class="header">
        <div style="width:240px">用户名</div>
        <div style="width:240px">昵称</div>
        <div style="width:240px">密码</div>
        <div style="width:60px">操作</div>
      </div>
      <div
        class="item"
        v-for="(item, index) in userList.list"
        :key="index"
      >
        <div style="width:240px">{{ item.UID }}</div>
        <div style="width:240px">{{ item.UserName }}</div>
        <div style="width:240px">{{ item.Pass }}</div>
        <el-button
          style="width:60px"
          type="danger"
          @click="userList.remove(index)"
        >
          删除
        </el-button>
      </div>
      <el-button
        class="btn"
        type="primary"
        @click="complete()"
      >
        提交列表
      </el-button>
    </div>
  </div>
</template>  

<script lang="ts" setup>
import { getCurrentInstance, reactive } from "vue";
import codeProcessor from "../../../utils/codeProcessor";
import { ExcelFileUtils, JsonFileUtils } from "../../../utils/fileUtils";
import Input from "../../MyComponents/Input.vue";
const { proxy } = getCurrentInstance() as any;

const userList = reactive({
  list: [],
  columnName: {
    UID: "UID",
    UserName: "UserName",
    Pass: "Pass",
  },
  showList: false,
  remove(index) {
    for (let i in this.list) {
      if (index == i) this.list.splice(i, 1);
    }
  },
  init: () => {
    userList.list = [];
    userList.showList = false;
  },
});

//文件解析器
function uploadParser(event, fileList) {
  //单文件解析
  let file = fileList[0].raw;
  switch (file.type) {
    case "application/json":
      JsonFileUtils.getContentFromJson(file).then((res) => {
        handleJSONContent(res);
      });
      break;
    case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
      ExcelFileUtils.getContentFromExcel(file).then((res) => {
        handleExcelContent(res);
      });
      break;
  }
  return;
}

//解析json格式文件内容
function handleJSONContent(content: any) {
  userList.init();
  proxy.$refs.upload.clearFiles();
  for (let user of content.data) {
    if (
      !user[userList.columnName.UID] ||
      !user[userList.columnName.UserName] ||
      !user[userList.columnName.Pass]
    ) {
      proxy.elMessage({
        message: "该文件数据格式不规范，问题行：" + JSON.stringify(user),
        type: "error",
      });
      userList.init();
      return;
    }
    let UID = user[userList.columnName.UID];
    let UserName = user[userList.columnName.UserName];
    let Pass = user[userList.columnName.Pass];

    userList.list.push({ UID, UserName, Pass });
  }

  userList.showList = true;
}

//解析excel格式文件内容
function handleExcelContent(content: any) {
  proxy.$refs.upload.clearFiles();
  for (let table of content.data) {
    for (let user of table) {
      if (
        !user[userList.columnName.UID] ||
        !user[userList.columnName.UserName] ||
        !user[userList.columnName.Pass]
      ) {
        proxy.elMessage({
          message: "数据出现问题，行内容：" + JSON.stringify(user),
          type: "error",
        });
        userList.init();
        return;
      }
      let UID = user[userList.columnName.UID];
      let UserName = user[userList.columnName.UserName];
      let Pass = user[userList.columnName.Pass];

      userList.list.push({ UID, UserName, Pass });
    }
  }
  userList.showList = true;
}

//完成提交
function complete() {
  let tempArray = [];
  for (let i in userList.list)
    tempArray.push({
      UID: String(userList.list[i].UID),
      UserName: String(userList.list[i].UserName),
      Pass: String(userList.list[i].Pass),
    });
  proxy.$post("api/admin/users", tempArray, 1).then((res: any) => {
    let data = res.data;
    if (data.code == 0) {
      proxy.elMessage({ message: "批量添加成功!", type: "success" });
    }
    codeProcessor(data.code, data.msg);
  });
}
</script>

<style scoped lang="scss">
%title {
  color: #a8abb2;
  font-size: $fontSize6;
}

.BatchAddUser {
  background-color: #ffffff;

  >.uploadJson {
    margin-bottom: 20px;
  }

  >.example {
    width: fit-content;
    position: relative;
    padding: 10px;
    font-weight: 600;

    &:hover>.exampleText {
      visibility: visible;
    }

    >.title {
      @extend %title;
    }

    >.exampleText {
      width: max-content;
      position: absolute;
      visibility: hidden;
      margin: 10px;
      box-sizing: border-box;
      padding: 20px 40px;
      border-radius: 10px;
      background: #fefefe;
      box-shadow: 0 0 3px 1px #a8abb2;
    }
  }

  .setColumnName {
    padding: 10px;
    font-weight: 600;

    .title {
      @extend %title;
    }

    >div {
      color: #797979;
    }
  }

  .userList {
    border-radius: 10px;
    border: 2px solid #ababab;

    .header {
      height: 40px;
      display: flex;
      justify-content: space-around;
      align-items: center;
      background-color: #ababab;
      width: 100%;

      >div {
        font-size: $fontSize5;
      }
    }

    .item {
      display: flex;
      justify-content: space-around;
      align-items: center;
      height: 40px;
      width: 100%;
      margin: 5px 0;
      border-bottom: 2px dotted #cdcdcd;

      >div {
        font-size: $fontSize5;
      }
    }

    .btn {
      margin: 20px;
    }
  }
}
</style>

