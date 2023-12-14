<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { useThemeSwitchStore } from "../pinia/themeSwitch";
import MdEditor from "md-editor-v3";
import "md-editor-v3/lib/style.css";
const tabPosition = ref('left')
const themeSwitchStore = useThemeSwitchStore();

const excellentXcpcers = ref([
  {
    profilePhoto: "http://101.42.232.70/image/99109c659dbb279be78b8075cab3b7731702559837095399992.jpg",
    name: "林仁杰",
    slogan: "积极向上，到处睡觉",
    awards: "2023 ICPC 杭州 银奖;2023 ICPC 西安 铜奖;2023 ICPC 西安邀请赛 铜奖;2023 CCPC 湘潭邀请赛 铜奖",
    codeForces: "https://codeforces.com/profile/Angriliset",
  },
  // {
  //   profilePhoto: "1",
  //   name: "林仁杰",
  //   slogan: "1",
  //   awards: "1",
  //   codeForces: "",
  // },
  // {
  //   profilePhoto: "1",
  //   name: "林仁杰",
  //   slogan: "1",
  //   awards: "1",
  //   codeForces: "",
  // },
  // {
  //   profilePhoto: "1",
  //   name: "林仁杰",
  //   slogan: "1",
  //   awards: "1",
  //   codeForces: "",
  // },
  // {
  //   profilePhoto: "1",
  //   name: "林仁杰",
  //   slogan: "1",
  //   awards: "1",
  //   codeForces: "",
  // },
]);

</script>

<template>
  <el-container class="Main">
    <el-main class="Container">
      <div class="Title">
        <el-tabs
          :tab-position="tabPosition"
          class=""
        >
          <el-tab-pane class="" label="优秀 xcpcers">
            <el-row style="margin: 0 0 0 20px;">
              <el-col
                v-for="(item, index) in excellentXcpcers"
                :key="item"
                :span="7"
                style="margin: 16px 16px 0 0;"
              >
                <el-card
                  :body-style="{ padding: '0px' }"
                  shadow="hover"
                >
                  <img
                    :src=item.profilePhoto
                    class="image"
                  />
                  <div style="padding: 14px">
                    <p class="FontSize17">{{ item.name }}</p>
                    <p
                      class="FontSize14"
                      style="margin-top: 8px;"
                    >{{ item.slogan }}</p>
                      <el-tag
                        v-for="major in item.awards.split(/;/)"
                        :key="major"
                        style="margin-top: 2px;"
                      >
                        {{ major }}
                      </el-tag>
                    <div class="bottom">
                      <time class="time"></time>
                      <a
                        :href=item.codeForces
                        target="_blank"
                      >
                        <el-button class="button">
                          Ta 的 Codeforces 主页
                        </el-button>
                      </a>
                    </div>
                  </div>
                </el-card>
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="OJ 信息">
          </el-tab-pane>
          <el-tab-pane label="比赛"></el-tab-pane>
          <el-tab-pane label="出题要求"></el-tab-pane>
          <el-tab-pane label="To-do"></el-tab-pane>
        </el-tabs>
      </div>
    </el-main>
    <el-footer class="Container Footer ArtFont Bottom">
      <el-row>
        Anhui University of Technology
      </el-row>
      <el-row>
        Online Judge &copy; 2019 - 2023
      </el-row>
    </el-footer>
  </el-container>
</template>

<style scoped lang="scss">
.Main {
  height: 100%;
}

.mainContainer {
  width: 800px;
  height: 100%;
  padding: 24px;
  // float: left;
}

.xcpcers {
  border-radius: 12px;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.button {
  padding: 0 8px;
  min-height: auto;
}

.image {
  width: 100%;
  display: block;
}
</style>