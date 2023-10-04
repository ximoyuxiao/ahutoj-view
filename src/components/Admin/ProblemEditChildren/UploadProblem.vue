<template>
    <div class="EditProblemJudgeFile">
        <div
            class="preview"
        >
            <el-upload
                ref="upload"
                class="uploadJson"
                drag
                accept=".xml,.json"
                :multiple="true"
                :auto-upload="false"
                :on-change="selectFile"
                :on-remove="removeFile"
            >
                <el-icon class="el-icon--upload">
                    <upload-filled />
                </el-icon>
                <div class="el-upload__text">
                    可以上传XML和JSON格式的文件 <em>点击</em>或者<em>拖拽</em>
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
    PID: "",
    isSearched: false,
    onFocus() {
        search.isSearched = false;
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
            console.log(f)
            f = f.raw;
            let formData = new FormData();
            formData.append("file", f as Blob);
            proxy
            .$post("api/file/problem/",formData, 1)
            .then((res: any) => {
                let data = res.data
                if(data.code == 0){
                    proxy.elMessage({
                            message: f.name + " 上传成功!",
                            type: "success",
                    });
                }
                proxy.codeProcessor(
                    data?.code ?? 100001,
                    data?.msg ?? "服务器错误\\\\error"
                );
            })
        });
        proxy.$refs.upload.clearFiles();
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