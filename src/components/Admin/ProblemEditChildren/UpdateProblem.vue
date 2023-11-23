<script lang="ts" setup>
import { getCurrentInstance, reactive, onMounted, ref } from "vue";
import { ElMessageBox } from "element-plus";
import { useConstValStore } from "../../../pinia/constVal";
import MdEditor, { ToolbarNames } from "md-editor-v3";
import "md-editor-v3/lib/style.css";
import { ImageFileUploadUtils, ImageFileUtils } from "../../../utils/fileUtils";
import { staticSourceBaseURL } from "../../../utils/axios/axios";
const { proxy } = getCurrentInstance() as any;
const constValStore = useConstValStore();
const MdMaxVisible = ref(false);

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
    getProblem(PID: string) {
        if (PID) {
            search.PID = PID;
        }
        proxy.$axios.get("api/problem/" + search.PID).then((res: any) => {
            let data = res.data;
            if (data.code == 0) {
                problem.copy(data);
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
    batchDelete: () => {
        let tempSelected = [];
        let tempString = "";
        searchList.Data.forEach((item) => {
            if (item.selected) {
                tempSelected.push(item.PID);
                tempString += item.PID + " ";
            }
        });
        if (tempSelected.length <= 0) {
            proxy.elMessage({ message: "未选择任何题目！", type: "warning" });
            return;
        }
        ElMessageBox.confirm(
            "确定要批量删除题号 " + tempString + " 题目吗？",
            "注意",
            {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            }
        ).then(() => {
            proxy.$axios
                .post("api/problem/delete/", {
                    Pids: tempSelected,
                })
                .then((res: any) => {
                    let data = res.data;
                    if (data.code == 0) {
                        problem.init();
                        proxy.elMessage({
                            message: "批量删除成功!",
                            type: "success",
                        });
                    }
                    proxy.codeProcessor(
                        data?.code ?? 100001,
                        data?.msg ?? "服务器错误\\\\error"
                    );
                });
            searchList.isShowed = false;
        });
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

onMounted(() => {
    var PID = proxy.$route.query.PID
    if (PID) {
        search.PID = PID;
        search.getProblem(PID);
    }
});
</script>

<template>
    <el-drawer v-model="MdMaxVisible" :title=problem.Title fullsreen="true" size="100%" direction="btt">
        <md-editor v-model="problem.Description" :toolbars="markdown.toolbar" :on-upload-img="problem.updateImg"
            style="height: calc(100vh - 120px);" />
    </el-drawer>
    <el-container>
        <el-header class="Container">
            <el-row class="search">
                <span>题号</span>
                <el-input v-model="search.PID" style="width:200px;" v-on:focus="search.onFocus()" />
                <el-button plain v-on:click="search.getProblem(null)">搜索</el-button>
            </el-row>
            <div class="showList Top">
                <el-button plain v-on:click="searchList.showList()">
                    {{ searchList.isShowed ? "关闭列表" : "显示列表" }}
                </el-button>
                <el-button plain v-show="searchList.isShowed" v-on:click="searchList.selectAll()">
                    当页全选
                </el-button>
                <el-button plain v-show="searchList.isShowed" type="danger" v-on:click="searchList.batchDelete()">
                    批量删除
                </el-button>
            </div>
            <div v-show="searchList.isShowed" class="list">
                <div v-for="(item, index) in searchList.Data" :class="item.selected ? 'item itemSelected' : 'item'"
                    :key="index">
                    <input type="checkbox" :checked="item.selected" @change.stop="searchList.selectProblem(index)">
                    <div class="title cursor_pointer" @click.stop="search.getProblem(item.PID)">
                        {{ item.PID }}&nbsp;-&nbsp;{{ item.Title }}
                    </div>

                </div>
            </div>
            <div v-show="searchList.isShowed" class="pagination">
                <el-pagination background layout="prev, pager, next" :page-size="configList.limit" :total="configList.Count"
                    :current-page="configList.currentPage" @current-change="searchList.changePage" />
            </div>
        </el-header>
        <el-main class="Container" v-if="search.isSearched">
            <el-row>
                <span>标题</span>
                <el-input v-model="problem.Title" class="problemTitle Left" />
            </el-row>
            <el-row class="Top">
                <span>时间限制/ms</span>
                <el-input-number v-model="problem.LimitTime" :min="200" :max="10000" :step="200" controls-position="right"
                    class="Left" />
                <span style="margin-left: 50px;">内存限制/MiB</span>
                <el-input-number v-model="problem.LimitMemory" :min="64" :max="1024" :step="64" controls-position="right"
                    class="Left" />
            </el-row>
            <el-row class="Top">
                <span>标签</span>
                <el-input v-model="problem.Label" placeholder="每个标签用英文的 ; 隔开" class="tagList Left" />
            </el-row>
            <el-row class="Top">
                <span>来源</span>
                <el-select v-model="problem.Origin" class="m-2 Left" placeholder="Select">
                    <el-option v-for="(item, index) in problem.Origins" :key="item.label" :label="item.label"
                        :value="item.value" />
                </el-select>
                <el-input v-show="problem.Origin != -1" v-model="problem.OriginPID"
                    :placeholder="problem.OriginPlaceHolder[problem.Origin]" class="originInfo" />
            </el-row>
            <el-row class="Top">
                <span>可见</span>
                <el-select v-model="problem.Visible" class="m-2 Left" placeholder="Select">
                    <el-option v-for="(item, index) in problem.Visibles" :key="item.label" :label="item.label"
                        :value="item.value" />
                </el-select>
            </el-row>
        </el-main>
        <el-main class="Container" v-if="search.isSearched">
            <el-row>
                <span>文本类型</span>
                <el-select v-model="problem.ContentType" class="m-2 Left" placeholder="Select">
                    <el-option v-for="(item, index) in problem.ContentTypes" :key="item.label" :label="item.label"
                        :value="item.value" />
                </el-select>
                <el-button class="Left" type="primary" @click="MdMaxVisible = true" v-if="problem.ContentType == 1">
                    <el-icon size="19px">
                        <FullScreen />
                    </el-icon>
                    &nbsp全屏编辑
                </el-button>
            </el-row>
            <div v-if="problem.ContentType == 1">
                <div class="markdown Top">
                    <md-editor v-model="problem.Description" :toolbars="markdown.toolbar"
                        :on-upload-img="problem.updateImg" preview-only style="max-height: 600px;"/>
                </div>
            </div>
            <div v-else>
                <div class="normal">
                    <el-row class="Top">
                        <span>题目描述</span>
                        <el-input v-model="problem.Description" type="textarea" autosize class="plainText Left" />
                    </el-row>
                    <el-row class="Top">
                        <span>输入描述</span>
                        <el-input v-model="problem.Input" type="textarea" autosize class="plainText Left" />
                    </el-row>
                    <el-row class="Top">
                        <span>输出描述</span>
                        <el-input v-model="problem.Output" type="textarea" autosize class="plainText Left" />
                    </el-row>
                    <el-row class="Top">
                        <span>输入样例</span>
                        <el-input v-model="problem.SampleInput" type="textarea" autosize class="plainText Left" />
                    </el-row>
                    <el-row class="Top">
                        <span>输出样例</span>
                        <el-input v-model="problem.SampleOutput" type="textarea" autosize class="plainText Left" />
                    </el-row>
                    <el-row class="Top">
                        <span>提示</span>
                        <el-input v-model="problem.Hit" type="textarea" autosize class="plainText"
                            style="margin-left: 50px;" />
                    </el-row>
                </div>
            </div>
        </el-main>
        <div style="display: flex;" class="Top" v-if="search.isSearched">
            <el-button type="danger" v-on:click="deleteProblem()" class="button-1">
                <span class="Bold">删 除</span>
            </el-button>
            <el-button v-on:click="complete()" type="warning" class="button-2">
                <span class="Bold">修 改</span>
            </el-button>
        </div>
    </el-container>
</template>

<style scoped lang="scss">
.button-1 {
    width: 20%;
    height: 50px;
    border-radius: 12px;
}

.button-2 {
    width: 80%;
    height: 50px;
    border-radius: 12px;
}

.problemTitle {
    width: 600px;
}

.tagList {
    width: 600px;
}

.m-2 {
    width: 160px;
}

.originInfo {
    width: 440px;
}

span {
    align-self: center;
    display: flex;
    font-size: $fontSize5;
}

.addProblemButton {
    align-self: center;
    width: 100%;
    height: 50px;
    border-radius: 12px;
    font-size: $fontSize6;
}

.plainText {
    width: 600px;
    display: flex;
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
            font-size: $fontSize6;
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