<template>
  <div class="addlist">
    <div><span>比赛标题：</span>
      <el-input v-model="list.Title"></el-input>
    </div>
    <div>
      <span>比赛描述：</span>
      <el-input
        v-model="list.Description"
        type="textarea"
        autosize
      />
    </div>
    
    
    

    <el-table
      :data="problemList.data"
      style="width: 100%; margin: 20px 0"
    >
      <el-table-column
        label="题号"
        prop="PID"
      />
      <el-table-column
        label="标题"
        prop="Title"
      />
      <el-table-column align="right">
        <template #header>
          <div class="count">{{ problemList.data.length }}/{{maxListProblemLength  }}</div>
          <el-input
            v-model="problemList.searchPid"
            style="width: 200px;"
          />
          <el-button
            type="primary"
            @click="problemList.search()"
          >
            添加题目
          </el-button>
          <div style="display: flex">
          </div>
        </template>
        <template #default="scope">
          <el-button
            type="danger"
            @click="problemList.delete(scope.$index, scope.row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div style="display: flex; justify-content: flex-end; padding: 10px 0">
      <el-button
        plain
        v-on:click="AddList()"
      >添加</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { getCurrentInstance, reactive } from "vue";
import elMessage from "../../../utils/elMessageFactory";
// import { useConstValStore } from "../../../pinia/constVal";
// import { useUserDataStore } from "../../../pinia/userData";
const { proxy } = getCurrentInstance() as any;
// const userDataStore = useUserDataStore();
// const constValStore = useConstValStore();

// 题单最大可添加题目数量
const maxListProblemLength = 200;

type ListType = {
  UID: string;
  Title: string;
  Description: string;
  Problems:string[];
  [item: string]: any;
};

var list = reactive<ListType>({
  UID: "",
  Title: "",
  Description: "",
  Problems: [],
  init() {
    list.UID = "";
    list.Title = "";
    list.Description = "";
    list.Problems = [];
  },
});

//竞赛的题单
var problemList = reactive({
  data: [],
  searchPid: "P1000",
  //搜索
  search() {
    //如果列表中已经存在则取消添加
    if(this.data.length == maxListProblemLength){
      proxy.elMessage({
          message: "添加失败,一个题单最多只能添加" + maxListProblemLength+ "道题目",
          type: "warning",
        });
      return ;
    }
    for (let p in this.data)
      if (this.data[p].PID == this.searchPid) {
        proxy.elMessage({
          message: "添加失败，该题目已经存在！",
          type: "warning",
        });
        return;
      }
    //开始从后台中搜索题目
    proxy.$axios.get("api/problem/" + this.searchPid).then((res) => {
      let data = res.data;
      if (data.code == 0) {
        // proxy.$log(data);
        let problem = { PID: data.PID, Title: data.Title };
        this.data.push(problem);
        proxy.elMessage({ message: "添加成功!", type: "success" });
      } else {
        proxy.codeProcessor(
          data?.code ?? 100001,
          data?.msg ?? "服务器错误\\\\error"
        );
      }
    });
  },
  //删除当前行的题目
  delete(index, row) {
    for (let i in this.data) {
      if (index == i) this.data.splice(i, 1);
    }
    proxy.elMessage({
      message: "删除题号<" + row.PID + ">成功!",
      type: "success",
    });
  },
});

function AddList(){
  list.Problems = [];
  problemList.data.forEach(element => {
    list.Problems.push(element.PID)
  });
  if(list.Title == ""){
    elMessage({ message: "请输入题单标题!", type: "warning" });
    return ;
  }
  proxy.$post("/api/training/add/",{
    Title:list.Title,
    Description:list.Description,
    Problems:list.Problems.join(","),
  }).then((res:any)=>{
    let data = res.data;
      if (data.code == 0) {
        proxy.elMessage({ message: "添加成功!", type: "success" });
      } else {
        proxy.codeProcessor(
          data?.code ?? 100001,
          data?.msg ?? "服务器错误\\\\error"
        );
      }
  });
}
</script>

<style scoped lang="scss">
.addlist {
  width: 100%;
}

.addlist > div {
  display: flex;
  align-content: center;
  box-sizing: border-box;
  margin: 5px 0;
}

.addlist > div > span {
  font-size: 22px;
  width: 150px;
  @include font_color("font1");
}
.count{
  width: 20%;
  display:inline-flex;
  font-size: 15px;
  // align-content: center;
  text-align: center;
}
</style>