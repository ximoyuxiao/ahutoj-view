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
          :class="item.IThumbsUp == 1 ? 'item itemThumbsUp' : 'item'"
          v-for="(item, index) in solutions.data"
        >
          <div class="userInfo">
            <div class="headImg">
              <img :src="item.HeadURL ? (staticSourceBaseURL + item.HeadURL) : proxy.Utils.DefaultHeadImage.show(item.UID)" />
            </div>
            <div class="info">
              <div class="userName">
                {{item.UID}}
              </div>
              <div class="updateTime">
                最后更新时间：{{ proxy.Utils.TimeTools.timestampToTime(item.UpdateTime) }}
              </div>
              <div class="updateTime">
                创建时间:{{ proxy.Utils.TimeTools.timestampToTime(item.CreateTime) }}
              </div>
            </div>
          </div>
          <div :class=" (item?.Fold ?? true) ? 'contentFold' : 'content'">
            <h3>{{item.Title}}</h3>
            <md-editor
              class="mdEditor"
              v-model="item.Text"
              :theme="themeSwitchStore.theme > 0 ? 'light' : 'dark'"
              preview-only
            />
            <div
              class="foldCover"
              v-show="(item?.Fold ?? true) && item.CanFold"
            >
              <div @click="solutions.fold(index, false)">
                展开
                &nbsp;
                <el-icon size="26px">
                  <ArrowDown />
                </el-icon>
              </div>
            </div>

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
              <div
                class="conmment cursor_pointer"
                @click="solutions.openComment(index)"
              >
                <el-icon
                  class="icon cursor_pointer"
                  size="20px"
                >
                  <ChatLineSquare />
                </el-icon>
                &nbsp;{{item.CommentCount}}&nbsp;条评论
              </div>
            </div>
            <div
              class="right cursor_pointer"
              v-if="!item?.Fold && item.CanFold"
              @click="solutions.fold(index, true)"
            >
              收起&nbsp;
              <el-icon size="26px">
                <ArrowUp />
              </el-icon>
            </div>
          </div>
          <div
            class="comment"
            v-show="item?.ShowComment ?? false"
          >
            <!-- 评论列表 -->
            <div
              class="item"
              v-for="(comment , commentIndex) in (item?.Comments ?? [])"
            >
              <div class="left">
                <img
                  :src=" comment.HeadURL ? (staticSourceBaseURL + comment.HeadURL) : proxy.Utils.DefaultHeadImage.show(comment.UID)"
                  alt=""
                >
              </div>
              <div class="
                  right">
                <div class="userName">
                  {{comment.UID}}
                </div>
                <div class="content">{{comment.Text}}</div>
                <div class="buttom">
                  <div
                    class="delete cursor_pointer"
                    v-if="userDataStore.isLogin && userDataStore.UID == comment.UID"
                    @click="solutions.deleteComment(index,comment.SLTCMTID,item.SLTID, userDataStore.UID)"
                  >
                    删除
                  </div>
                  <div class="time">{{ proxy.Utils.TimeTools.timestampToDate(comment.UpdateTime,2) }}</div>
                </div>
              </div>
            </div>
            <!-- 未找到 -->
            <div
              class="notFound"
              v-if="(item.Count ?? 0) == 0"
            >
              <el-empty description="当前还没有评论哦~" />
            </div>
            <!-- 分页 -->
            <div
              class="pagination"
              v-if="(item.Count ?? 0) >= 10"
            >
              <el-pagination
                background
                layout="prev, pager, next"
                :page-size="item.Limit"
                :total="item.Count"
                :current-page="item.Page"
                @current-change="item.CommentChangePage"
              />
            </div>
            <!-- 发表评论 -->
            <div class="myComment">
              <el-input
                v-model="solutions.myComment"
                autosize
                type="textarea"
                placeholder="留下你友好的评论吧！"
              />
              <el-button
                type="primary"
                :plain="themeSwitchStore.theme >  0 ? true : false"
                @click="solutions.publishComment(index)"
              >
                发表
              </el-button>
            </div>
            <div
              class="hideComment cursor_pointer"
              @click="solutions.closeComment(index)"
            >
              隐藏评论&nbsp;
              <el-icon size="24px">
                <Hide />
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
      <div class="publish">
        <h1>标题</h1>
        <el-input
        v-model="solutions.title"
        placeholder="Please input"
        clearable
    />
        <md-editor
          class="mdEditor"
          v-model="solutions.mySolution"
          :toolbars="markdown.toolbar"
          :theme="themeSwitchStore.theme > 0 ? 'light' : 'dark'"
        />
        <el-button
          type="primary"
          :plain="themeSwitchStore.theme >  0 ? true : false"
          @click="solutions.publishSolution"
        >
          发布题解
        </el-button>
      </div>
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
import MdEditor, { ToolbarNames } from "md-editor-v3";
import "md-editor-v3/lib/style.css";
import { staticSourceBaseURL } from "../utils/axios/axios";
import { useUserDataStore } from "../pinia/userData";
import elMessage from "../utils/elMessageFactory";
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

var markdown: {
  toolbar: ToolbarNames[];
} = {
  toolbar: [
    "bold",
    "underline",
    "italic",
    "-",
    "strikeThrough",
    "title",
    "sub",
    "sup",
    "quote",
    "unorderedList",
    "orderedList",
    "-",
    "codeRow",
    "code",
    "link",
    "image",
    "table",
    "mermaid",
    "katex",
    "-",
    "revoke",
    "next",
    "save",
    "=",
    "preview",
    "htmlPreview",
    "catalog",
  ],
};

//solution相关数据
var solutions = reactive({
  PID: "",
  data: [],
  //暂存我的评论
  myComment: "",
  //暂存我的题解
  title:"",
  mySolution: "",
  getSolutions: (PID: string) => {
    notFound.value = true;
    let UID = userDataStore.isLogin ? userDataStore.UID : null;
    proxy
      .$get(
        "api/solution/solutions",
        {
           "PID":PID,
           "UID":UID, 
           Page: config.currentPage - 1,
            Limit: config.Limit 
        },
        0,
        2
      )
      .then((res: any) => {
        let data = res.data;
        if (data?.code == 0) {
          solutions.data = data.SolutionList;
          config.Count = data.count;
          //初始状态为折叠
          for (let item of solutions.data) {
            // if (item.Content.split("\n").length > 4) {
            //   item["CanFold"] = true;
            //   item["Fold"] = true;
            // } else {
              item["CanFold"] = false;
              item["Fold"] = false;
            // }
            //给每个数据增加评论相关的数据
            item["Page"] = 1;
            item["Limit"] = 10;
            item["count"] = 0;
            item["Comments"] = [];
            item["ShowComments"] = false;
            item["ThumbsUp"] = 0;
            item["CommentCount"] =0;
            item["CommentChangePage"] = (Page: number) => {
              item["Page"] = Page;
              solutions.getComments(item);
            };
            solutions.getComments(item);
          }
          notFound.value = solutions.data.length == 0 ? true : false;
        }
        proxy.codeProcessor(
          data?.code ?? 100001,
          data?.msg ?? "服务器错误\\\\error"
        );
      });
  },
  //展开、收缩
  fold: (index: number, fold: boolean) => {
    solutions.data[index].Fold = fold;
  },
  //点赞
  thumbUp: (index: number, SLTID: number, State: number) => {
    if (!userDataStore.isLogin || !userDataStore.UID) {
      proxy.elMessage({ message: "您还未登录", type: "warning" });
      return;
    }
    let UID = userDataStore.UID;
    elMessage({
      message:"功能未实现",
      type:"warning",
    })
    // proxy
    //   .$post("forum/solution/thumbup/" + SLTID, { UID, State }, 0, 2)
    //   .then((res: any) => {
    //     let data = res.data;
    //     if (data?.code == 0) {
    //       let result = data.data;
    //       solutions.data[index].IThumbsUp = result; //更新点赞状态
    //       solutions.data[index].ThumbsUp += result; //更新点赞数
    //       proxy.elNotification({
    //         message: result == 1 ? "成功点赞" : "取消点赞",
    //         type: "success",
    //       });
    //     }
    //     proxy.codeProcessor(
    //       data?.code ?? 100001,
    //       data?.msg ?? "服务器错误\\\\error"
    //     );
    //   });
  },
  //打开评论
  openComment: (index: number) => {
    if (solutions.data[index].ShowComment) {
      solutions.data[index].ShowComment = false;
      return;
    }
    solutions.myComment = ""; //清空暂存的我的评论
    solutions.data[index].ShowComment = true;
    solutions.getComments(solutions.data[index]);
  },
  //获取评论
  getComments: (item: any) => {
    //传入题解对象
    proxy
      .$get(
        "api/comment/comments" ,
        {
          SID:item.SID,
          Page: item.Page - 1,
          Limit: item.Limit,
        },
        0,
        2
      )
      .then((res: any) => {
        //输出结果
        let data = res.data;
        if (data?.code == 0) {
          item["Count"] = data.Count; //实时的评论数
          item["Comments"] = data.Data;
          item.CommentCount = data.Count; //改变一下评论数
        }

        proxy.codeProcessor(
          data?.code ?? 100001,
          data?.msg ?? "服务器错误\\\\error"
        );
      });
  },
  //关闭评论
  closeComment: (index: number) => {
    solutions.data[index].ShowComment = false;
  },
  //发表评论
  publishComment: (index: number) => {
    if (!userDataStore.isLogin || !userDataStore.UID) {
      proxy.elMessage({ message: "您还未登录", type: "warning" });
      return;
    }
    if (!solutions.myComment) {
      proxy.elMessage({ message: "请输入内容", type: "warning" });
      return;
    }
    let Content = solutions.myComment;
    proxy
      .$post(
        "/api/comment/",
        {
          "SID":solutions.data[index].SID,
          "ActionType":1,
          "UID": userDataStore.UID,
          "Text":Content,
          "FCID":-1,
        },
        0,
        2
      )
      .then((res: any) => {
        let data = res.data;
        if (data?.code == 0) {
          solutions.getComments(solutions.data[index]);
          solutions.myComment = "";
          proxy.elNotification({
            message: "评论成功！",
            type: "success",
          });
        }
        proxy.codeProcessor(
          data?.code ?? 100001,
          data?.msg ?? "服务器错误\\\\error"
        );
      });
  },
  //撤回评论
  deleteComment: (
    index: number,
    SLTCMTID: number,
    SLTID: string,
    UID: string
  ) => {
    
    proxy
      .$delete(
        "forum/solution/comment/delete/" + SLTCMTID,
        {
          UID,
          SLTID,
        },
        0,
        2
      )
      .then((res) => {
        let data = res.data;
        if (data?.code == 0) {
          solutions.getComments(solutions.data[index]);
          proxy.elNotification({
            message: "删除成功",
            type: "success",
          });
        }
        proxy.codeProcessor(
          data?.code ?? 100001,
          data?.msg ?? "服务器错误\\\\error"
        );
      });
  },

  //发布题解
  publishSolution: () => {
    //发布我的题解
    if (!userDataStore.isLogin || !userDataStore.UID) {
      proxy.elMessage({ message: "您还未登录", type: "warning" });
      return;
    }
    if (!solutions.mySolution) {
      proxy.elMessage({ message: "请输入内容", type: "warning" });
      return;
    }
    let UID = userDataStore.UID;
    proxy
      .$post(
        "api/solution/",
        {
          "ActionType":1,
          "PID":solutions.PID,
          "UID":UID,
          "Title":solutions.title,
          "Text": solutions.mySolution,
        },
        0,
        2
      )
      .then((res: any) => {
        let data = res.data;
        if (data.code == 0) {
          solutions.mySolution = "";
          window.scroll(0, 0);
          proxy.elNotification({
            message: "发布成功！",
            type: "success",
          });
        }
        proxy.codeProcessor(
          data?.code ?? 100001,
          data?.msg ?? "服务器错误\\\\error"
        );
      });
    solutions.getSolutions(solutions.PID)
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
        height: fit-content;
        position: relative;
        box-sizing: border-box;
        padding: 16px;

        > .mdEditor {
          box-sizing: border-box;
          padding: 14px;
          @include fill_color("fill2");
        }
      }

      > .contentFold {
        max-height: 220px;
        overflow: hidden;

        > .foldCover {
          position: absolute;
          top: 16px;
          bottom: 0;
          left: 16px;
          right: 16px;
          box-sizing: border-box;
          padding: 14px;
          text-align: center;
          display: flex;
          flex-direction: column-reverse;
          align-items: center;
          @include linear_gradient(to top, "fill1", "fill3");
          opacity: 0.7;

          > div {
            display: flex;
            font-size: $fontSize7;
            @include font_color("font1");
          }
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

      > .comment {
        box-sizing: border-box;
        margin: 0 20px 10px 20px;
        padding: 10px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        flex-direction: column;
        @include fill_color("fill3");

        > .item {
          width: 100%;
          display: flex;
          align-items: flex-start;
          border-bottom: 1px solid;
          padding: 14px 0;
          @include border_color("border1");
          transition-duration: 160ms;

          &:hover {
            @include fill_color("fill2");
          }

          > .left {
            position: relative;
            margin: 4px 15px;
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

          > .right {
            width: calc(100% - 76px);
            display: flex;
            flex-direction: column;

            > .userName {
              font-size: $fontSize5;
              @include font_color("font1");
            }

            > .content {
              min-height: 40px;
              box-sizing: border-box;
              padding: 10px;
              font-size: $fontSize4;
              @include font_color("font2");
              word-wrap: break-word;
            }

            > .buttom {
              font-size: $fontSize4;
              display: flex;
              margin-left: auto;

              > .delete {
                @include font_color("fill42");
                margin: 0 10px;
              }

              > .time {
                margin: 0 10px;
                text-align: right;
                @include font_color("font3");
              }
            }
          }
        }

        > .notFound {
          > div {
            padding: 5px 0;
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

        > .myComment {
          width: 100%;
          margin: 10px 0;
          display: flex;
        }

        > .hideComment {
          font-size: $fontSize6;
          @include font_color("font2");
          width: fit-content;
          display: flex;
          align-items: center;
          justify-content: center;
          justify-items: center;

          &:hover {
            @include font_color("fill12");
          }
        }
      }
    }

    > .itemThumbsUp {
      @include fill_color("fill15");
    }

    > .pagination {
      margin: 25px 0;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      justify-items: center;
    }

    > .publish {
      display: flex;
      flex-direction: column;
      margin-top: 100px;

      > .mdEditor {
        @include fill_color("fill3");
      }

      > .el-button {
        font-size: $fontSize7;
      }
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