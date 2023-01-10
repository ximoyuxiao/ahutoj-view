<template>
    <div class="ProblemList">
        <div class="left">
            <div class="top">
                <div class="search">
                    <el-input
                        v-model="config.search"
                        placeholder="Please input"
                        clearable
                    />
                    <el-button>
                        <el-icon
                            size="18px"
                            style="margin: auto 15px;"
                        >
                            <Search />
                        </el-icon>
                    </el-button>
                </div>
            </div>
            <el-divider />
            <div class="content">
                <div class="list">
                    <div
                        class="item"
                        v-for="(item,index) in problemList.list"
                    >
                        <div class="left">
                            <div id="LID">#{{item.LID}}</div>
                            <div id="Title">{{item.Title}}</div>
                        </div>
                        <div id="cover"></div>
                        <div class="right">
                            <div id="Time">创建时间：{{proxy.Utils.TimeTools.timestampToTime(item.StartTime)}}</div>
                            <div id="UID">创建者：{{item.UID}}</div>
                        </div>
                    </div>
                </div>
                <div class="pagination">
                    <el-pagination
                        background
                        layout="prev, pager, next"
                        :page-size="config.limit"
                        :total="config.Count"
                        :current-page="config.currentPage"
                        @current-change="config.changePage"
                    />
                    <el-radio-group
                        v-model="config.limit"
                        @change="config.changePage(1)"
                        style="margin: 0 20px"
                    >
                        <el-radio-button :label="20" />
                        <el-radio-button :label="30" />
                        <el-radio-button :label="50" />
                    </el-radio-group>
                </div>
            </div>
        </div>

        <div class="right">

        </div>
    </div>
</template>

<script lang="ts" setup>
import { reactive } from "vue";
import { getCurrentInstance } from "vue";
const { proxy } = getCurrentInstance() as any;

var config = reactive({
    search: "",
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

//用于同步浏览器url
function SyncUrl() {
    //仅用于展示实时url，可用于复制跳转
    proxy.$router.replace({
        path: "/ProblemLists",
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
.ProblemList {
    display: flex;
    justify-content: space-between;
    box-sizing: border-box;
    padding: $problemList_outerPaddingTop $problemList_outerPaddingLeft;

    > .left {
        width: calc(100% - $problemList_rightWidth - $modelDistance);
        @include fill_color("fill2");
        border-radius: 10px;
        overflow: hidden;
        .top {
            box-sizing: border-box;
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
                    position: relative;
                    width: 100%;
                    border-radius: 6px;
                    @include fill_color("fill4");
                    margin-bottom: $modelDistanceMini;
                    overflow: hidden;

                    &:hover {
                        @include box_shadow(0, 0, 2px, 1px, "fill53");
                    }

                    &:hover > .right {
                        transform: translateY(0);
                    }

                    &:hover > .left > #Title {
                        transform: translateX(20px);
                        @include font_color("fill12");
                        filter: drop-shadow(0 0 1px #cdcdcd88);
                    }

                    &:hover > #cover {
                        transform: translateX(0);
                    }

                    > .left {
                        width: 100%;

                        > #LID {
                            padding: 5px 10px;
                            font-size: $fontSize4;
                            @include font_color("font3");
                        }

                        > #Title {
                            padding: 10px 0 30px 20px;
                            font-size: $fontSize7;
                            @include font_color("font1");
                            transition-duration: 260ms;
                            font-weight: 600;
                        }
                    }

                    > #cover {
                        position: absolute;
                        right: 0;
                        top: 0;
                        width: 70%;
                        height: 100%;
                        @include linear_gradient(to left, "fill2", "fill4");
                        transform: translateX(100%);
                        opacity: 0.8;
                        transition-duration: 300ms;
                    }

                    > .right {
                        position: absolute;
                        right: 50px;
                        top: 0;
                        transform: translateY(-90px);
                        transition-duration: 300ms;
                        width: 300px;

                        > #Time {
                            padding: 5px 0;
                            font-size: $fontSize6;
                            @include font_color("font2");
                        }
                        > #UID {
                            font-size: $fontSize5;
                            @include font_color("font3");
                        }
                    }
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
        }
    }

    > .right {
        width: $problemList_rightWidth;
        @include fill_color("fill2");
        border-radius: 10px;
        overflow: hidden;
        height: 500px;
    }
}
</style>