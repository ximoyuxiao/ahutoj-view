<template>
  <div class="updateList">
      <div class="search">
          <span style="width: 100px">题单号：</span>
          <el-input-number
              v-model="search.LID"
              :min="1000"
              style="width:200px;"
              v-on:focus="search.onFocus()"
          />
          <el-button
              plain
              v-on:click="search.getListInfo(null)"
          >搜索</el-button>
      </div>
      <el-divider></el-divider>
      <div
          class="table"
          v-if="search.isSearched"
      >
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
        v-on:click="updateList()"
      >更新</el-button>
      <el-button
        plain
        v-on:click="deleteList([search.LID])"
      >删除</el-button>
    </div>
  </div>
      </div>
      <div class="showList">
          <el-button
              plain
              v-on:click="searchList.showList()"
          >
              {{searchList.isShowed ? "关闭列表" : "显示列表" }}
          </el-button>
          <el-button
              plain
              v-show="searchList.isShowed"
              v-on:click="searchList.selectAll()"
          >
              当页全选
          </el-button>
          <el-button
              plain
              v-show="searchList.isShowed"
              type="warning"
              v-on:click="searchList.batchDelete()"
          >
              批量删除
          </el-button>
      </div>
      <div
          v-show="searchList.isShowed"
          class="list"
      >
          <div
              v-for="(item, index) in searchList.Data"
              :class="item.selected ? 'item itemSelected' : 'item'"
              :key="index"
          >
              <input
                  type="checkbox"
                  :checked="item.selected"
                  @change.stop="searchList.selectList(index)"
              >
              <div
                  class="title cursor_pointer"
                  @click.stop="search.getListInfo(item.LID)"
              >
                  {{ item.LID }}&nbsp;-&nbsp;{{ item.Title }}
              </div>

          </div>
      </div>
      <div
          v-show="searchList.isShowed"
          class="pagination"
      >
          <el-pagination
              background
              layout="prev, pager, next"
              :page-size="configList.limit"
              :total="configList.Count"
              :current-page="configList.currentPage"
              @current-change="searchList.changePage"
          />
      </div>
  </div>
</template>

<script lang="ts" setup>
import { getCurrentInstance, reactive } from "vue";
import { ElMessageBox } from "element-plus";
import elMessage from "../../../utils/elMessageFactory";
import "md-editor-v3/lib/style.css";
import { title } from "process";
const { proxy } = getCurrentInstance() as any;
const maxListProblemLength = 200;
type SearchType = {
    LID: number;
    isSearched: boolean;
    [item: string]: any;
}
//题单题号搜索功能
var search = reactive<SearchType>({
    LID: 1000,
    isSearched: false,
    onFocus() {
        search.isSearched = false;
    },
    getListInfo(LID: number) {
        if (LID) {
            search.LID = LID;
        }
        proxy.$axios.get("api/training/" + search.LID).then((res: any) => {
            let data = res.data;
            if (data.code == 0) {
                list.copy(data);
                problemList.uptdate(data.Data);
                search.isSearched = true;
            } else {
                search.isSearched = false;
            }
            proxy.codeProcessor(
                data?.code ?? 100001,
                data?.msg ?? "服务器错误\\\\error"
            );
        });
    },
});

//题目数据
var list = reactive({
    Title:"",
    Description:"",
    Problems:[],  
    init() {
      list.Title = "";
      list.Description = "";
      list.Problems = [];
    },
    copy(data: any) {
      list.Title = data.Title;
      list.Description = data.Description;
      data.Data.forEach(element => {
        list.Problems.push(element.LID);
      });
    },
});

var problemList = reactive({
  data: [],
  searchPid: "",
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
  uptdate(data:any){
    this.searchPid = ""
    this.data = [];
    data.forEach(element => {
      problemList.data.push(
        {
          PID:element.PID,
          Title:element.Ptitle,
        }
      );
    });
  }
});

function updateList(){
  list.Problems = [];
  problemList.data.forEach(element => {
    list.Problems.push(element.PID)
  });
  if(list.Title == ""){
    elMessage({ message: "请输入题单标题!", type: "warning" });
    return ;
  }
  proxy.$post("/api/training/edit/",{
    LID:search.LID,
    Title:list.Title,
    Description:list.Description,
    Problems:list.Problems.join(","),
  }).then((res:any)=>{
    let data = res.data;
      if (data.code == 0) {
        proxy.elMessage({ message: "修改成功!", type: "success" });
      } else {
        proxy.codeProcessor(
          data?.code ?? 100001,
          data?.msg ?? "服务器错误\\\\error"
        );
      }
  });
}
function deleteList(LIDs:number[]){
  proxy.$post("/api/training/delete/",{
    LID:LIDs
  }).then((res:any)=>{
    let data = res.data;
    if (data.code == 0) {
        proxy.elMessage({ message: "删除成功!", type: "success" });
      } else {
        proxy.codeProcessor(
          data?.code ?? 100001,
          data?.msg ?? "服务器错误\\\\error"
        );
      }
  });
}
//列表分页的配置项
var configList = reactive({
    Count: 0, //当前数据量
    currentPage: 1,
    limit: 20,
    //初始化页面配置数据
    init() {
        configList.Count = 0;
        configList.currentPage = 1;
        configList.limit = 20;
    },
});

//列表的搜索结果
var searchList = reactive({
    Data: [],
    isShowed: false,
    selectAlled:false,
    //初始化当前列表
    init() {
        this.Data = [];
    },
    //搜索当前列表
    showList: () => {
        if (searchList.isShowed) searchList.isShowed = false;
        else {
            searchList.isShowed = true;
            searchList.search();
        }
    },
    search: () => {
        proxy
            .$get(
                "api/training/list?Page=" +
                    (configList.currentPage - 1) +
                    "&Limit=" +
                    configList.limit
            )
            .then((res: any) => {
                let data = res.data;
                if (data.code == 0) {
                    // proxy.$log(data)
                    configList.Count = data.Count;
                    searchList.Data = data.data;
                    searchList.Data.forEach((item) => {
                        item.selected = false;
                    });
                    searchList.isShowed = true;
                    searchList.selectAlled = false;
                }
                proxy.codeProcessor(
                    data?.code ?? 100001,
                    data?.msg ?? "服务器错误\\\\error"
                );
            });
    },
    //页面切换
    changePage: (page: any) => {
        configList.currentPage = page;
        //切换页面后开始显示数据
        searchList.search();
    },
    //选择
    selectList: (index: any) => {
        searchList.Data[index].selected = searchList.Data[index].selected
            ? false
            : true;
    },
    //全选
    selectAll: () => {
      searchList.selectAlled = !searchList.selectAlled;
      searchList.Data.forEach((element) => {
          element.selected = searchList.selectAlled;
      });
    },
    //批量删除
    batchDelete: () => {
        let tempSelected = [];
        let tempString = "";
        searchList.Data.forEach((item) => {
            if (item.selected) {
                tempSelected.push(item.LID);
                tempString += item.LID + " ";
            }
        });
        if (tempSelected.length <= 0) {
            proxy.elMessage({ message: "未选择任何题单！", type: "warning" });
            return;
        }
        ElMessageBox.confirm(
            "确定要批量删除题单 " + tempString + " 题单吗？",
            "注意",
            {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            }
        ).then(() => {
            proxy.$axios
                .post("/api/training/delete/", {
                    LID: tempSelected,
                })
                .then((res: any) => {
                    let data = res.data;
                    if (data.code == 0) {
                        list.init();
                        proxy.elMessage({
                            message: "批量删除成功!",
                            type: "success",
                        });
                    }
                    proxy.codeProcessor(
                        data?.code ?? 100001,
                        data?.msg ?? "服务器错误\\\\error"
                    );
                });
            searchList.isShowed = false;
        });
    },
});
</script>

<style scoped lang="scss">
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
.search {
    display: flex;
    justify-items: center;
    align-content: center;
    margin-bottom: 40px;
}

span {
  font-size: 22px;
  width: 150px;
  @include font_color("font1");
}

.list {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    box-sizing: border-box;
    padding: 5px;

    .item {
        width: 100%;
        box-sizing: border-box;
        padding: 3px 10px;
        margin: 5px 0;
        border-radius: 8px;
        border: 2px solid;
        @include border_color("border2");
        display: flex;
        align-items: center;
        transition-duration: 260ms;

        &:hover {
            @include fill_color("fill15");
            border: 2px solid;
            @include border_color("fill12");
        }

        input {
            height: 20px;
            width: 20px;
            margin: 0 10px;
        }

        .title {
            width: fit-content;
            font-size: $fontSize7;
            @include font_color("font1");
        }
    }

    .itemSelected {
        @include fill_color("fill45");
    }
}

.pagination {
    margin: 25px 0;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    justify-items: center;
}
</style>