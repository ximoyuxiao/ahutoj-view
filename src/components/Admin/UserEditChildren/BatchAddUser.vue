<template>
  <div class="BatchAddUser">
    <el-upload
      class="uploadJson"
      drag
      accept=".json"
      :auto-upload="false"
      :limit="1"
      :on-change="uploadParser"
      :on-exceed="overflowLimit"
      :on-remove="init"
    >
      <el-icon class="el-icon--upload">
        <upload-filled />
      </el-icon>
      <div class="el-upload__text">
        以Json格式文件上传用户数据 <em>点击</em>或者<em>拖拽</em>
      </div>
    </el-upload>
    <div class="example">
      示例格式如下:
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
    <div
      class="userList"
      v-show="userList.showList"
    >
      <div class="header">
        <div>用户名</div>
        <div>昵称</div>
        <div>密码</div>
        <div>操作</div>
      </div>
      <div
        class="item"
        v-for="(item, index) in userList.list"
        :key="index"
      >
        <div>{{ item.UID }}</div>
        <div>{{ item.UserName }}</div>
        <div>{{ item.Pass }}</div>
        <el-button
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

<script>
import { getCurrentInstance, reactive } from 'vue'
export default {
  name: 'BatchAddUser',
  setup() {
    const { proxy } = getCurrentInstance()

    const userList = reactive({
      list: [],
      showList: false,
      remove(index) {
        for (let i in this.list) {
          if (index == i) this.list.splice(i, 1)
        }
      },
    })

    //初始化数据
    function init() {
      userList.list = []
      userList.showList = false
    }

    //上传文件解析器
    function uploadParser(event, fileList) {
      let file = fileList[0]
      let reader = new FileReader()
      reader.readAsText(file.raw)
      reader.onload = (e) => {
        // 处理文件内容
        var userArray = JSON.parse(e.target.result)
        if (!(userArray instanceof Array)) {
          proxy.elMessage({
            message: '该文件数据格式不规范，它并不能被解析为Json对象',
            type: 'error',
          })
          return
        }
        for (let user in userArray) {
          // console.log(userArray[user]);
          if (
            !userArray[user].UID ||
            !userArray[user].UserName ||
            !userArray[user].Pass
          ) {
            proxy.elMessage({
              message:
                '该文件数据格式不规范，请对照示例检查，包括中括号、大括号、大小写、双引号等',
              type: 'error',
            })
            userList.init()
            return
          }
          userList.list.push(userArray[user])
        }

        userList.showList = true
      }
    }

    //超出限制
    function overflowLimit() {
      proxy.elMessage({
        message: '最多解析一个文件哦',
        type: 'warning',
      })
    }

    //完成提交
    function complete() {
      let tempArray = []
      for (let i in userList.list)
        tempArray.push({
          UID: userList.list[i].UID,
          UserName: userList.list[i].UserName,
          Pass: userList.list[i].Pass,
        })
      console.log(JSON.stringify(tempArray))

      proxy
        .$post('api/admin/users/', JSON.stringify(tempArray), 1)
        .then((res) => {
          // console.log(res)
        })
    }

    return { init, uploadParser, overflowLimit, userList, complete }
  },
}
</script>

<style scoped lang="scss">
.BatchAddUser {
  background-color: #ffffff;
}

.uploadJson {
  margin-bottom: 20px;
}

.example {
  padding: 10px;
  font-weight: 600;
  color: #a8abb2;

  .exampleText {
    margin: 10px;
    box-sizing: border-box;
    padding: 20px 40px;
    border-radius: 10px;
    border: 1px dotted #ff8c00;
    color: #ff8c00;
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

    > div {
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

    > div {
      font-size: $fontSize5;
    }
  }

  .btn {
    margin: 20px;
  }
}
</style>

