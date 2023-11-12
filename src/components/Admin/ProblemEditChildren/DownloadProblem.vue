<script lang="ts" setup>
import { getCurrentInstance, reactive } from "vue";
import { ElMessageBox } from "element-plus";
import { useConstValStore } from "../../../pinia/constVal";
import MdEditor, { ToolbarNames } from "md-editor-v3";
import "md-editor-v3/lib/style.css";
import { ImageFileUploadUtils, ImageFileUtils } from "../../../utils/fileUtils";
import { staticSourceBaseURL } from "../../../utils/axios/axios";
import { type } from "os";
import codeProcessor from "../../../utils/codeProcessor";
import axios from "axios";
import { Problem } from "../../../utils/buffer/buffer";
const { proxy } = getCurrentInstance() as any;
const constValStore = useConstValStore();

// markdown 工具栏
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

//题目题号搜索功能
var search = reactive({
    PID: "",
    isSearched: false,
    onFocus() {
        search.isSearched = false;
    },
    DownloadProblem(PID: string) {
        if (PID) {
            search.PID = PID;
        }
        proxy.$axios.get("api/file/json/download?PIDs=" + search.PID).then((res: any) => {
            let data = res.data;
            console.log(data)
            res.downloa
            if (typeof data.code != 'undefined') {
                proxy.codeProcessor(
                    data?.code ?? 100001,
                    data?.msg ?? "服务器错误\\\\error"
                );
            } else {
                let fileName = Date.now() + ".json";
                const blob = new Blob([JSON.stringify(data, null, "\t")]);
                const url = window.URL.createObjectURL(blob);
                console.log(blob);
                console.log(url);
                const link = document.createElement('a');
                link.href = url;
                link.download = fileName;
                // 触发点击事件来启动下载
                link.click();
                // 释放资源
                window.URL.revokeObjectURL(url);
            }
        });
    },
});

//题目数据
var problem = reactive({
    PID: "",
    Title: "",
    Description: "",
    Input: "",
    Output: "",
    SampleInput: "",
    SampleOutput: "",
    LimitTime: 0,
    LimitMemory: 0,
    Hit: "",
    Label: "",
    Origin: -1,
    OriginPID: "",
    ContentType: -1,
    Visible: 1,
    //题目描述 文本类型
    ContentTypes: [
        { label: "普通 ", value: constValStore.PROBLEM_CONTENTTYPE_NORMAL },
        {
            label: "MarkDown",
            value: constValStore.PROBLEM_CONTENTTYPE_MARKDOWN,
        },
    ],
    //选项列表 const
    Origins: [
        { label: "本地", value: constValStore.PROBLEM_ORIGIN_LOCAL },
        { label: "CodeForce", value: constValStore.PROBLEM_ORIGIN_CF },
        {
            label: "AtCoder",
            value: constValStore.PROBLEM_ORIGIN_ATCODER,
        },
        { label: "洛谷", value: constValStore.PROBLEM_ORIGIN_LUOGU },
    ],
    //placehodler提示
    OriginPlaceHolder: {
        [constValStore.PROBLEM_ORIGIN_CF]: "竞赛ID + 题目编号 如：1069A",
        [constValStore.PROBLEM_ORIGIN_ATCODER]:
            "竞赛ID + 题目编号 如：abc277_e",
    },
    //题目
    Visibles: [
        { label: "可见", value: constValStore.PROBLEM_VISIBLE },
        {
            label: "不可见",
            value: constValStore.PROBLEM_UNVISIBLE,
        },
    ],
    init() {
        search.isSearched = false;
        this.PID = 0;
        this.Title = "";
        this.Description = "";
        this.Input = "";
        this.Output = "";
        this.SampleInput = "";
        this.SampleOutput = "";
        this.LimitTime = 0;
        this.LimitMemory = 0;
        this.Hit = "";
        this.Label = "";
        this.Origin = 0;
        this.OriginPID = "";
        this.ContentType = -1;
        this.Visible = 1;
    },
    copy(data: any) {
        problem.PID = data.PID;
        problem.Description = data.Description;
        problem.Hit = data.Hit;
        problem.Input = data.Input;
        problem.LimitMemory = data.LimitMemory;
        problem.LimitTime = data.LimitTime;
        problem.Output = data.Output;
        problem.SampleInput = data.SampleInput;
        problem.SampleOutput = data.SampleOutput;
        problem.Title = data.Title;
        problem.Label = data.Label;
        problem.Origin = data.Origin;
        problem.OriginPID = data.OriginPID;
        problem.ContentType = data.ContentType;
        problem.Visible = data.Visible;
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

//列表分页的配置项
var configList = reactive({
    Count: 0, //当前数据量
    currentPage: 1,
    limit: 20,
    //初始化页面配置数据
    init() {
        configList.Count = 0;
        configList.currentPage = 1;
        configList.limit = 20;
    },
});

//列表的搜索结果
var searchList = reactive({
    Data: [],
    isShowed: false,
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
                "api/problem/list?Page=" +
                (configList.currentPage - 1) +
                "&Limit=" +
                configList.limit
            )
            .then((res: any) => {
                let data = res.data;
                if (data.code == 0) {
                    // proxy.$log(data)
                    configList.Count = data.Count;
                    searchList.Data = data.Data;
                    searchList.Data.forEach((item) => {
                        item.selected = false;
                    });
                    searchList.isShowed = true;
                }
                proxy.codeProcessor(
                    data?.code ?? 100001,
                    data?.msg ?? "服务器错误\\\\error"
                );
            });
    },
    //页面切换
    changePage: (page: any) => {
        configList.currentPage = page;
        //切换页面后开始显示数据
        searchList.search();
    },
    //选择
    selectProblem: (index: any) => {
        searchList.Data[index].selected = searchList.Data[index].selected
            ? false
            : true;
    },
    //全选
    selectAll: () => {
        searchList.Data.forEach((element) => {
            element.selected = true;
        });
    },
    //批量删除
    Downloads: () => {
        let tempSelected = [];
        let tempString = "";
        searchList.Data.forEach((item) => {
            if (item.selected) {
                tempSelected.push(item.PID);
            }
        });
        for (let i = 0; i < tempSelected.length; i++) {
            tempString += tempSelected[i];
            if (i != tempSelected.length - 1)
                tempString += ",";
        }
        if (tempSelected.length <= 0) {
            proxy.elMessage({ message: "未选择任何题目！", type: "warning" });
            return;
        }
        search.DownloadProblem(tempString)
        //     proxy.$axios
        //         .post("api/problem/delete/", {
        //             Pids: tempSelected,
        //         })
        //         .then((res: any) => {
        //             let data = res.data;
        //             if (data.code == 0) {
        //                 problem.init();
        //                 proxy.elMessage({
        //                     message: "批量删除成功!",
        //                     type: "success",
        //                 });
        //             }
        //             proxy.codeProcessor(
        //                 data?.code ?? 100001,
        //                 data?.msg ?? "服务器错误\\\\error"
        //             );
        //         });
        //     searchList.isShowed = false;
        // });
    },
});

//上传文件
function uploadF(f: any) {
    ImageFileUtils.problemImageCompress(f).then((response: any) => {
        if (response.code == 0) {
            ImageFileUploadUtils.uploadProblemImage(response.data).then(
                (res: any) => {
                    let data = res.data;
                    if (data.code == 0) {
                        let ImageURL = data.ImageURL;
                        problem.Description += `\n![](${staticSourceBaseURL}${ImageURL})`;
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

//删除题目
function deleteProblem() {
    ElMessageBox.confirm(
        "确定要删除题号为 " + search.PID + " 的题目吗？",
        "注意",
        {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
        }
    ).then(() => {
        proxy.$axios
            .post("api/problem/delete/", {
                Pids: [search.PID],
            })
            .then((res) => {
                let data = res.data;
                if (data.code == 0) {
                    problem.init();
                    proxy.elMessage({
                        message: "删除成功!",
                        type: "success",
                    });
                } else {
                    proxy.codeProcessor(
                        data?.code ?? 100001,
                        data?.msg ?? "服务器错误\\\\error"
                    );
                }
            });
    });
}

//完成修改
function complete() {
    proxy
        .$post("api/problem/edit/", {
            Pid: problem.PID,
            Title: problem.Title,
            Description: problem.Description,
            Input: problem.Input,
            Output: problem.Output,
            SampleInput: problem.SampleInput,
            SampleOutput: problem.SampleOutput,
            LimitTime: problem.LimitTime,
            LimitMemory: problem.LimitMemory,
            Hit: problem.Hit,
            Label: problem.Label,
            Origin: problem.Origin,
            OriginPID: problem.OriginPID,
            ContentType: problem.ContentType,
            Visible: problem.Visible,
        })
        .then((res: any) => {
            let data = res.data;
            if (data.code == 0) {
                proxy.$log(data);
                proxy.elMessage({ message: "修改成功!", type: "success" });
            } else {
                proxy.codeProcessor(
                    data?.code ?? 100001,
                    data?.msg ?? "服务器错误\\\\error"
                );
            }
        });
}
</script>


<template>
    <el-container>
        <el-main class="Container">
            <div class="search">
                <span style="width: 70px">题号：</span>
                <el-input v-model="search.PID" style="width:200px;" v-on:focus="search.onFocus()" />
                <el-button plain v-on:click="search.DownloadProblem(null)">下载</el-button>
                <div style="color: red;text-align: center; font-size:15px;">&nbsp&nbsp题目间以逗号隔开</div>
            </div>
            <el-divider></el-divider>
            <div class="showList">
                <el-button plain v-on:click="searchList.showList()">
                    {{ searchList.isShowed ? "关闭列表" : "显示列表" }}
                </el-button>
                <el-button plain v-show="searchList.isShowed" v-on:click="searchList.selectAll()">
                    当页全选
                </el-button>
                <el-button plain v-show="searchList.isShowed" type="warning" v-on:click="searchList.Downloads()">
                    批量下载
                </el-button>
            </div>
            <div v-show="searchList.isShowed" class="list">
                <div v-for="(item, index) in searchList.Data" :class="item.selected ? 'item itemSelected' : 'item'"
                    :key="index">
                    <input type="checkbox" :checked="item.selected" @change.stop="searchList.selectProblem(index)">
                    <div class="title cursor_pointer" @click.stop="search.DownloadProblem(item.PID)">
                        {{ item.PID }}&nbsp;-&nbsp;{{ item.Title }}
                    </div>

                </div>
            </div>
            <div v-show="searchList.isShowed" class="pagination">
                <el-pagination background layout="prev, pager, next" :page-size="configList.limit" :total="configList.Count"
                    :current-page="configList.currentPage" @current-change="searchList.changePage" />
            </div>
        </el-main>
    </el-container>
</template>

<style scoped lang="scss">
.search {
    display: flex;
    justify-items: center;
    align-content: center;
    margin-bottom: 40px;
}

.table {
    width: 100%;
    display: flex;
    flex-direction: column;

    .normal {
        width: 100%;
        display: flex;
        flex-direction: column;

        >div {
            display: flex;
            align-content: center;
            justify-content: flex-start;
            box-sizing: border-box;
            margin: 5px 0;

            >span {
                display: block;
                font-size: 22px;
                width: 150px;
                @include font_color("font1");
            }
        }
    }

    >div {
        display: flex;
        align-content: center;
        justify-content: flex-start;
        box-sizing: border-box;
        margin: 5px 0;

        >span {
            display: block;
            font-size: 22px;
            width: 150px;
            @include font_color("font1");
        }
    }
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