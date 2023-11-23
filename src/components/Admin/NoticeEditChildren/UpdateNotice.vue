<template>
  <div class="updateList">
    <div class="search">
      <span style="width: 100px">题单号：</span>
      <el-input-number
        v-model="search.NID"
        :min="0"
        style="width:200px;"
        v-on:focus="search.onFocus()"
      />
      <el-button
        plain
        v-on:click="search.getNoticeInfo(null)"
      >搜索</el-button>
    </div>
    <el-divider></el-divider>
    <div
      class="table"
      v-if="search.isSearched"
    >
      <div class="addlist">
        <div><span>公告标题</span>
          <el-input v-model="notice.Title"></el-input>
        </div>
        <div>
          <span>公告内容:</span>
        </div>
        <div class="markdown">
          <md-editor
            v-model="notice.Content"
            :toolbars="markdown.toolbar"
            :on-upload-img="notice.updateImg"
          />
        </div>
        <div style="display: flex; justify-content: flex-end; padding: 10px 0">
          <el-button
            plain
            v-on:click="updateNotice()"
          >更新</el-button>
          <el-button
            plain
            v-on:click="deleteNotice(search.NID)"
          >删除</el-button>
        </div>
      </div>
    </div>
    <div class="showList">
      <el-button
        plain
        v-on:click="searchList.showList()"
      >
        {{ searchList.isShowed ? "关闭列表" : "显示列表" }}
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
          @click.stop="search.getNoticeInfo(item.ID)"
        >
          {{ item.ID }}&nbsp;-&nbsp;{{ item.Title }}
        </div>

      </div>
    </div>
  </div>
</template>
  
<script lang="ts" setup>
import { getCurrentInstance, reactive, onMounted } from "vue";
import { ElMessageBox } from "element-plus";
import "md-editor-v3/lib/style.css";
import MdEditor, { ToolbarNames } from "md-editor-v3";
import { ImageFileUploadUtils, ImageFileUtils } from "../../../utils/fileUtils";
import { staticSourceBaseURL } from "../../../utils/axios/axios";
const { proxy } = getCurrentInstance() as any;
const maxListProblemLength = 200;
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
type SearchType = {
  NID: number;
  isSearched: boolean;
  [item: string]: any;
}
//题单题号搜索功能
var search = reactive<SearchType>({
  NID: 1,
  isSearched: false,
  onFocus() {
    search.isSearched = false;
  },
  getNoticeInfo(NID: number) {
    if (NID) {
      search.NID = NID;
    }
    proxy.$axios.get("/api/notice/" + search.NID).then((res: any) => {
      let data = res.data;
      if (data.code == 0) {
        notice.copy(data);
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

var notice = reactive({
  Title: "",
  Content: "",
  init() {
    notice.Title = "";
    notice.Content = "";
  },
  copy(data: any) {
    notice.Title = data.Title;
    notice.Content = data.Content;
  },
  updateImg: (files) => {
    if (files.length == 0) {
      proxy.elMessage({
        message: "上传内容为空！",
        type: "warning",
      });
      return;
    }
    ElMessageBox.confirm("确定上传吗？", "注意", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    }).then(() => {
      files.forEach((f: any) => {
        uploadF(f);
      });
    });
  },
});
function uploadF(f: any) {
  ImageFileUtils.problemImageCompress(f).then((response: any) => {
    if (response.code == 0) {
      ImageFileUploadUtils.uploadProblemImage(response.data).then(
        (res: any) => {
          let data = res.data;
          if (data.code == 0) {
            let ImageURL = data.ImageURL;
            notice.Content += `\n![](${staticSourceBaseURL}${ImageURL})`;
            proxy.elMessage({
              message: `
              <strong>${f.name}上传成功</strong><br/>
              <span>已压缩:${(f.size / 1024).toFixed(2)}KB->${(
                  response.data.size / 1024
                ).toFixed(2)}KB</span>
            `,
              type: "success",
              duration: 5000,
              dangerouslyUseHTMLString: true,
            });
          }
          proxy.codeProcessor(
            data?.code ?? 100001,
            data?.msg ?? "服务器错误\\\\error"
          );
        }
      );
    }
  });
}

function updateNotice() {
  proxy.$axios.put("/api/notice/" + search.NID, {
    title: notice.Title,
    content: notice.Content
  }).then((res: any) => {
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

function deleteNotice(NID: number) {
  search.NID = NID ? NID : search.NID;
  proxy.$delete("/api/notice/" + search.NID).then((res: any) => {
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

//列表的搜索结果
var searchList = reactive({
  Data: [],
  isShowed: false,
  selectAlled: false,
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
        "api/notices"
      )
      .then((res: any) => {
        let data = res.data;
        if (data.code == 0) {
          // proxy.$log(data)
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
        tempSelected.push(item.ID);
        tempString += item.ID + ",";
      }
    });
    if (tempSelected.length <= 0) {
      proxy.elMessage({ message: "未选择任何题单！", type: "warning" });
      return;
    }
    ElMessageBox.confirm(
      "确定要批量删除公告ID为 " + tempString + " 公告吗？",
      "注意",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }
    ).then(() => {
      for (let i in tempSelected) {
        proxy.elMessage({
          message: "正在删除公告" + tempSelected[i],
          type: "success",
        });
        deleteNotice(tempSelected[i])
      }
      proxy.elMessage({
        message: "批量删除成功!",
        type: "success",
      });
      searchList.isShowed = false;
    });
  },
});

onMounted(() => {
  var LID = proxy.$route.query.LID
  if (LID) {
    search.LID = LID;
    search.getListInfo(LID);
  }
});
</script>
  
<style scoped lang="scss">
.addlist>div {
  display: flex;
  align-content: center;
  box-sizing: border-box;
  margin: 5px 0;
}

.addlist>div>span {
  font-size: 22px;
  width: 150px;
  @include font_color("font1");
}

.count {
  width: 20%;
  display: inline-flex;
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