<template>
  <div class="EditProblemJudgeFile">
    <div class="search">
      <span style="width: 70px">题号：</span>
      <el-input-number
        v-model="search.PID"
        :min="1"
        v-on:focus="search.onFocus()"
      />
      <el-button
        plain
        v-on:click="search.getProblem(null)"
      >
        搜索
      </el-button>
    </div>
    <div
      class="preview"
      v-show="search.isSearched"
    >
      <div class="fileList">
        <div class="header">
          <div>文件名</div>
          <div>类型</div>
          <div>大小</div>
          <div>操作</div>
        </div>
        <div
          id="notFound"
          v-show="fileList.length == 0"
        >
          暂无文件
        </div>
        <div
          class="fileItem"
          v-for="(item,index) in fileList"
          :key="item.Filename"
        >
          <div>{{item.Filename}}</div>
          <div>{{item.Filename.split('.')[1]}}</div>
          <div>{{ (item.FileSize / 1024).toFixed(2)}}KB</div>
          <div>
            <el-button
              type="danger"
              plain
              size="small"
              @click="deleteFile(index)"
            >
              删除
            </el-button>
            <el-button
              v-if="item.Filename.split('.')[1] == 'zip'"
              type="warning"
              plain
              size="small"
              @click="unzipFile(index)"
            >
              解压
            </el-button>
          </div>
        </div>
      </div>
      <el-upload
        ref="upload"
        class="uploadJson"
        drag
        accept=".zip,.in,.out"
        :multiple="true"
        :auto-upload="false"
        :on-change="selectFile"
        :on-remove="removeFile"
      >
        <el-icon class="el-icon--upload">
          <upload-filled />
        </el-icon>
        <div class="el-upload__text">
          以zip、in、out格式文件上传 <em>点击</em>或者<em>拖拽</em>
        </div>
      </el-upload>
      <el-button
        plain
        @click="uploadFileList"
        type="primary"
      >
        上传
      </el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ElMessageBox } from "element-plus";
import { getCurrentInstance, onMounted, reactive, ref } from "vue";
import { FileUpdateUtils } from "../../../utils/fileUtils";
const { proxy } = getCurrentInstance() as any;

//文件列表
var uploadList = ref<File[]>([]);
var fileList = ref<{ Filename: string; FileType: string; FileSize: number }[]>(
  []
);

var search = reactive({
  PID: 0,
  isSearched: false,
  onFocus() {
    search.isSearched = false;
  },
  getProblem(PID: number | null) {
    if (PID) {
      search.PID = PID;
    }
    proxy.$get("api/file/" + search.PID).then((res: any) => {
      // proxy.$log(res);
      fileList.value = [];
      uploadList.value = [];
      let data = res.data;
      if (data.code == 0) {
        fileList.value = data.Data;
      }
      if (!data.Data) {
        proxy.elMessage({ message: "暂无文件", type: "info" });
      }
      search.isSearched = true;
      // proxy.codeProcessor(data.code,data.msg);
    });
  },
});

//选择上传文件
function selectFile(e: any, fList: any) {
  uploadList.value = [];
  fList.forEach((file) => {
    uploadList.value.push(file);
  });
  let tempName = fList[fList.length - 1].name;
  fileList.value.forEach((f: any) => {
    if (tempName == f.Filename) {
      proxy.elMessage({
        message: f.Filename + " 已存在，将会覆盖原文件!",
        type: "warning",
      });
      return;
    }
  });
  // proxy.$log(uploadList.value);
}

//移除将上传的文件
function removeFile(deletedF: any, fList: any) {
  uploadList.value = [];
  fList.forEach((file) => {
    uploadList.value.push(file);
  });
  proxy.elMessage({
    message: "取消上传 " + deletedF.name,
    type: "success",
  });
}

//上传全部
function uploadFileList() {
  if (uploadList.value.length == 0) {
    proxy.elMessage({
      message: "上传列表为空！",
      type: "warning",
    });
    return;
  }
  ElMessageBox.confirm("确定上传吗？", "注意", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    uploadList.value.forEach((f: any) => {
      f = f.raw;
      FileUpdateUtils.uploadProblemJudgeFile(f, search.PID).then((res: any) => {
        let data = res.data;
        if (data.code == 0) {
          for (let existFile in fileList.value) {
            if (fileList.value[existFile].Filename == f.name) {
              fileList.value.splice(Number(existFile), 1);
              break;
            }
          }
          fileList.value.push({
            Filename: f.name,
            FileType: f.name.split(".")[1],
            FileSize: f.size,
          });
          proxy.elMessage({ message: f.name + " 上传成功!", type: "success" });
        }
        proxy.codeProcessor(
          data?.code ?? 100001,
          data?.msg ?? "服务器错误\\\\error"
        );
      });
    });
    proxy.$refs.upload.clearFiles();
  });
}

//解压已有文件
function unzipFile(index: number) {
  let fileName = fileList.value[index].Filename;
  ElMessageBox.confirm("确定解压 " + fileName + " 吗？", "注意", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    let form = new FormData();
    form.append("file", fileName);
    proxy.$post("api/file/unzip/" + search.PID, form, 2).then((res: any) => {
      console.log(res);
      let data = res.data;
      if (data.code == 0) {
        search.getProblem(search.PID);
        proxy.elMessage({ message: "解压成功", type: "success" });
      }
      proxy.codeProcessor(
        data?.code ?? 100001,
        data?.msg ?? "服务器错误\\\\error"
      );
    });
  });
}

//删除已有文件
function deleteFile(index: number) {
  let fileName = fileList.value[index].Filename;
  ElMessageBox.confirm("确定删除 " + fileName + " 吗？", "注意", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    let form = new FormData();
    form.append("file", fileName);
    proxy.$delete("api/file/" + search.PID, form).then((res: any) => {
      let data = res.data;
      if (data.code == 0) {
        fileList.value.splice(index, 1);
        proxy.elMessage({ message: "删除成功", type: "success" });
      }
      proxy.codeProcessor(
        data?.code ?? 100001,
        data?.msg ?? "服务器错误\\\\error"
      );
    });
  });
}

onMounted(() => {});
</script>

<style scoped lang="scss">
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

.preview {
  display: flex;
  flex-direction: column;

  .fileList {
    display: flex;
    flex-direction: column;

    .header {
      display: grid;
      grid-template-columns: repeat(4, calc(100% / 4));
      @include fill_color("fill34");
      font-size: $fontSize7;

      > div {
        box-sizing: border-box;
        padding: 0 5px;
        @include font_color("font1");
      }
    }

    #notFound {
      text-align: center;
      @include fill_color("fill4");
      font-size: $fontSize7;
      @include font_color("font2");
      padding: 20px 0;
    }

    .fileItem {
      display: grid;
      grid-template-columns: repeat(4, calc(100% / 4));
      align-items: center;
      box-sizing: border-box;
      padding: 3px 0;
      @include fill_color("fill4");
      font-size: $fontSize5;

      > div {
        box-sizing: border-box;
        padding: 0 5px;
        @include font_color("font2");
      }
    }
  }
}
</style>