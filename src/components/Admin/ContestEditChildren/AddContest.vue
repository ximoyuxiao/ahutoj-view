<template>
  <div class="AddContest">
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
      <el-input v-model="contest.Pass" />
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
        plain
        v-on:click="complete()"
      >添加</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { getCurrentInstance, reactive, ref } from "vue";
import { useConstValStore } from "../../../pinia/constVal";
import { useUserDataStore } from "../../../pinia/userData";
const { proxy } = getCurrentInstance() as any;
const userDataStore = useUserDataStore();
const constValStore = useConstValStore();

//比赛题单数据
type contestType = {
  UID: string;
  Title: string;
  Description: string;
  BeginTime: number;
  EndTime: number;
  Type: number | string;
  IsPublic: number | string;
  Pass: string;
  Problems: string | string[];
  [item: string]: any;
};
var contest = reactive<contestType>({
  UID: "",
  Title: "",
  Description: "",
  BeginTime: 0,
  EndTime: 0,
  Type: "ACM",
  IsPublic: "公开",
  Pass: "",
  Problems: "",
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
  },
});

//竞赛的题单
var problemList = reactive({
  data: [],
  searchPid: 1,
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

//竞赛时间
var contestTime = ref(null);

//提交竞赛信息
function complete() {
  //比赛没有设置题目
  if (userDataStore.UID == "") {
    proxy.elMessage({
      message: "登录数据异常，请重新登录！",
      type: "warning",
    });
    return;
  }

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

  // proxy.$log(contestTime.value);
  contest.BeginTime = contestTime.value[0].getTime();
  contest.EndTime = contestTime.value[1].getTime();
  //转换类型以及是否公开为数据库数据类型
  contest.Type =
    contest.Type == "ACM"
      ? constValStore.CONTEST_TYPE_ACM
      : constValStore.CONTEST_TYPE_OI;
  contest.IsPublic =
    contest.IsPublic == "公开"
      ? constValStore.CONTEST_PUBLIC
      : constValStore.CONTEST_NOTPUBLIC;
  //生成题目列表
  let tempArray = [];
  for (let p in problemList.data) tempArray.push(problemList.data[p].PID);
  contest.Problems = tempArray.join(",");
  proxy
    .$post("api/contest/add/", {
      UID: userDataStore.UID,
      Title: contest.Title,
      Description: contest.Description,
      BeginTime: contest.BeginTime,
      EndTime: contest.EndTime,
      Type: contest.Type,
      IsPublic: contest.IsPublic,
      Pass: contest.Pass,
      Problems: contest.Problems,
    })
    .then((res: any) => {
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
.AddContest {
  width: 100%;
}

.AddContest > div {
  display: flex;
  align-content: center;
  box-sizing: border-box;
  margin: 5px 0;
}

.AddContest > div > span {
  font-size: 22px;
  width: 150px;
  @include font_color("font1");
}
</style>