<template>
  <div class="ContestRank" ref="ContestRank">
    <div class="contestID cursor_pointer" @click="backToContest">
      <el-icon size="32px">
        <Back />
      </el-icon>
      <div>
        #{{ contest.CID }}
      </div>
    </div>
    <div class="contestInfo">
      <div class="title">
        {{ contest.Title }}
      </div>
      <div class="content">{{ contest.Description }}</div>
      <div class="time">{{ proxy.Utils.TimeTools.timestampToTime(contest.BeginTime) }} -
        {{ proxy.Utils.TimeTools.timestampToTime(contest.EndTime) }}</div>
    </div>
    <el-button style="margin: auto;" v-on:click="DownLoadRankList()">下载竞赛排名</el-button>
    <br>
    <template v-if="ACM == 1">
      <div class="header">
        <div style="width:70px">Rank</div>
        <div style="width:300px">ID</div>
        <div style="width:120px">班级</div>
        <div style="width:90px">总分</div>
        <div style="width:80px">罚时</div>
        <div v-for="(item, index) in contest.Data" :key="index" style="width:80px">
          {{ proxy.Utils.TSBaseTools.numberToAlpha(index + 1) + "(" + item.ACNum + "/" + item.SubmitNum + ")" }}
        </div>
      </div>
      <div class="item" v-for="(item, index) in rank.rankList" :key="index">
        <template v-if="item.medal != 0">
          <div style="width:70px;">
            <div class="medalIcon">
              <el-icon size="36px" color="#fabd08" v-if="item.medal == 1">
                <Medal />
              </el-icon>
              <el-icon size="36px" color="#d6d6d6" v-else-if="item.medal == 2">
                <Medal />
              </el-icon>
              <el-icon size="36px" color="#c57120" v-else="item.medal == 3">
                <Medal />
              </el-icon>
            </div>
            {{ index + 1 }}
          </div>
        </template>
        <template v-else>
          <div style="width:70px;">{{ index + 1 }}</div>
        </template>

        <div style="width:300px;">{{ item.Uname }}({{ item.UserID }})</div>
        <div style="width:120px">{{ item.Uclass }}</div>
        <div style="width:90px">{{ item.ACNumber }}</div>
        <div style="width:80px">{{ proxy.Utils.TimeTools.timestampToInterval(item.TimePenalty * 1000, 2) }}</div>
        <div class="problemStatus" v-for="(p, index) in contest.Data" :key="index"
          :style="'width:80px;' + getBackgroundColor(item.ProblemsMap[p.PID])">
          <div v-if="item.ProblemsMap[p.PID] && item.ProblemsMap[p.PID].Status == 'AC'">
            {{ (item.ProblemsMap[p.PID].Time / 1000).toFixed(0) }}
          </div>
          <div
            v-if="(item.ProblemsMap[p.PID] && (item.ProblemsMap[p.PID].SubmitNumber > 1))
              || (item.ProblemsMap[p.PID] && (item.ProblemsMap[p.PID].SubmitNumber >= 1) && (item.ProblemsMap[p.PID].Status != 'AC'))">
            (-{{ item.ProblemsMap[p.PID].Status == 'AC' ? item.ProblemsMap[p.PID].SubmitNumber - 1 :
              item.ProblemsMap[p.PID].SubmitNumber }})
          </div>
        </div>
      </div>
    </template>
    <template v-if="ACM == 2">
      <div class="header">
        <div style="width:70px">排名</div>
        <div style="width:300px">用户名</div>
        <div style="width:120px">班级</div>
        <div style="width:90px">总得分</div>
        <div style="width:80px">总用时</div>
        <div v-for="(item, index) in contest.Data" :key="index" style="width:80px">
          {{ proxy.Utils.TSBaseTools.numberToAlpha(index + 1) }}
        </div>
      </div>
      <div class="item" v-for="(item, index) in rank.rankListOfOI" :key="index">
        <template v-if="item.medal != 0">
          <div style="width:70px;">
            <div class="medalIcon">
              <el-icon size="36px" color="#fabd08" v-if="item.medal == 1">
                <Medal />
              </el-icon>
              <el-icon size="36px" color="#d6d6d6" v-else-if="item.medal == 2">
                <Medal />
              </el-icon>
              <el-icon size="36px" color="#c57120" v-else="item.medal == 3">
                <Medal />
              </el-icon>
            </div>
            {{ index + 1 }}
          </div>
        </template>
        <template v-else>
          <div style="width:70px;">{{ index + 1 }}</div>
        </template>

        <div style="width:300px;text-align: start;">{{ item.Uname }}({{ item.UserID }})</div>
        <div style="width:120px">{{ item.Uclass }}</div>
        <div style="width:90px">{{ item.Score }}</div>
        <div style="width:80px">{{ item.AllTime }}</div>
        <div class="problemStatus" v-for="(p, index) in contest.Data" :key="index"
          :style="'width:80px;' + getBackgroundColorOfOI(item.ProblemsMap[p.PID])">
          <div v-if="item.ProblemsMap[p.PID]">
            {{ item.ProblemsMap[p.PID].Score }} ({{ (item.ProblemsMap[p.PID].Time) }}ms)
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { getCurrentInstance, onMounted, reactive, ref } from "vue";
import { usePageBufferedDataStore } from "../../pinia/pageBufferdData";
import { write, utils, WorkSheet } from "xlsx";
const { proxy } = getCurrentInstance() as any;
const pageBufferedDataStore = usePageBufferedDataStore();
var ACM = ref(1);
type ProblemsMapOfACMType = {
  PID?: string;
  Time?: number;
  SubmitNumber: number;
  Status: string;
  Pioneer: boolean;
};
type ProblemsMapOfOIType = {
  PID?: string;
  Score: number;
  Submited: boolean;
  Time?: number;
  Pioneer: boolean;
}
type listItemOfOItype = {
  Solved: number;
  Score: number;
  Problems: {
    PID: string;
    Time: number;
    Score: number;
    Submited: boolean;
  }[];
  Uname: string;
  UserID: string;
  Uclass: string;
  AllTime: number;
  ProblemsMap?: Map<string, ProblemsMapOfOIType>;
  medal?: number;
}
type listItemOfACMType = {
  ACNumber: number;
  AllSubmit: number;
  CENumber: number;
  Uclass: string;
  Problems: {
    PID: string;
    Time: number;
    SubmitNumber: number;
    Status: string;
  }[];
  Uname: string;
  UserID: string;
  TimePenalty?: number;
  ProblemsMap?: Map<string, ProblemsMapOfACMType>;
  medal?: number;
};
var rank = reactive<{
  rankList: listItemOfACMType[];
  rankListOfOI: listItemOfOItype[];
  [item: string]: any;
}>({
  rankList: [],
  rankListOfOI: [],
  calculateOfACM(data: listItemOfACMType[]) {
    //保存题目PID 最先AC的人
    let tempPioneerFlags = new Map<number, any>();
    //保存当前已有的题目防止出现题目被删除但是已有人提交而产生的问题。
    let tempNowContestProblems = new Array();
    for (let i in contest.Data) {
      tempPioneerFlags[contest.Data[i].PID] = {
        index: -1,
        Time: 0xfffffff,
      };
      tempNowContestProblems.push(contest.Data[i].PID);
    }
    //遍历并封装数据
    for (let i in data) {
      //暂存当期处理的行的数据
      let listItem: listItemOfACMType = {
        ACNumber: 0,
        AllSubmit: 0,
        CENumber: 0,
        Uclass: "",
        Problems: [],
        Uname: "",
        UserID: "",
        TimePenalty: 0,
        ProblemsMap: new Map<string, ProblemsMapOfACMType>(),
        medal: 0,
      };
      listItem.ACNumber = data[i].ACNumber;
      listItem.AllSubmit = data[i].AllSubmit;
      listItem.CENumber = data[i].CENumber;
      listItem.Uname = data[i].Uname;
      listItem.UserID = data[i].UserID;
      listItem.Uclass = data[i].Uclass;
      //计算总罚时
      let tempACTime = 0;
      for (let j in data[i].Problems) {
        let problem = data[i].Problems[j];
        if (problem.PID == "") continue;
        if (problem.Status == "AC") {
          tempACTime += Number((problem.Time / 1000).toFixed(0));
          //找出先锋（最先ac者）
          if (problem.Time < tempPioneerFlags[problem.PID]?.Time) {
            tempPioneerFlags[problem.PID] = {
              index: Number(i),
              Time: problem.Time,
            };
          }
        }
        let tempProblem: ProblemsMapOfACMType = {
          Time: problem.Time,
          SubmitNumber: problem.SubmitNumber,
          Status: problem.Status,
          Pioneer: false,
        };
        listItem.ProblemsMap[problem.PID] = tempProblem;
      }
      //计算罚时
      listItem.TimePenalty =
        (data[i].AllSubmit - data[i].CENumber - data[i].ACNumber) * 900 +
        tempACTime;
      rank.rankList.push(listItem);
    }
    //设置先锋
    for (let i in tempPioneerFlags) {
      if (tempPioneerFlags[i].index != -1) {
        rank.rankList[tempPioneerFlags[i].index].ProblemsMap[i].Pioneer = true;
      }
    }

    //排序
    rank.rankList.sort((a, b) => {
      if (a.ACNumber < b.ACNumber) return 1;
      else if (a.ACNumber == b.ACNumber) {
        if (a.TimePenalty < b.TimePenalty) return -1;
        else return 1;
      } else return -1;
    });

    //统计金银铜牌
    let goldIndex = Number((rank.rankList.length * 0.1).toFixed(0));
    let silverIndex = Number((rank.rankList.length * 0.3).toFixed(0));
    let copperIndex = Number((rank.rankList.length * 0.6).toFixed(0));
    goldIndex = goldIndex < 1 ? 1 : goldIndex;
    silverIndex = silverIndex < 2 ? 2 : silverIndex;
    copperIndex = copperIndex < 3 ? 3 : copperIndex;
    for (let i = 0; i < rank.rankList.length; i++) {
      if (i < goldIndex) {
        rank.rankList[i].medal = 1;
      } else if (i < silverIndex) {
        rank.rankList[i].medal = 2;
      } else if (i < copperIndex) {
        rank.rankList[i].medal = 3;
      } else {
        break;
      }
    }

    //缓存
    proxy.Buffer.ContestRank.rankData(rank.rankList, contest.CID);
    // console.log(this.rankList);
  },
  calculateOfOI(data: any[]) {
    console.log(data);
    //保存题目PID 最先AK的人
    let tempPioneerFlags = new Map<number, any>();
    //保存当前已有的题目防止出现题目被删除但是已有人提交而产生的问题。
    let tempNowContestProblems = new Array();
    for (let i in contest.Data) {
      tempPioneerFlags[contest.Data[i].PID] = {
        index: -1,
        Time: 0xfffffff,
      };
      tempNowContestProblems.push(contest.Data[i].PID);
    }

    for (let i in data) {
      //暂存当期处理的行的数据
      let listItem: listItemOfOItype = {
        Solved: 0,
        Score: 0,
        Problems: [],
        Uname: "",
        UserID: "",
        Uclass: "",
        AllTime: 0,
        ProblemsMap: new Map<string, ProblemsMapOfOIType>(),
        medal: 0,
      };
      listItem.Solved = data[i].AcNumber;
      listItem.Uname = data[i].Uname;
      listItem.UserID = data[i].UserID;
      listItem.Uclass = data[i].Uclass;
      //计算总罚时
      for (let j in data[i].Problems) {
        let problem = data[i].Problems[j];
        if (problem.PID == "") continue;
        if (problem.Score == 100) {
          //找出先锋（用时最短者）
          if (problem.Time < tempPioneerFlags[problem.PID]?.Time) {
            tempPioneerFlags[problem.PID] = {
              index: Number(i),
              Time: problem.Time,
            };
          }
        }
        let tempProblem: ProblemsMapOfOIType = {
          PID: problem.PID,
          Time: problem.Time,
          Score: problem.Score,
          Submited: problem.Submited,
          Pioneer: false,
        };
        listItem.ProblemsMap[problem.PID] = tempProblem;
        listItem.AllTime += problem.Time;
        listItem.Score += problem.Score;
      }
      //计算罚时
      rank.rankListOfOI.push(listItem);
    }
    //设置先锋
    for (let i in tempPioneerFlags) {
      if (tempPioneerFlags[i].index != -1) {
        rank.rankListOfOI[tempPioneerFlags[i].index].ProblemsMap[i].Pioneer = true;
      }
    }

    //排序
    rank.rankListOfOI.sort((a, b) => {
      if (a.Score < b.Score) return 1;
      else if (a.Score == b.Score) {
        if (a.AllTime < b.AllTime) return -1;
        else return 1;
      } else return -1;
    });

    //统计金银铜牌
    let goldIndex = Number((rank.rankListOfOI.length * 0.1).toFixed(0));
    let silverIndex = Number((rank.rankListOfOI.length * 0.3).toFixed(0));
    let copperIndex = Number((rank.rankListOfOI.length * 0.6).toFixed(0));
    goldIndex = goldIndex < 1 ? 1 : goldIndex;
    silverIndex = silverIndex < 2 ? 2 : silverIndex;
    copperIndex = copperIndex < 3 ? 3 : copperIndex;
    for (let i = 0; i < rank.rankList.length; i++) {
      if (i < goldIndex) {
        rank.rankListOfOI[i].medal = 1;
      } else if (i < silverIndex) {
        rank.rankListOfOI[i].medal = 2;
      } else if (i < copperIndex) {
        rank.rankListOfOI[i].medal = 3;
      } else {
        break;
      }
    }

    //缓存
    proxy.Buffer.ContestRank.rankData(rank.rankListOfOI, contest.CID);
    console.log(rank.rankListOfOI);
  },
});

function DownLoadRankList() {
  var blob;
  const workbook = utils.book_new()
  const sheetName = 'rank';
  var worksheet: WorkSheet;
  if (contest.Type == 1) {
    console.log(rank.rankList)
    // 创建数据
    var header = ["排名", "用户名", "班级", "AC数", "罚时"]
    for (var i in contest.Data) {
      header.push(proxy.Utils.TSBaseTools.numberToAlpha(Number(i) + 1))
    }
    var datas = [];
    console.log(header);
    console.log(datas)
    datas.push(header);
    for (var i in rank.rankList) {
      var user = rank.rankList[i];
      var data = [];
      data.push(Number(i) + 1);
      data.push(user.Uname + "(" + user.UserID + ")");
      data.push(user.Uclass);
      data.push(user.ACNumber);
      data.push(proxy.Utils.TimeTools.timestampToInterval(user.TimePenalty * 1000, 2));
      for (var j in contest.Data) {
        var problem: ProblemsMapOfACMType = user.ProblemsMap[contest.Data[j].PID];
        if (!problem) {
          data.push("");
          continue;
        }
        if (problem.Status == "AC") {
          data.push(problem.Status + "(" + problem.Time + ")")
          continue;
        }
        data.push("(" + problem.SubmitNumber + ")")
      }
      datas.push(data);
    }
    console.log(datas)
    worksheet = utils.aoa_to_sheet(datas)
    console.log(worksheet)
  }
  if (contest.Type == 2) {
    console.log(rank.rankListOfOI)
    // 创建数据
    var header = ["排名", "用户名", "班级", "总得分", "总用时"]
    for (var i in contest.Data) {
      header.push(proxy.Utils.TSBaseTools.numberToAlpha(Number(i) + 1))
    }
    var datas = [];
    datas.push(header);
    for (var i in rank.rankListOfOI) {
      var OIuser = rank.rankListOfOI[i];
      var data = [];
      data.push(Number(i) + 1);
      data.push(OIuser.Uname + "(" + OIuser.UserID + ")");
      data.push(OIuser.Uclass);
      data.push(OIuser.Score);
      data.push(OIuser.AllTime);
      for (var j in contest.Data) {
        var OIproblem: ProblemsMapOfOIType = OIuser.ProblemsMap[contest.Data[j].PID];
        if (!OIproblem) {
          data.push("");
          continue;
        }
        data.push(OIproblem.Score + "(" + OIproblem.Time + "ms)")
      }
      datas.push(data);
    }
    console.log(datas)
    worksheet = utils.aoa_to_sheet(datas)
    console.log(worksheet)
  }
  utils.book_append_sheet(workbook, worksheet, sheetName);
  const file = write(workbook, { bookType: 'xlsx', type: 'binary' });
  console.log(file);
  blob = new Blob([s2ab(file)], { type: 'application/octet-stream' });
  console.log(blob);
  downloadFile(contest.CID + ":" + contest.Title + "的排名.xlsx", blob)
}
function s2ab(s) {
  const buf = new ArrayBuffer(s.length);
  const view = new Uint8Array(buf);
  for (let i = 0; i !== s.length; ++i) {
    view[i] = s.charCodeAt(i) & 0xFF;
  };
  return buf;
}
function downloadFile(filename: string, blob: Blob) {
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}
//获取竞赛提交数据
async function getRankList() {
  if (!proxy.$route.params.CID) {
    proxy.elMessage({
      message: "跳转地址错误，请重试",
      type: "warning",
    });
    return;
  }
  let loading = proxy.elLoading({ node: proxy.$refs.ContestRank });
  let CID = proxy.$route.params.CID;
  let temp = pageBufferedDataStore.getContestRouterData(CID);
  let Pass = temp?.Pass;
  //验证比赛信息
  await getContest(CID, Pass);

  //从缓存拿数据
  let bufferedData: any = sessionStorage.getItem(
    "contestRankData" + contest.CID
  );
  if (bufferedData) {
    bufferedData = JSON.parse(bufferedData);
    //10秒内刷新会拿buffer中的数据
    if (
      bufferedData.CID == contest.CID &&
      Date.now() - bufferedData.saveTime < 10000
    ) {
      rank.rankList = bufferedData.data;
      loading.close();
      return;
    }
  }

  //请求数据
  proxy.$get("api/contest/" + CID + "/rank", { Pass }).then((res: any) => {
    proxy.$log(res.data);
    if (contest.Type == 1) {
      rank.calculateOfACM(res.data.Data);
    } else if (contest.Type == 2) {
      rank.calculateOfOI(res.data.Data);
    }
    loading.close();
  });
}

//比赛信息
type contestType = {
  Data: { PID: string; Title: string; ACNum: number; SubmitNum: number }[];
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
  //Data保存当前存在的题目
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
async function getContest(CID: number, Pass: string) {
  await proxy.$get("api/contest/" + CID, { Pass }).then((res: any) => {
    let data = res.data;
    if (data.code == 0) {
      // proxy.$log(data);
      contest.copy(data);
      ACM.value = contest.Type;
    } else if (data.code == 160504) {
      //密码错误
      proxy.$router.push({
        path: "/Contests",
      });
    } else if (data.code == 160503) {
      //未开始
      proxy.$router.push({
        path: "/Contests",
      });
    }
    proxy.codeProcessor(
      data?.code ?? 100001,
      data?.msg ?? "服务器错误\\\\error"
    );
  });
}

//获取背景色
function getBackgroundColor(item: ProblemsMapOfACMType | null) {
  if (item) {
    if (item.Pioneer)
      return "background-color:#2f9e44 !important; color: #eaeaea;";
    if (item.SubmitNumber > 0) {
      if (item.Status == "AC")
        return "background-color:#7ace27 !important; color: #FEFEFE;";
      else return "background-color:#FFD0D0 !important; color: #eaeaea;";
    }
  }
}
function getBackgroundColorOfOI(item: ProblemsMapOfOIType | null) {
  if (item) {
    if (item.Pioneer)
      return "background-color:#2f9e44 !important; color: #eaeaea;";
    if (item.Submited) {
      if (item.Score == 100)
        return "background-color:#E1FFB5 !important; color: #FEFEFE;";
      else return "background-color:#e74a23 !important; color: #eaeaea;";
    }
  }
}
//返回竞赛
function backToContest() {
  let params = {};
  if (proxy.$route.params.CID) {
    params["CID"] = proxy.$route.params.CID;
  } else {
    proxy.elMessage({
      message: "数据异常，请重新进入比赛界面",
      type: "warning",
    });
    return;
  }
  proxy.$router.push({
    name: "Contest",
    params,
  });
}

onMounted(() => {
  getRankList();
});
</script>
<style lang="scss" scoped>
.ContestRank {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  // padding: $contestRank_outerPaddingTop $contestRank_outerPaddingLeft;
  padding: 10px 10px 0 50px;
  display: flex;
  flex-direction: column;
  overflow-x: scroll;
  overflow-y: hidden;

  .contestID {
    font-size: $fontSize14;
    @include font_color("font2");
    display: flex;
    align-items: center;
    border-radius: 10px;
    width: fit-content;
    box-sizing: border-box;
    padding: 4px 16px;

    &:hover {
      @include fill_color("fill2");
    }

    >div {
      margin: 0 10px;
    }
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
      font-size: $fontSize4;
      @include font_color("font3");
      box-sizing: border-box;
      padding: 10px 40px;
    }

    .time {
      text-align: center;
      font-size: $fontSize4;
      @include font_color("font2");
      padding: 0 40px 20px 40px;
      letter-spacing: 2px;
    }
  }

  .header {
    display: flex;
    align-items: center;
    height: $contestRank_headerHeight;
    font-size: $fontSize5;
    width: 100%;
    @include font_color("font1");

    >div {
      box-sizing: border-box;
      height: 100%;
      line-height: $contestRank_headerHeight;
      text-align: center;
      border-top: 1px solid;
      // border-right: 1px solid;
      border-bottom: 1px solid;
      border-left: 1px solid;
    // border-right: 1px solid;
      @include fill_color("fill14");
      // @include border_color("border1");
      flex-shrink: 0;
      border-color: black;
      border-width: 2px;

      &:last-child {
        border-right: none;
        border-start-end-radius: 0px;
      }

      &:first-child {
        border-start-start-radius: 0px;
      }
    }
  }

  .item {
    position: relative;
    height: $contestRank_itemHeight;
    display: flex;
    align-items: center;
    font-size: $fontSize3;
    border-left: 1px solid;
    // border-right: 1px solid;
    border-width: 2px;
    // @include font_color("font2");

    &:last-child {
      >div {
        &:first-child {
          border-end-start-radius: 0px;
        }

        &:last-child {
          border-end-end-radius: 0px;
        }
      }
    }

    .medalIcon {
      position: absolute;
      top: 2px;
      left: -40px;

      svg {
        filter: drop-shadow(0 0 1px #96969688);
      }
    }

    >div {
      height: $contestRank_itemHeight;
      line-height: $contestRank_itemHeight;
      box-sizing: border-box;
      padding: 0 5px;
      text-align: center;
      border-right: 1px solid;
      border-bottom: 1px solid;
      flex-shrink: 0;
      @include fill_color("fill4");
      @include border_color("border0");
      border-color: black;
      border-width: 2px;

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
        color: black;

        &:first-child {
          font-size: $fontSize3;
        }

        &:last-child {
          font-size: $fontSize3;
        }
      }
    }
  }
}
</style>