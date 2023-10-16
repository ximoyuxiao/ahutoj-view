<template>
    <el-container class="mainContainer">
        <el-main class="main">
            <div class="ProblemList">
                <div class="left">
                    <div class="top">
                        <div class="search">
                            <el-input v-model="config.search" placeholder="Please input" clearable />
                            <el-button>
                                <el-icon size="18px" style="margin: auto 15px;" @click="getListByLID()">
                                    <Search />
                                </el-icon>
                            </el-button>
                        </div>
                    </div>
                    <el-divider />
                    <div class="content">
                        <div class="list">
                            <div class="item cursor_pointer" v-for="(item, index) in problemList.list">
                                <div class="left" @click="() => getListByLID(item.LID)">
                                    <el-row class="bold artFont">
                                        <div id="LID">#{{ item.LID }}</div>&nbsp;
                                        <div id="Title">{{ item.Title }}</div>
                                    </el-row>
                                    <div class="interval"></div>
                                    <div id="UID">创建者：{{ item.UID }}</div>
                                    <div id="Time">创建时间：{{ proxy.Utils.TimeTools.timestampToTime(item.StartTime) }}</div>
                                </div>
                            </div>
                        </div>
                        <div class="pagination">
                            <el-pagination background layout="prev, pager, next" :page-size="config.limit"
                                :total="config.Count" :current-page="config.currentPage"
                                @current-change="config.changePage" />
                            <!-- <el-radio-group v-model="config.limit" @change="config.changePage(1)" style="margin: 0 20px">
                            <el-radio-button :label="20" />
                            <el-radio-button :label="30" />
                            <el-radio-button :label="50" />
                        </el-radio-group> -->
                        </div>
                    </div>
                </div>
            </div>
        </el-main>
    </el-container>
</template>

<script lang="ts" setup>
import { reactive } from "vue";
import { getCurrentInstance } from "vue";
const { proxy } = getCurrentInstance() as any;

var config = reactive({
    search: 1000,
    Count: 0,
    currentPage: 1,
    limit: 20,
    loading: null,
    init() {
        this.Count = 0;
        this.currentPage = 1;
        this.limit = 20;
        this.loading = null;
    },
    //切换页面
    changePage: (page: number): void => {
        config.currentPage = page;
        SyncUrl();
        problemList.getData();
    },
});

var problemList = reactive({
    list: [],
    getData: () => {
        proxy
            .$get("api/training/list", {
                Page: config.currentPage - 1,
                Limit: config.limit,
            })
            .then((res) => {
                let data = res.data;
                if (data.code === 0) {
                    console.log(data);
                    config.Count = data.size;
                    problemList.list = data.data;
                }
                proxy.codeProcessor(
                    data?.code ?? 100001,
                    data?.msg ?? "服务器错误\\\\error"
                );
            });
    },
});

function getListByLID(LID?: number) {
    config.search = LID ?? config.search;
    if (!config.search) {
        proxy.elMessage({
            message: "请输入有效的题单ID！",
            type: "warning",
        });
        return;
    }
    proxy.$router.push({
        name: "List",
        params: {
            LID: config.search,
        },
    });
}
//用于同步浏览器url
function SyncUrl() {
    //仅用于展示实时url，可用于复制跳转
    proxy.$router.replace({
        path: "/Lists",
        query: {
            Page: config.currentPage,
            Limit: config.limit,
        },
    });
}

(() => {
    problemList.getData();
})();
</script>

<style  scoped lang="scss">
.mainContainer {
    align-self: center;
    width: min(90%, 900px);
}

.artFont {
    font-family: Merriweather, 'PingFang SC', 'Microsoft Yahei', 'Times New Roman', serif;
}

.title {
    font-size: $fontSize8;
}

.bold {
    font-weight: bold;
}

.interval {
    margin: 16px 0 0 0;
}

.main {
    width: 100%;
    // height: 1200px;
    margin: 20px 0 0 0;
    background-color: #fff;
    border: 1px solid #ddd;
    padding: 16px;
    border-radius: 8px;
    // float: left;
    // display: flex;
    // justify-content: space-between;
    box-sizing: border-box;
    font-size: $fontSize3;
}

#LID {
    font-size: $fontSize6;
}

#Title {
    font-size: $fontSize8;
}

.ProblemList {

    >.left {
        width: 100%;

        .top {
            // box-sizing: border-box;
            padding: $modelDistance $modelDistance 0 $modelDistance;

            .search {
                display: flex;
                align-items: center;
            }
        }

        .content {
            width: 100%;

            .list {
                width: 100%;
                box-sizing: border-box;
                padding: 0 $modelDistance $modelDistance $modelDistance;

                .item {
                    padding: 12px;
                    position: relative;
                    // width: 100%;
                    border-radius: 6px;
                    background-color: #F2F3F5;
                    margin-bottom: $modelDistanceMini;
                    overflow: hidden;
                    // box-shadow: 0 0 2px 1px rgb(142, 142, 142);

                    &:hover {
                        // @include box_shadow(0, 0, 2px, 1px, "fill53");
                        box-shadow: 0 0 2px 1px #409EFF;
                        background-color: #EDF6FF;
                        border-color: #409EFF;
                        border-width: 2px;
                    }
                }
            }

            .pagination {
                margin: 25px 0 0 0;
                width: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                justify-items: center;
            }
        }
    }
}
</style>