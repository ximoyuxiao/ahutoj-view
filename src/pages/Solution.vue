<template>
  <div class="solution">
    <div class="left">
      <div
        class="notFound"
        v-show="notFound"
      >
        <el-empty description="该题还木有题解。" />
      </div>
      <template v-if="solutions.data.length > 0 ">
        <div class="topBox">
          <div class="count">共发现&nbsp;{{config.Count}}&nbsp;个题解</div>
        </div>
        <div
          class="item"
          v-for="(item, index) in solutions.data"
        >
          <div class="userInfo">
            <div class="headImg">
              <img :src="item.HeadURL ? (staticSourceBaseURL + item.HeadURL) : proxy.Utils.DefaultHeadImage.show(item.UID)" />
            </div>
            <div class="info">
              <div class="userName">
                {{item.UserName}}
              </div>
              <div class="updateTime">
                最后更新时间：{{ proxy.Utils.TimeTools.timestampToTime(item.UpdateTime) }}
              </div>
            </div>
          </div>
          <div :class=" (item?.Fold ?? true) ? 'contentFold' : 'content'">
            <md-editor
              class="mdEditor"
              v-model="item.Content"
              :theme="themeSwitchStore.theme > 0 ? 'light' : 'dark'"
              preview-only
            />
            <div
              class="foldCover"
              v-show="item?.Fold ?? true"
            >123</div>
          </div>
          <div class="status">
            <div class="left">
              <div class="thumbsUp">
                <el-icon
                  class="iconThumbsUp cursor_pointer"
                  size="20px"
                  @click="solutions.thumbUp(index, item.SLTID,-1)"
                  v-if="item.IThumbsUp == 1"
                >
                  <StarFilled />
                </el-icon>
                <el-icon
                  class="icon cursor_pointer"
                  size="20px"
                  @click="solutions.thumbUp(index,item.SLTID,1)"
                  v-else
                >
                  <Star />
                </el-icon>
                &nbsp;{{item.ThumbsUp}}&nbsp;个人觉得很赞
              </div>
              <div class="conmment cursor_pointer">
                <el-icon
                  class="icon cursor_pointer"
                  size="20px"
                >
                  <ChatLineSquare />
                </el-icon>
                &nbsp;{{item.CommentCount}}&nbsp;条评论
              </div>
            </div>
            <div class="right cursor_pointer">
              收起&nbsp;
              <el-icon size="26px">
                <ArrowUp />
              </el-icon>
            </div>
          </div>
        </div>
        <div
          class="pagination"
          v-if="config.Count > 5"
        >
          <el-pagination
            background
            layout="prev, pager, next"
            :page-size="config.Limit"
            :total="config.Count"
            :current-page="config.currentPage"
            @current-change="config.changePage"
          />
          <el-radio-group
            v-model="config.Limit"
            @change="config.changePage(1)"
            style="margin: 0 20px"
          >
            <el-radio-button :label="5" />
            <el-radio-button :label="10" />
            <el-radio-button :label="15" />
          </el-radio-group>
        </div>
      </template>

    </div>
    <div class="right">
      <div class="hint">
        <div class="title">
          题解仅供学习参考使用！
        </div>
        <div class="text">
          抄袭、复制题解，以达到刷 AC 率/AC 数量或其他目的的行为，在本平台是严格禁止的。
        </div>
        <div class="text">
          平台非常重视学术诚信。此类行为将会导致您的账号被<strong>封禁</strong>。
        </div>
      </div>
    </div>
  </div>
</template>

<script lang='ts' setup>
import { getCurrentInstance, onMounted, reactive, ref } from "vue";
import { useThemeSwitchStore } from "../pinia/themeSwitch";
import MdEditor from "md-editor-v3";
import "md-editor-v3/lib/style.css";
import { staticSourceBaseURL } from "../utils/axios/axios";
import { useUserDataStore } from "../pinia/userData";
const userDataStore = useUserDataStore();

const themeSwitchStore = useThemeSwitchStore();

const { proxy } = getCurrentInstance() as any;

var notFound = ref(true); //未找到

var config = reactive({
  currentPage: 1,
  Page: 1,
  Limit: 10,
  Count: 0,
  changePage: (page: number): void => {
    config.currentPage = page;
    SyncUrl();
    solutions.getSolutions(solutions.PID);
  },
});

//solution相关数据
var solutions = reactive({
  PID: "",
  data: [],
  getSolutions: (PID: string) => {
    notFound.value = true;
    let UID = userDataStore.isLogin ? userDataStore.UID : null;
    proxy
      .$get(
        "forum/solution/list/pid/" + PID,
        { UID, Page: config.currentPage - 1, Limit: config.Limit },
        0,
        2
      )
      .then((res: any) => {
        let data = res.data;
        if (data?.code == 0) {
          solutions.data = data.data;
          config.Count = data.Count;
          //初始状态为折叠
          for (let item of solutions.data) {
            item["Fold"] = true;
          }
          notFound.value = solutions.data.length == 0 ? true : false;
        }
        proxy.codeProcessor(
          data?.code ?? 100001,
          data?.msg ?? "服务器错误\\\\error"
        );
      });
  },
  //点赞
  thumbUp: (index: number, SLTID: number, State: number) => {
    if (!userDataStore.isLogin || !userDataStore.UID) {
      proxy.elMessage({ message: "您还未登录", type: "warning" });
      return;
    }
    let UID = userDataStore.UID;
    proxy
      .$post("forum/solution/thumbup/" + SLTID, { UID, State }, 0, 2)
      .then((res: any) => {
        let data = res.data;
        if (data?.code == 0) {
          let result = data.data;
          solutions.data[index].IThumbsUp = result; //更新点赞状态
          solutions.data[index].ThumbsUp += result; //更新点赞数
          proxy.elNotification({
            message: result == 1 ? "成功点赞" : "取消点赞",
            type: "success",
          });
        }
        proxy.codeProcessor(
          data?.code ?? 100001,
          data?.msg ?? "服务器错误\\\\error"
        );
      });
  },
});

function SyncUrl() {
  //仅用于展示实时url，可用于复制跳转
  proxy.$router.replace({
    path: "/Solution",
    query: {
      PID: solutions.PID,
      Page: config.currentPage,
      Limit: config.Limit,
    },
  });
}

onMounted(() => {
  let PID = proxy.$route.query.PID;
  solutions.PID = PID;
  solutions.getSolutions(PID);
});
</script>

<style lang='scss' scoped>
.solution {
  width: 100%;
  box-sizing: border-box;
  padding: $solution_outerPaddingTop $solution_outerPaddingLeft;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  > .left {
    width: calc(100% - $solution_rightWidth - $modelDistance);
    @include fill_color("fill2");
    border-radius: 10px;

    > .topBox {
      display: flex;
      box-sizing: border-box;
      padding: 10px;
      border-bottom: 1px solid;
      @include border_color("border1");

      > .count {
        font-size: $fontSize6;
        font-weight: 600;
        @include font_color("font1");
      }
    }

    > .item {
      width: 100%;
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
      padding: 10px 0;
      border-bottom: 1px solid;
      @include border_color("border1");

      &:last-child {
        border: none;
      }

      > .userInfo {
        display: flex;
        align-items: center;

        > .headImg {
          position: relative;
          margin: 15px;
          height: 46px;
          width: 46px;
          border-radius: 8px;
          @include box_shadow(0, 0, 2px, 1px, "font2");
          overflow: hidden;

          > img {
            width: 100%;
            height: 100%;
          }
        }

        > .info {
          display: flex;
          flex-direction: column;
          align-items: flex-start;

          > .userName {
            font-size: $fontSize6;
            @include font_color("font1");
          }

          > .updateTime {
            font-size: $fontSize4;
            @include font_color("font3");
          }
        }
      }

      > .content,
      > .contentFold {
        position: relative;
        box-sizing: border-box;
        padding: 16px;

        > .mdEditor {
          box-sizing: border-box;
          padding: 14px;
        }
      }

      > .contentFold {
        height: 220px;
        max-height: 220px;
        overflow: hidden;

        > .foldCover {
          position: absolute;
          top: 14px;
          bottom: 0;
          left: 14px;
          right: 14px;
          box-sizing: border-box;
          padding: 14px;
          @include linear_gradient(to top, "fill13", "fill15");
          opacity: 0.7;
        }
      }

      > .status {
        width: 100%;
        display: flex;
        justify-content: space-between;
        box-sizing: border-box;
        padding: 10px 20px;
        @include font_color("font1");

        > .left {
          display: flex;
          flex-direction: column;

          > div {
            display: flex;
            align-items: center;
            margin: 4px 0;

            &:hover {
              font-weight: 600;
              @include font_color("fill11");
            }

            > .iconThumbsUp {
              @include font_color("fill11");
              transform: scale(1.4);
            }
          }
        }

        > .right {
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: $fontSize6;
        }
      }
    }

    > .pagination {
      margin: 25px 0;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      justify-items: center;
    }
  }

  > .right {
    width: $solution_rightWidth;
    display: flex;
    flex-direction: column;

    > .hint {
      @include fill_color("fill2");
      @include font_color("font1");
      width: inherit;
      border-radius: 10px;
      box-sizing: border-box;
      padding: 10px;

      > .title {
        font-size: $fontSize6;
        @include font_color("fill41");
      }

      > .text {
        font-size: $fontSize4;
        padding: 8px 4px;
      }
    }
  }
}
</style>