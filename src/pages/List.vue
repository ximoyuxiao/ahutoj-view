<template>
    <div class="contest">
        <div
          class="notFound"
          v-show="notFound"
        >
          <el-empty description="肥肠抱歉，木有找到该题单，返回重试吧。" />
        </div>
        <template v-if="!notFound">
          <div
            class="infoBox"
            ref="infoBox"
          >
            <div class="title">{{ list.Title }}</div>
            <div class="text">创建者：{{ list.UID }}</div>
            <div class="text">开始时间：{{proxy.Utils.TimeTools.timestampToTime(list.StartTime) }}</div>
            <template v-if="addlist">
              <div class="addList">
                <div class="functionBox">
                  <div
                  class="contestRank cursor_pointer"
                  v-on:click="RegisterTrain()"
                  >
                  加入题单
                </div>
              </div>
            </div>
            
          </template>
          <template v-else>
            <div class="text">已解决:{{ userListInfo.solved }}/{{list.Data.length }}</div>
            <div class="process">  
              <el-progress
                :show-text="false"
                :stroke-width="20"
                :percentage="100 * userListInfo.solved / list.Data.length"
              />
            </div>
          </template>
          </div>
            <div
            class="problemList"
            ref="problemList"
          >
            <div class="functionBox">
              <div
                class="contestRank cursor_pointer"
                v-on:click="goToRank()"
                >
                查看排名
              </div>
              </div>
            <div class="nav">
              <div style="width: 90px">序号</div>
              <div style="width: calc(100% - 190px)">题目</div>
              <div style="width: 100px">通过情况</div>
            </div>
            <div
              class="item"
              v-for="(item, index) in list.Data"
              :key="index"
            >
              <div
                class="flag cursor_pointer"
                v-on:click="goToProblem(item.PID)"
              >
                {{ proxy.Utils.TSBaseTools.numberToAlpha(index + 1) }}
              </div>
              <div
                class="title cursor_pointer"
                v-on:click="goToProblem(item.PID)"
              >
                {{ item.Title }}
              </div>
              <div class="status">
                <el-progress
                  type="circle"
                  :width="22"
                  :stroke-width="3"
                  :percentage="checkSolved(item.PID)?100:0" 
                  :show-text="false"
                  style="margin: 0 10px"
                  color="#5E8D00"
                />
              </div>
            </div>
          </div>
        </template>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { onMounted, getCurrentInstance, reactive, ref, onUnmounted } from "vue";
  import {useUserDataStore} from "../pinia/userData"
  const { proxy } = getCurrentInstance() as any;
  // const pageBufferedDataStore = usePageBufferedDataStore();
  const userDataStore = useUserDataStore();
  var notFound = ref(true); //未找到
  var addlist  = ref(true);
  //加载
  var loading = reactive({
    contestInfo: null,
    problemList: null,
    init() {
      if (this.contestInfo) {
        this.contestInfo.close();
      }
      if (this.problemList) {
        this.problemList.close();
      }
      this.contestInfo = null;
      this.problemList = null;
    },
  });
  
  //比赛信息
  type ListType = {
    LID:number
    Data: { PID: string; Title: string;Sort:number;Aceept:boolean }[];
    UID:string;
    Title: string;
    StartTime: number;
    Problems:string;
    [item: string]: any;
  };

  var list = reactive<ListType>({
    LID:null,
    Data:[],
    UID:"",
    Title: "",
    StartTime:null,
    Problems:"",
    copy(data: any) {
        data.Data.forEach(element => {
            list.Data.push({
              Sort:element.Sort,
              PID:element.PID,
              Title: element.Ptitle,
              Aceept:false,
            });
        });{
          }
      list.LID = data.LID;
      list.UID = data.UID;
      list.Title = data.Title;
      list.StartTime = data.StartTime;
      list.Problems = data.Problems;
    },
  });
  
  function checkSolved(PID:string){

    for(let item in userListInfo.SolvedPID){
      let SolvePID = userListInfo.SolvedPID[item]
      if(SolvePID == PID){
        return true;
      }
    }
    return false;
  }
  async function init() {
    //检查路由参数完整性
    let LID = proxy.$route.params.LID;
    list.LID = LID; //暂存一份在contest数据中
    if (!LID) {
      proxy.elMessage({
        message: "页面跳转异常，请重试。",
        type: "error",
      });
      return;
    }
      getListUserInfo(LID);
      getListById(LID);
      
  }

  type ListUserType = {
    LID:number;
    UID:string;
    solved:number;
    submited:number;
    SolvedPID:string[];
    [item: string]: any;
  };

  var userListInfo = reactive<ListUserType>({
    LID:0,
    UID:"",
    solved:0,
    submited:0,
    SolvedPID:[],
    copy(data: any)  {
      userListInfo.LID = list.LID;
      userListInfo.UID = userDataStore.UID;
      userListInfo.solved = data.Solved;
      userListInfo.submited = data.Submited;
      userListInfo.SolvedPID = data.SolvedPID;
    }
  });
  
  async function getListUserInfo(LID:number) {
    addlist.value = true;
    if(userDataStore.UID == ""){
      return ;
    }
    // 获取该题单的本用户信息
    await proxy.$get("api/training/user?LID=" + LID).then((res: any) => {
      let data = res.data;
      // proxy.$log(res);
      if (data.code == 0) {
        addlist.value = false;
        userListInfo.copy(data);
      }
      proxy.codeProcessor(
        data?.code ?? 100001,
        data?.msg ?? "服务器错误\\\\error"
      );
    });
  }

  //获取竞赛信息
  async function getListById(LID: number) {
    notFound.value = true;
    loading.init();
    loading.contestInfo = proxy.elLoading({
      node: proxy.$refs.infoBox,
    });
    loading.problemList = proxy.elLoading({
      node: proxy.$refs.problemList,
    });
  
    await proxy.$get("api/training/" + LID).then((res: any) => {
      let data = res.data;
      // proxy.$log(res);
      if (data.code == 0) {
        list.copy(data);
        notFound.value = false;
      } 
      proxy.codeProcessor(
        data?.code ?? 100001,
        data?.msg ?? "服务器错误\\\\error"
      );
    });
    loading.init();
  }
  
  function RegisterTrain(){
    if(userDataStore.UID == ""){
      proxy.codeProcessor(
        100001,
        "用户未登录，请先登录\\\\error"
      );
      return
    }
    proxy.$post("/api/training/user/",{
      UID: userDataStore.UID,
      LID:list.LID,
    }).then((res:any) =>{
      let data = res.data;
      if(data.code == 0){
        addlist.value = false;
      }
      proxy.codeProcessor(
        data?.code ?? 100001,
        data?.msg ?? "服务器错误\\\\error"
      );
    });
  }
  //跳转到题目
  function goToProblem(PID: string): void {
    proxy.$router.push({
      name: "Problem",
      params: {
        PID,
      },
    });
  }
  
  //跳转到当前比赛排名列表
  function goToRank(): void {
    let LID = list.LID;
    proxy.$router.push({
      name: "ListRank",
      params: {
        LID,
      },
    });
  }
  
//   //跳转到当前比赛的状态
//   function goToStatus(): void {
//     let CID = contest.CID;
//     let Pass: string;
//     if (proxy.$route.params.Pass) Pass = proxy.$route.params.Pass;
//     proxy.$router.push({
//       path: "/ContestStatus",
//       query: {
//         CID,
//         Pass,
//       },
//     });
//   }
  
  onMounted(() => {
    init();
  });
  </script>
  
  <style scoped lang="scss">
  .contest {
    position: relative;
    width: 100%;
    box-sizing: border-box;
    padding: $contest_outerPaddingTop $contest_outerPaddingLeft;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  
    .infoBox {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      box-sizing: border-box;
      padding: 30px;
      border-radius: 10px;
      @include fill_color("fill2");
  
      .title {
        font-size: $fontSize9;
        @include font_color("font1");
        margin: 20px 0;
      }
  
      .text {
        font-size: $fontSize4;
        @include font_color("font2");
      }
  
      .status {
        margin-top: 20px;
        font-size: $fontSize4;
        @include font_color("font2");
        display: flex;
        align-items: center;
  
        .point {
          border-radius: 50%;
          width: 8px;
          height: 8px;
          margin-right: 8px;
        }
      }
  
      .time {
        margin: 30px 0 15px 0;
        width: 100%;
        font-size: $fontSize4;
        @include font_color("font1");
        display: flex;
        justify-content: space-between;
  
        .left_time {
          font-size: $fontSize7;
          @include font_color("font1");
        }
      }
  
      .process {
        width: 100%;
        border-radius: 50%;
      }
    }
  
    .problemList {
      margin-top: $modelDistance;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      box-sizing: border-box;
      padding: 30px;
      border-radius: 10px;
      @include fill_color("fill2");      
      .functionBox {
        width: 100%;
        display: flex;
        align-items: center;
        box-sizing: border-box;
        border-radius: 10px;
        @include fill_color("fill2");
        padding-bottom: 30px;
  
        > div {
          margin: 0 10px;
          width: 140px;
          line-height: 32px;
          @include font_color("font2");
          font-size: $fontSize6;
          @include fill_color("fill4");
          @include box_shadow(0, 0, 2px, 1px, "border1");
          border-radius: 10px;
          text-align: center;
  
          &:hover {
            @include font_color("font1");
            @include fill_color("fill13");
            @include box_shadow(0, 0, 2px, 1px, "fill11");
          }
        }
      }
  
      .nav {
        width: 100%;
        display: flex;
        margin-bottom: 15px;
  
        > div {
          font-size: $fontSize6;
          @include font_color("font1");
        }
      }
  
      .item {
        box-sizing: border-box;
        padding: 15px 10px;
        width: 100%;
        display: flex;
        align-items: center;
        border-bottom: 1px solid;
        @include border_color("border1");
        @include fill_color("fill4");
        box-sizing: border-box;
        transition: all 300ms;
  
        &:hover {
          border-left: 8px solid;
          border-right: 8px solid;
          @include border_color("fill51");
        }
  
        &:last-child {
          border-bottom: none;
        }
  
        .flag {
          width: 80px;
          font-size: $fontSize6;
          @include font_color("fill11");
        }
  
        .title {
          width: calc(100% - 170px);
          font-size: $fontSize7;
          @include font_color("fill11");
        }
  
        .status {
          width: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: $fontSize4;
          @include font_color("font3");
        }
      }
    }
    
    .addList {
      margin-top: $modelDistance;
      display: flex;
      flex-direction: column;
      align-items: center;
      box-sizing: border-box;
      padding: 30px;
      border-radius: 10px;
      @include fill_color("fill2");      
      .functionBox {
        width: 100%;
        display: flex;
        align-items: center;
        box-sizing: border-box;
        border-radius: 10px;
        @include fill_color("fill2");
        padding-bottom: 30px;
  
        > div {
          margin: 0 10px;
          width: 140px;
          line-height: 32px;
          @include font_color("font2");
          font-size: $fontSize6;
          @include fill_color("fill4");
          @include box_shadow(0, 0, 2px, 1px, "border1");
          border-radius: 10px;
          text-align: center;
  
          &:hover {
            @include font_color("font1");
            @include fill_color("fill13");
            @include box_shadow(0, 0, 2px, 1px, "fill11");
          }
        }
      }
  
      .nav {
        width: 100%;
        display: flex;
        margin-bottom: 15px;
  
        > div {
          font-size: $fontSize6;
          @include font_color("font1");
        }
      }
  
      .item {
        box-sizing: border-box;
        padding: 15px 10px;
        width: 100%;
        display: flex;
        align-items: center;
        border-bottom: 1px solid;
        @include border_color("border1");
        @include fill_color("fill4");
        box-sizing: border-box;
        transition: all 300ms;
  
        &:hover {
          border-left: 8px solid;
          border-right: 8px solid;
          @include border_color("fill51");
        }
  
        &:last-child {
          border-bottom: none;
        }
  
        .flag {
          width: 80px;
          font-size: $fontSize6;
          @include font_color("fill11");
        }
  
        .title {
          width: calc(100% - 170px);
          font-size: $fontSize7;
          @include font_color("fill11");
        }
  
        .status {
          width: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: $fontSize4;
          @include font_color("font3");
        }
      }
    }

    .needPass {
      top: calc(50vh - 200px);
      position: absolute;
      width: 400px;
      @include fill_color("fill2");
      border-radius: 14px;
      display: flex;
      flex-direction: column;
      align-items: center;
      @include font_color("font1");
      @include box_shadow(0, 0, 3px, 1px, "border1");
      box-sizing: border-box;
      padding: 16px;
  
      > .title {
        font-size: $fontSize8;
      }
  
      > .input {
        display: flex;
        align-items: center;
        margin: 20px 0;
  
        > .label {
          width: 100px;
          font-size: $fontSize6;
          padding: 0 10px;
          text-align: right;
        }
      }
    }
  }
  
  .notFound {
    width: 100%;
    height: 400px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .btn {
    position: relative;
    overflow: hidden;
    margin: 8px 0;
    width: 220px;
    height: 40px;
    border-radius: 15px;
    font-size: $fontSize5;
    @include font_color("font1");
    letter-spacing: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    @include box_shadow(0, 0, 2px, 1px, "border2");
    transition-duration: 200ms;
  
    &:hover {
      @include box_shadow(0, 0, 2px, 1px, "fill12");
      @include fill_color("fill15");
    }
  }
  </style>