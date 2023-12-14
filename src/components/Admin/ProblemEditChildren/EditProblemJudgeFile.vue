<script lang="ts" setup>
import { ElMessageBox } from "element-plus";
import { getCurrentInstance, onMounted, reactive, ref } from "vue";
import { FileUpdateUtils } from "../../../utils/fileUtils";
import { Search } from '@element-plus/icons-vue'
const { proxy } = getCurrentInstance() as any;

//文件列表
var uploadList = ref<File[]>([]);
var fileList = ref<{ Filename: string; FileType: string; FileSize: number }[]>(
  []
);

var search = reactive({
  PID: "",
  isSearched: true,
  onFocus() {
    search.isSearched = true;
  },
  getProblem(PID: string | null) {
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
      FileUpdateUtils.uploadProblemJudgeFile(f, search.PID).then(
        (res: any) => {
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
            proxy.elMessage({
              message: f.name + " 上传成功!",
              type: "success",
            });
          }
          proxy.codeProcessor(
            data?.code ?? 100001,
            data?.msg ?? "服务器错误\\\\error"
          );
        }
      );
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
    proxy
      .$post("api/file/unzip/" + search.PID, form, 2)
      .then((res: any) => {
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

onMounted(() => {
  var PID = proxy.$route.query.PID
  if (PID) {
    search.getProblem(PID);
  }
});

const tableData = [
  {
  },
]

</script>

<template>
  <el-container direction="horizontal">
    <el-aside style="width: 287px; height: 100%;">
      <el-container>
        <el-header class="Container">
          <el-row>
            <span>题号</span>
            <el-input
              v-model="search.PID"
              placeholder="P1000"
              style="width: 203px;"
              class="Left"
            >
              <template #append>
                <el-button
                  :icon="Search"
                  v-on:click="search.getProblem(null)"
                />
              </template>
            </el-input>
          </el-row>
        </el-header>
      </el-container>
    </el-aside>
    <el-main
      class="Left"
      style="padding: 0 0 0 0"
    >
      <el-conatiner style="width: 620px;">
        <el-main class="Container">
          <!-- <el-table
            :data="tableData"
            style="width: 100%"
          >
            <el-table-column label="文件名">
              <template #default="scope">
                <div style="display: flex; align-items: center">

                </div>
              </template>
            </el-table-column>
            <el-table-column label="类型">
              <template #default="scope">
                <div style="display: flex; align-items: center">

                </div>
              </template>
            </el-table-column>
            <el-table-column label="大小">
              <template #default="scope">

              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template #default="scope">
                <el-button
                  size="small"
                  type="danger"
                  @click="deleteFile(index)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table> -->
          <div
            class="preview Center"
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
                v-for="(item, index) in fileList"
                :key="item.Filename"
              >
                <div>{{ item.Filename }}</div>
                <div>{{ item.Filename.split('.')[1] }}</div>
                <div>{{ (item.FileSize / 1024 / 1024).toFixed(2) }} MB</div>
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
                以 zip/in/out 格式文件上传，点击或者拖拽
              </div>
            </el-upload>
          </div>
        </el-main>
        <el-button
          @click="uploadFileList"
          type="primary"
          class="uploadButton Top"
        >
          上传
        </el-button>
      </el-conatiner>
    </el-main>
  </el-container>
</template>

<style scoped lang="scss">
.uploadButton {
  width: 100%;
  height: 50px;
  border-radius: 0 0 8px 8px;
}

span {
  align-self: center;
  display: flex;
  font-size: $fontSize5;
  @include font_color("font1");
}

.uploadJson {
  border-radius: 0 0 8px 8px;
}

.preview {
  // width: 600px;
  // display: flex;
  // flex-direction: column;

  .fileList {
    display: flex;
    flex-direction: column;

    .header {
      height: 40px;
      display: grid;
      grid-template-columns: repeat(4, calc(100% / 4));
      background: #f2f3f5;
      border-radius: 8px 8px 0 0;
      // @include fill_color("fill34");
      font-size: $fontSize7;

      >div {
        line-height: 40px;
        box-sizing: border-box;
        text-align: center;
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

      >div {
        box-sizing: border-box;
        padding: 0 5px;
        @include font_color("font2");
      }
    }
  }
}
</style>