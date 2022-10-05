<template>
  <div
    class="ContestRank"
    ref="ContestRank"
  >
    <div class="contestID">
      #{{contest.CID}}
    </div>
    <div class="contestInfo">
      <div class="title">
        {{contest.Title}}
      </div>
      <div class="content">{{contest.Description}}</div>
      <div class="time">{{proxy.Utils.TimeTools.timestampToTime(contest.BeginTime)}} - {{proxy.Utils.TimeTools.timestampToTime(contest.EndTime)}}</div>
    </div>
    <div class="header">
      <div style="width:70px">排名</div>
      <div style="width:360px">用户名</div>
      <div style="width:90px">AC数</div>
      <div style="width:140px">罚时</div>
      <div
        v-for="(item,index) in contest.Data"
        :key="index"
        style="width:140px"
      >
        {{proxy.Utils.TSBaseTools.numberToAlpha(index + 1)+ "(" + item.ACNum + "/" + item.SubmitNum + ")"}}
      </div>
    </div>
    <div
      class="item"
      v-for="(item,index) in rank.rankList"
      :key="index"
    >
      <div style="width:70px">{{index + 1}}</div>
      <div style="width:360px;text-align: start;">{{item.Uname}}({{item.UserID}})</div>
      <div style="width:90px">{{item.ACNumber}}</div>
      <div style="width:140px">{{item.TimePenalty}}</div>
      <div
        class="problemStatus"
        v-for="(p,index) in contest.Data"
        :key="index"
        :style="'width:140px;' + getBackgroundColor(item.ProblemsMap.get(p.PID))"
      >
        <div v-if="item.ProblemsMap.get(p.PID) && item.ProblemsMap.get(p.PID).Status == 'AC'">
          {{(item.ProblemsMap.get(p.PID).Time/1000).toFixed(0)}}
        </div>
        <div v-if="(item.ProblemsMap.get(p.PID) && (item.ProblemsMap.get(p.PID).SubmitNumber > 1)) 
        ||  (item.ProblemsMap.get(p.PID) && (item.ProblemsMap.get(p.PID).SubmitNumber >= 1) && (item.ProblemsMap.get(p.PID).Status != 'AC'))">
          (-{{item.ProblemsMap.get(p.PID).Status == 'AC' ? item.ProblemsMap.get(p.PID).SubmitNumber-1 : item.ProblemsMap.get(p.PID).SubmitNumber}})
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { getCurrentInstance, onMounted, reactive } from "vue";
import { useStore } from "vuex";
const { proxy } = getCurrentInstance() as any;
const store = useStore();

//比赛信息
type contestType = {
  Data: { PID: number; Title: string; ACNum: number; SubmitNum: number }[];
  BeginTime: number;
  CID: number;
  Type: number;
  Description: string;
  EndTime: number;
  IsPublic: number;
  Pass: string;
  Size: number;
  Title: string;
  UID: string;
  [item: string]: any;
};
var contest = reactive<contestType>({
  Data: [],
  length: 0,
  BeginTime: 0,
  CID: null,
  Type: 1,
  Description: "",
  EndTime: 0,
  IsPublic: 1,
  Pass: null,
  Size: 0,
  Title: "",
  UID: "",
  copy(data: any) {
    let tempProblemSequence = data.Problems.split(",");
    for (let temp in tempProblemSequence) {
      for (let p in data.Data) {
        if (tempProblemSequence[temp] == data.Data[p].PID) {
          contest.Data.push({
            PID: data.Data[p].PID,
            Title: data.Data[p].Title,
            ACNum: data.Data[p].ACNum,
            SubmitNum: data.Data[p].SubmitNum,
          });
          break;
        }
      }
    }
    contest.length = data.length;
    contest.BeginTime = data.BeginTime;
    contest.CID = data.CID;
    contest.Type = data.Type;
    contest.Description = data.Description;
    contest.EndTime = data.EndTime;
    contest.IsPublic = data.IsPublic;
    contest.Pass = data.Pass;
    contest.Size = data.Size;
    contest.Title = data.Title;
    contest.UID = data.UID;
  },
});

//获取竞赛信息
async function getContest() {
  let params: { [item: string]: any } = {};
  contest.CID = proxy.$route.query.CID;
  if (proxy.$route.query.Pass) {
    contest.Pass = proxy.$route.query.Pass;
    params.Pass = proxy.$route.query.Pass;
  }
  await proxy.$get("api/contest/" + contest.CID, params).then((res) => {
    let data = res.data;
    if (data.code == 0) {
      // proxy.$log(data);
      contest.copy(data);
    }
    if (data.code == 2000) {
      proxy.$router.push({
        path: "/Contests",
      });
      proxy.elMessage({
        message: "竞赛密码错误！",
        type: "warning",
      });
    } else {
      proxy.codeProcessor(data.code);
    }
  });
}

type ProblemsMapType = {
  PID?: number;
  Time?: number;
  SubmitNumber: number;
  Status: string;
  Pioneer: boolean;
};
type listItemType = {
  ACNumber: number;
  AllSubmit: number;
  CENumber: number;
  Problems: {
    PID: number;
    Time: number;
    SubmitNumber: number;
    Status: string;
  }[];
  Uname: string;
  UserID: string;
  TimePenalty?: number;
  ProblemsMap?: Map<number, ProblemsMapType>;
};
var rank = reactive<{
  rankList: listItemType[];
  [item: string]: any;
}>({
  rankList: [],
  calculate(data: listItemType[]) {
    //保存题目PID 最先AC的人
    let tempPioneerFlags = new Map<number, any>();
    for (let i in contest.Data) {
      tempPioneerFlags.set(contest.Data[i].PID, {
        index: -1,
        Time: 0xfffffff,
      });
    }
    //遍历并封装数据
    for (let i in data) {
      let listItem: listItemType = {
        ACNumber: 0,
        AllSubmit: 0,
        CENumber: 0,
        Problems: [],
        Uname: "",
        UserID: "",
        TimePenalty: 0,
        ProblemsMap: new Map<number, ProblemsMapType>(),
      };
      listItem.ACNumber = data[i].ACNumber;
      listItem.AllSubmit = data[i].AllSubmit;
      listItem.CENumber = data[i].CENumber;
      listItem.Uname = data[i].Uname;
      listItem.UserID = data[i].UserID;
      let tempACTime = 0;
      for (let j in data[i].Problems) {
        let problem = data[i].Problems[j];
        if (problem.Status == "AC") {
          //计算 总ac时间
          tempACTime += Number((problem.Time / 1000).toFixed(0));
          //找出先锋（最先ac者）
          if (problem.Time < tempPioneerFlags.get(problem.PID).Time) {
            tempPioneerFlags.set(problem.PID, { index: i, Time: problem.Time });
          }
        }
        let tempProblem: ProblemsMapType = {
          Time: problem.Time,
          SubmitNumber: problem.SubmitNumber,
          Status: problem.Status,
          Pioneer: false,
        };
        listItem.ProblemsMap.set(problem.PID, tempProblem);
      }
      //计算罚时
      listItem.TimePenalty =
        (data[i].AllSubmit - data[i].CENumber - data[i].ACNumber) * 900 +
        tempACTime;
      rank.rankList.push(listItem);
    }
    //设置先锋
    for (let [key, value] of tempPioneerFlags) {
      if (value.index != -1) {
        rank.rankList[value.index].ProblemsMap.get(key).Pioneer = true;
      }
    }
    //排序
    rank.rankList.sort((a, b) => {
      if (a.ACNumber < b.ACNumber) return 1;
      else if (a.ACNumber == b.ACNumber) {
        if (a.TimePenalty < b.TimePenalty) return 1;
        else return 0;
      } else return -1;
    });

    console.log(this.rankList);
  },
});

//获取竞赛提交数据
async function getRankList() {
  let loading = proxy.elLoading({ node: proxy.$refs.ContestRank });
  await getContest();

  let params: { [item: string]: any } = { Pass: "" };
  let CID = proxy.$route.query.CID;
  if (proxy.$route.query.Pass) {
    params.Pass = proxy.$route.query.Pass;
  }
  params.CID = CID;
  proxy.$get("api/contest/" + CID + "/rank", params).then((res: any) => {
    // proxy.$log(res.data);
    rank.calculate(res.data.Data);
    loading.close();
  });
}

//获取背景色
function getBackgroundColor(item: ProblemsMapType | null) {
  if (item) {
    if (item.Pioneer)
      return "background-color:#2f9e44 !important; color: #eaeaea;";
    if (item.SubmitNumber > 0) {
      if (item.Status == "AC")
        return "background-color:#7ace27 !important; color: #FEFEFE;";
      else return "background-color:#e74a23 !important; color: #eaeaea;";
    }
  }
}

onMounted(() => {
  if (!proxy.$route.query.CID) {
    proxy.elMessage({
      message: "跳转地址错误，请重试",
      type: "warning",
    });
    return;
  }
  getRankList();
});
</script>

<style lang="scss" scoped>
.ContestRank {
  width: 100%;
  box-sizing: border-box;
  padding: $contestRank_outerPaddingTop $contestRank_outerPaddingLeft;
  display: flex;
  flex-direction: column;
  overflow-x: scroll;
  overflow-y: hidden;

  .contestID {
    font-size: $fontSize14;
    @include font_color("font5");
  }

  .contestInfo {
    width: 100%;

    .title {
      text-align: center;
      font-size: $fontSize14;
      @include font_color("font1");
    }

    .content {
      text-align: center;
      font-size: $fontSize5;
      @include font_color("font3");
      box-sizing: border-box;
      padding: 10px 40px;
    }

    .time {
      text-align: center;
      font-size: $fontSize6;
      @include font_color("font2");
      padding: 0 40px 40px 40px;
      letter-spacing: 2px;
    }
  }

  .header {
    display: flex;
    align-items: center;
    font-size: $fontSize7;
    @include font_color("font1");

    > div {
      box-sizing: border-box;
      padding: 4px 10px;
      text-align: center;
      border-right: 1px solid;
      border-bottom: 1px solid;
      @include fill_color("fill14");
      @include border_color("border1");
      flex-shrink: 0;

      &:last-child {
        border-right: none;
        border-start-end-radius: 10px;
      }

      &:first-child {
        border-start-start-radius: 10px;
      }
    }
  }

  .item {
    height: 80px;
    display: flex;
    align-items: center;
    font-size: $fontSize7;
    @include font_color("font2");

    &:last-child {
      > div {
        &:first-child {
          border-end-start-radius: 10px;
        }
        &:last-child {
          border-end-end-radius: 10px;
        }
      }
    }

    > div {
      height: 80px;
      line-height: 80px;
      box-sizing: border-box;
      padding: 0 5px;
      text-align: center;
      border-right: 1px solid;
      border-bottom: 1px solid;
      flex-shrink: 0;
      @include fill_color("fill4");
      @include border_color("border1");

      &:last-child {
        border-right: none;
      }
    }

    .problemStatus {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      div {
        height: 20px;
        line-height: 20px;

        &:first-child {
          font-size: $fontSize6;
        }
        &:last-child {
          font-size: $fontSize5;
        }
      }
    }
  }
}
</style>