<template>
  <div class="updateProblem">
    <div class="search">
      <span style="width: 70px">题号：</span>
      <el-input-number
        v-model="search.PID"
        :min="1"
        v-on:focus="search.onFocus()"
      />
      <el-button
        plain
        v-on:click="search.getProblem()"
      >搜索</el-button>
    </div>
    <el-divider></el-divider>
    <div
      class="table"
      v-if="search.isSearched"
    >
      <div><span>标题：</span>
        <el-input v-model="problem.Title" />
      </div>
      <div>
        <span>题目描述：</span>
        <el-input
          v-model="problem.Description"
          type="textarea"
          autosize
        />
      </div>
      <div>
        <span>输入描述：</span>
        <el-input
          v-model="problem.Input"
          type="textarea"
          autosize
        />
      </div>
      <div>
        <span>输出描述：</span>
        <el-input
          v-model="problem.Output"
          type="textarea"
          autosize
        />
      </div>
      <div>
        <span>输入样例：</span>
        <el-input
          v-model="problem.SampleInput"
          type="textarea"
          autosize
        />
      </div>
      <div>
        <span>输出样例：</span>
        <el-input
          v-model="problem.SampleOutput"
          type="textarea"
          autosize
        />
      </div>
      <div>
        <span>时间限制：</span>
        <el-input-number
          v-model="problem.LimitTime"
          :min="1"
        />
        <span>&nbsp;毫秒</span>
      </div>
      <div>
        <span>内存限制：</span>
        <el-input-number
          v-model="problem.LimitMemory"
          :min="1"
        />
        <span>&nbsp;MB</span>
      </div>
      <div>
        <span>提示：</span>
        <el-input
          v-model="problem.Hit"
          type="textarea"
          autosize
        />
      </div>
      <div>
        <span>标签：</span>
        <el-input
          v-model="problem.Label"
          placeholder="请输入的每个标签之间用';'隔开"
        />
      </div>
      <div style="display: flex; justify-content: flex-end; padding: 10px 0">
        <el-button
          type="warning"
          plain
          v-on:click="deleteProblem()"
        >
          删除
        </el-button>
        <el-button
          plain
          v-on:click="complete()"
        >修改</el-button>
      </div>
    </div>
    <div class="showList">
      <el-button
        plain
        v-on:click="searchList.showList()"
      >
        {{searchList.isShowed ? "关闭列表" : "显示列表" }}
      </el-button>
    </div>
    <div
      v-show="searchList.isShowed"
      class="list"
    >
      <div
        class="item"
        v-for="(item, index) in searchList.Data"
        :key="index"
      >
        <div class="title cursor_pointer">
          {{ item.PID }}&nbsp;-&nbsp;{{ item.Title }}
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

<script>
import { getCurrentInstance, reactive } from 'vue'
import { ElMessageBox } from 'element-plus'

export default {
  name: 'UpdateProblem',
  setup() {
    const { proxy } = getCurrentInstance()
    //题目题号搜索功能
    var search = reactive({
      PID: 0,
      isSearched: false,
      onFocus() {
        this.isSearched = false
      },
      getProblem() {
        proxy.$axios.get('api/problem/' + search.PID).then((res) => {
          let data = res.data
          if (data.code == 0) {
            // console.log(data);
            problem.copy(data)
            this.isSearched = true
          } else {
            proxy.codeProcessor(data.code)
            this.isSearched = false
          }
        })
      },
    })
    //题目数据
    var problem = reactive({
      PID: 0,
      Title: '',
      Description: '',
      Input: '',
      Output: '',
      SampleInput: '',
      SampleOutput: '',
      LimitTime: 0,
      LimitMemory: 0,
      Hit: '',
      Label: '',
      init() {
        search.isSearched = false
        this.PID = 0
        this.Title = ''
        this.Description = ''
        this.Input = ''
        this.Output = ''
        this.SampleInput = ''
        this.SampleOutput = ''
        this.LimitTime = 0
        this.LimitMemory = 0
        this.Hit = ''
        this.Label = ''
      },
      copy(data) {
        this.PID = data.PID
        this.Description = data.Description
        this.Hit = data.Hit
        this.Input = data.Input
        this.LimitMemory = data.LimitMemory
        this.LimitTime = data.LimitTime
        this.Output = data.Output
        this.SampleInput = data.SampleInput
        this.SampleOutput = data.SampleOutput
        this.Title = data.Title
        this.Label = data.Label
      },
    })
    //列表分页的配置项
    var configList = reactive({
      Count: 0, //当前数据量
      currentPage: 1,
      limit: 20,
      //初始化页面配置数据
      init() {
        this.Count = 0
        this.currentPage = 1
        this.limit = 20
      },
    })
    //列表的搜索结果
    var searchList = reactive({
      Data: [],
      isShowed: false,
      //初始化当前列表
      init() {
        this.Data = []
      },
      //搜索当前列表
      showList: () => {
        if (searchList.isShowed) searchList.isShowed = false
        else {
          searchList.isShowed = true
          searchList.search()
        }
      },
      search: () => {
        proxy.$axios
          .get(
            'api/problem/list?Page=' +
              (configList.currentPage - 1) +
              '&Limit=' +
              configList.limit
          )
          .then((res) => {
            let data = res.data
            if (data.code == 0) {
              // console.log(data)
              configList.Count = data.Count
              searchList.Data = data.Data
              searchList.isShowed = true
            } else {
              proxy.codeProcessor(data.code)
            }
          })
      },
      //页面切换
      changePage: (page) => {
        configList.currentPage = page
        //切换页面后开始显示数据
        searchList.search()
      },
    })

    //删除题目
    function deleteProblem() {
      ElMessageBox.confirm(
        '确定要删除题号为 ' + search.PID + ' 的题目吗？',
        '注意',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).then(() => {
        proxy.$axios
          .post('api/problem/delete/', {
            Pids: [search.PID],
          })
          .then((res) => {
            let data = res.data
            if (data.code == 0) {
              problem.init()
              proxy.elMessage({
                message: '删除成功!',
                type: 'success',
              })
            } else {
              proxy.codeProcessor(data.code)
            }
          })
      })
    }

    //完成修改
    function complete() {
      proxy.$axios
        .post('api/problem/edit/', {
          Pid: problem.PID,
          Title: problem.Title,
          Description: problem.Description,
          Input: problem.Input,
          Output: problem.Output,
          Sample_input: problem.SampleInput,
          Sample_output: problem.SampleOutput,
          LimitTime: problem.LimitTime,
          LimitMemory: problem.LimitMemory,
          Hit: problem.Hit,
          Label: problem.Label,
        })
        .then((res) => {
          let data = res.data
          if (data.code == 0) {
            console.log(data)
            proxy.elMessage({ message: '修改成功!', type: 'success' })
          } else {
            proxy.codeProcessor(data.code)
          }
        })
    }

    return {
      search,
      problem,
      configList,
      searchList,
      complete,
      deleteProblem,
    }
  },
}
</script>

<style scoped>
.search {
  display: flex;
  justify-items: center;
  align-content: center;
  margin-bottom: 40px;
}

.table {
  width: 100%;
}

.table > div {
  display: flex;
  align-content: center;
  box-sizing: border-box;
  margin: 5px 0;
}

span {
  font-size: 22px;
  width: 150px;
  color: #f2f2f2;
}

.list {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  box-sizing: border-box;
  padding: 5px;
}

.list .item {
  width: 100%;
  box-sizing: border-box;
  padding: 3px 10px;
  margin: 5px 0;
  border-radius: 8px;
  border: 2px solid var(--border_color1);
  display: flex;
  flex-direction: column;
  transition-duration: 300ms;
}
.list .item:hover {
  background-color: var(--bcg_color34);
  border: 2px solid var(--bcg_color33);
}

.list .item .title {
  width: fit-content;
  font-size: var(--FontSize7);
  color: var(--font_color1);
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