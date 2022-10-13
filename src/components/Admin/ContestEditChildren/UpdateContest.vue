<template>
  <div class="UpdateContest">
    <div>
      <el-input-number
        v-model="contest.searchCid"
        :min="1"
      />
      <el-button
        type="primary"
        @click="contest.search()"
      > 搜索比赛 </el-button>
    </div>
    <div
      class="content"
      v-show="contest.isFound"
    >
      <div><span>比赛标题：</span>
        <el-input v-model="contest.Title" />
      </div>
      <div>
        <span>比赛描述：</span>
        <el-input
          v-model="contest.Description"
          type="textarea"
          autosize
        />
      </div>
      <div>
        <span>时间：</span>
        <el-date-picker
          v-model="contestTime"
          type="datetimerange"
          range-separator="到"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
        />
      </div>
      <div>
        <span>比赛类型：</span>
        <el-radio-group
          v-model="contest.Type"
          size="large"
        >
          <el-radio-button label="ACM" />
          <el-radio-button label="OI" />
        </el-radio-group>
      </div>
      <div>
        <span>是否公开：</span>
        <el-radio-group
          v-model="contest.IsPublic"
          size="large"
        >
          <el-radio-button label="公开" />
          <el-radio-button label="不公开" />
        </el-radio-group>
      </div>
      <div v-if="contest.IsPublic == '不公开'">
        <span>竞赛密码：</span>
        <el-input
          v-model="contest.Pass"
          placeholder="请输入新密码（缺省则密码不变）"
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
            <div style="display: flex">
              <el-input-number
                v-model="problemList.searchPid"
                :min="1"
              />
              <el-button
                type="primary"
                @click="problemList.search()"
              >
                添加题目
              </el-button>
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
          type="warning"
          plain
          v-on:click="deleteContest()"
        >
          删除
        </el-button>
        <el-button
          plain
          v-on:click="complete()"
        >修改</el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { getCurrentInstance, reactive, ref } from "vue";
import { useStore } from "vuex";
import { ElMessageBox } from "element-plus";
const { proxy } = getCurrentInstance() as any;
const store = useStore();

//比赛题单数据
var contest = reactive({
  UID: 0,
  CID: 0,
  Title: "",
  Description: "",
  BeginTime: 0,
  EndTime: 0,
  Type: "ACM",
  IsPublic: "公开",
  Pass: "",
  Problems: "",
  searchCid: 1,
  isFound: false,
  init() {
    this.UID = 0;
    this.Title = "";
    this.Description = "";
    this.BeginTime = 0;
    this.EndTime = 0;
    this.Type = 1;
    this.IsPublic = 1;
    this.Pass = "";
    this.Problems = [];
    this.isFound = false;
  },
  search() {
    this.init();
    problemList.init();
    proxy.$axios.get("api/contest/" + this.searchCid).then((res) => {
      let data = res.data;
      if (data.code == 0) {
        proxy.$log(data);
        this.UID = data.UID;
        this.CID = data.CID;
        this.Title = data.Title;
        this.Description = data.Description;
        this.BeginTime = data.BeginTime;
        this.EndTime = data.EndTime;
        this.Type =
          data.Type == store.state.constVal.CONTEST_TYPE_ACM ? "ACM" : "OI";
        this.IsPublic =
          data.IsPublic == store.state.constVal.CONTEST_PUBLIC
            ? "公开"
            : "不公开";
        this.Pass = data.Pass;
        this.Problems = data.Problems;
        contestTime.value = [new Date(data.BeginTime), new Date(data.EndTime)];
        let tempProblemSequence = data.Problems.split(",");
        for (let temp in tempProblemSequence) {
          for (let p in data.Data) {
            if (tempProblemSequence[temp] == data.Data[p].PID) {
              problemList.data.push({
                PID: data.Data[p].PID,
                Title: data.Data[p].Title,
              });
              break;
            }
          }
        }
        this.isFound = true;
        // proxy.$log(contestTime.value);
      } else {
        proxy.codeProcessor(data.code);
      }
    });
  },
});

//竞赛的题单
var problemList = reactive({
  data: [],
  searchPid: 1,
  init() {
    this.data = [];
  },
  //搜索
  search() {
    //如果列表中已经存在则取消添加
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
        proxy.codeProcessor(data.code);
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

//竞赛时间
var contestTime: any = ref([0, 0]);

//删除竞赛
function deleteContest() {
  ElMessageBox.confirm("确定要删除比赛 <" + contest.Title + "> 吗？", "注意", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    proxy.$axios
      .post("api/contest/delete/", {
        CID: contest.CID,
      })
      .then((res) => {
        let data = res.data;
        if (data.code == 0) {
          proxy.elMessage({
            message: "删除成功!",
            type: "success",
          });
        } else {
          proxy.codeProcessor(data.code);
        }
      });
  });
}

//提交竞赛信息
function complete() {
  //比赛没有设置题目
  if (problemList.data.length == 0) {
    proxy.elMessage({
      message: "该比赛没有设置题目！添加失败",
      type: "warning",
    });
    return;
  }

  if (contestTime.value == null) {
    proxy.elMessage({
      message: "该比赛没有设置时间！添加失败",
      type: "warning",
    });
    return;
  }

  contest.BeginTime = contestTime.value[0].getTime();
  contest.EndTime = contestTime.value[1].getTime();
  contest.Type =
    contest.Type == "ACM"
      ? store.state.constVal.CONTEST_TYPE_ACM
      : store.state.constVal.CONTEST_TYPE_OI;
  contest.IsPublic =
    contest.IsPublic == "公开"
      ? store.state.constVal.CONTEST_PUBLIC
      : store.state.constVal.CONTEST_NOTPUBLIC;
  let tempArray = [];
  for (let p in problemList.data) tempArray.push(problemList.data[p].PID);
  contest.Problems = tempArray.join(",");
  // proxy.$log(contest);
  proxy.$axios
    .post("api/contest/edit/", {
      CID: contest.CID,
      uid: store.state.userData.uid,
      Title: contest.Title,
      Description: contest.Description,
      BeginTime: contest.BeginTime,
      EndTime: contest.EndTime,
      Type: contest.Type,
      IsPublic: contest.IsPublic,
      Pass: contest.Pass,
      Problems: contest.Problems,
    })
    .then((res) => {
      let data = res.data;
      if (data.code == 0) {
        contest.init();
        problemList.init();
        proxy.elMessage({ message: "修改成功!", type: "success" });
      }
      proxy.codeProcessor(data.code);
    });
}
</script>

<style scoped lang="scss">
.UpdateContest {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.content {
  width: 100%;
}

.content > div {
  display: flex;
  align-content: center;
  box-sizing: border-box;
  margin: 5px 0;
}

.content > div > span {
  font-size: 22px;
  width: 150px;
  @include font_color("font1");
}
</style>