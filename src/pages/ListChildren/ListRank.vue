<template>
  <div class="ContestRank" ref="ContestRank">
    <div class="contestID cursor_pointer" @click="backToList()">
      <el-icon size="32px">
        <Back />
      </el-icon>
      <div>
        {{ list.LID }}
      </div>
    </div>
    <div class="contestInfo">
      <div class="title">
        {{ list.Title }}
      </div>
      <div class="content">{{ list.Description }}</div>
    </div>
    <el-button style="margin: auto;" v-on:click="DownLoadRankList()">下载题单排名</el-button>
    <br />
    <div class="header">
      <div style="width:70px">排名</div>
      <div style="width:360px">用户</div>
      <div style="width:70px">班级</div>
      <div style="width:90px">AC数</div>
      <div v-for="(item, index) in list.Data" :key="index" style="width:140px">
        {{ proxy.Utils.TSBaseTools.numberToAlpha(index + 1) + "(" + item.Solved + ")" }}
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

      <div style="width:360px;text-align: start;">{{ item.Uname }}({{ item.UID }})</div>
      <div style="width:70px;">{{ item.Uclass }}</div>
      <div style="width:90px">{{ item.Solved }}</div>
      <!-- <div style="width:140px">{{proxy.Utils.TimeTools.timestampToInterval(item.TimePenalty*1000,2)}}</div> -->
      <div class="problemStatus" v-for="(p, index) in list.Data" :key="index"
        :style="'width:140px;' + getBackgroundColor(item.ProblemsMap[p.PID])">
        <div v-if="item.ProblemsMap[p.PID] && item.ProblemsMap[p.PID].Status == 'AC'">
          {{ item.ProblemsMap[p.PID].Status }}
        </div>
        <div
          v-if="(item.ProblemsMap[p.PID] && (item.ProblemsMap[p.PID].SubmitNumber > 1))
            || (item.ProblemsMap[p.PID] && (item.ProblemsMap[p.PID].SubmitNumber >= 1) && (item.ProblemsMap[p.PID].Status != 'AC'))">
          {{ item.ProblemsMap[p.PID].Status }}
          (-{{ item.ProblemsMap[p.PID].Status == 'AC' ? item.ProblemsMap[p.PID].SubmitNumber - 1 :
            item.ProblemsMap[p.PID].SubmitNumber }})
        </div>
      </div>
    </div>
  </div>
</template>

<script  lang="ts" setup>
import { getCurrentInstance, onMounted, reactive } from "vue";
import { usePageBufferedDataStore } from "../../pinia/pageBufferdData";
import { write, utils, WorkSheet } from "xlsx";
const { proxy } = getCurrentInstance() as any;
const pageBufferedDataStore = usePageBufferedDataStore();

type ProblemsMapType = {
  PID?: number;
  Time?: number;
  SubmitNumber: number;
  Status: string;
  Pioneer: boolean;
};
type listItemType = {
  UID: string;
  Uname: string;
  Uclass: string;
  Solved: number;
  Problems: {
    PID: number;
    Time: number;
    SubmitNumber: number;
    Status: string;
  }[];
  TimePenalty: number;
  ProblemsMap?: Map<number, ProblemsMapType>;
  medal?: number;
};

var rank = reactive<{
  rankList: listItemType[];
  [item: string]: any;
}>({
  rankList: [],
  calculate(data: listItemType[]) {
    //保存题目PID 最先AC的人
    let tempPioneerFlags = new Map<number, any>();
    //保存当前已有的题目防止出现题目被删除但是已有人提交而产生的问题。
    let tempNowContestProblems = new Array();
    for (let i in list.Data) {
      tempPioneerFlags[list.Data[i].PID] = {
        index: -1,
        Time: 0xfffffffffffffff,
      };
      tempNowContestProblems.push(list.Data[i].PID);
    }
    //遍历并封装数据
    for (let i in data) {
      var user = data[i];
      //暂存当期处理的行的数据
      let listItem: listItemType = {
        TimePenalty: 0,
        Solved: 0,
        Problems: [],
        Uname: "",
        UID: "",
        Uclass: "",
        ProblemsMap: new Map<number, ProblemsMapType>(),
        medal: 0,
      };
      listItem.UID = data[i].UID;
      listItem.Uname = data[i].Uname;
      listItem.Uclass = user.Uclass;
      listItem.Solved = user.Solved;
      for (let j in user.Problems) {
        let problem = user.Problems[j];
        if (problem.PID == 0) continue;
        if (problem.Status == "AC") {
          listItem.TimePenalty += problem.Time;
          for (let k in list.Data) {
            if (problem.PID == list.Data[k].PID) {
              list.Data[k].Solved++;
            }
          }
          //找出先锋（最先ac者）
          if (problem.Time < tempPioneerFlags[problem.PID]?.Time) {
            tempPioneerFlags[problem.PID] = {
              index: Number(i),
              Time: problem.Time,
            };
          }
        }
        let tempProblem: ProblemsMapType = {
          Time: problem.Time,
          SubmitNumber: problem.SubmitNumber,
          Status: problem.Status,
          Pioneer: false,
        };
        listItem.ProblemsMap[problem.PID] = tempProblem;
      }
      rank.rankList.push(listItem);
    }
    //设置先锋
    for (let i in tempPioneerFlags) {
      if (tempPioneerFlags[i].index != -1) {
        rank.rankList[tempPioneerFlags[i].index].ProblemsMap[i].Pioneer = true;
        console.log("pooner")
      }
    }

    //排序
    rank.rankList.sort((a, b) => {
      if (a.Solved < b.Solved) return 1;
      else if (a.Solved == b.Solved) {
        return a.TimePenalty < b.TimePenalty ? 1 : -1;
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
    proxy.Buffer.ContestRank.rankData(rank.rankList, list.LID);
    // console.log(this.rankList);
  },
});


function DownLoadRankList() {
  var blob;
  const workbook = utils.book_new()
  const sheetName = 'rank';
  var worksheet: WorkSheet;
  console.log(rank.rankList)
  // 创建数据
  var header = ["排名", "用户", "班级", "AC数"]
  for (var i in list.Data) {
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
    data.push(user.Uname + "(" + user.UID + ")");
    data.push(user.Uclass);
    data.push(user.Solved);
    // data.push(proxy.Utils.TimeTools.timestampToInterval(user.TimePenalty * 1000, 2));
    for (var j in list.Data) {
      var problem: ProblemsMapType = user.ProblemsMap[list.Data[j].PID];
      if (!problem) {
        data.push("");
        continue;
      }
      if (problem.Status == "AC") {
        // data.push(problem.Status + "(" + problem.Time + ")")
        data.push(problem.Status)
        continue;
      }
      data.push("(" + problem.SubmitNumber + ")")
    }
    datas.push(data);
  }
  console.log(datas)
  worksheet = utils.aoa_to_sheet(datas)
  console.log(worksheet)
  utils.book_append_sheet(workbook, worksheet, sheetName);
  const file = write(workbook, { bookType: 'xlsx', type: 'binary' });
  console.log(file);
  blob = new Blob([s2ab(file)], { type: 'application/octet-stream' });
  console.log(blob);
  // downloadFile(UID + ":" + Uname + "的排名.xlsx", blob)
  downloadFile(list.LID + ":" + list.Title + "的排名.xlsx", blob)
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
  if (!proxy.$route.params.LID) {
    proxy.elMessage({
      message: "跳转地址错误，请重试",
      type: "warning",
    });
    return;
  }
  let loading = proxy.elLoading({ node: proxy.$refs.ListRank });
  let LID = proxy.$route.params.LID;
  //验证题单信息
  await getList(LID);

  //从缓存拿数据
  let bufferedData: any = sessionStorage.getItem(
    "listRankData" + list.LID
  );
  if (bufferedData) {
    bufferedData = JSON.parse(bufferedData);
    //10秒内刷新会拿buffer中的数据
    if (
      bufferedData.LID == list.LID &&
      Date.now() - bufferedData.saveTime < 10000
    ) {
      rank.rankList = bufferedData.data;
      loading.close();
      return;
    }
  }

  //请求数据
  proxy.$get("api/training/" + LID + "/rank").then((res: any) => {
    proxy.$log(res.data);
    rank.calculate(res.data.Data);
    loading.close();
  });
}

//题单信息
type ListType = {
  LID: number;
  UID: string;
  Title: string;
  Description: string;
  BeginTime: number;
  Data: { PID: number; Title: string; Solved: number; }[];
  [item: string]: any;
};

var list = reactive<ListType>({
  //Data保存当前存在的题目
  LID: 0,
  UID: "",
  Title: "",
  Description: "",
  BeginTime: 0,
  Data: [],
  copy(data: any) {
    let tempProblemSequence = data.Problems.split(",");
    for (let temp in tempProblemSequence) {
      for (let p in data.Data) {
        if (tempProblemSequence[temp] == data.Data[p].PID) {
          list.Data.push({
            PID: data.Data[p].PID,
            Title: data.Data[p].Title,
            Solved: 0,
          });
          break;
        }
      }
    }
    list.LID = data.LID;
    list.UID = data.UID;
    list.Title = data.Title;
    list.Description = data.Description;
    list.BeginTime = data.StartTime;
  },
});

//获取竞赛信息
async function getList(LID: number) {
  await proxy.$get("/api/training/" + LID).then((res: any) => {
    let data = res.data;
    if (data.code == 0) {
      list.copy(data);
    }
    proxy.codeProcessor(
      data?.code ?? 100001,
      data?.msg ?? "服务器错误\\\\error"
    );
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
      if (item.Status == "CE")
        return "background-color:gray !important; color: #FEFEFE;"
      return "background-color:#e74a23 !important; color: #eaeaea;";
    }
  }
}

//返回竞赛
function backToList() {
  let params = {};
  if (proxy.$route.params.LID) {
    params["LID"] = proxy.$route.params.LID;
  } else {
    proxy.elMessage({
      message: "数据异常，请重新进入比赛界面",
      type: "warning",
    });
    return;
  }
  proxy.$router.push({
    name: "List",
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
  box-sizing: border-box;
  padding: $contestRank_outerPaddingTop $contestRank_outerPaddingLeft;
  display: flex;
  flex-direction: column;
  overflow-x: scroll;
  overflow-y: hidden;

  .contestID {
    font-size: $fontSize14;
    @include font_color("font5");
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
    height: $contestRank_headerHeight;
    font-size: $fontSize7;
    width: 100%;
    @include font_color("font1");

    >div {
      box-sizing: border-box;
      height: 100%;
      line-height: $contestRank_headerHeight;
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
    position: relative;
    height: $contestRank_itemHeight;
    display: flex;
    align-items: center;
    font-size: $fontSize6;
    @include font_color("font2");

    &:last-child {
      >div {
        &:first-child {
          border-end-start-radius: 10px;
        }

        &:last-child {
          border-end-end-radius: 10px;
        }
      }
    }

    .medalIcon {
      position: absolute;
      top: 8px;
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
          font-size: $fontSize5;
        }

        &:last-child {
          font-size: $fontSize4;
        }
      }
    }
  }
}
</style>