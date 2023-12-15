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
  {
    profilePhoto: "http://101.42.232.70/image/268a7e05739dae21e1dc4cbcca6ede8f1702563383232925106.jpg",
    name: "高泽铭",
    slogan: "积极向上，到处睡觉",
    awards: "2023 ICPC 西安 银奖; 2023 ICPC 济南 铜奖;2023 CCPC 秦皇岛 铜奖;2023 CCPC 湘潭邀请赛 银奖;2023 ICPC 西安邀请赛 铜奖",
    codeForces: "https://codeforces.com/profile/gameboygzm",
  },
  {
    profilePhoto: "http://101.42.232.70/image/8a382dc33b7cb51d0118ff4eacef5c091702563708300740602.jpg",
    name: "戴铃涛",
    slogan: "做难事必有所得",
    awards: "2023 ICPC 杭州 银奖;2023 ICPC 西安 铜奖",
    codeForces: "https://codeforces.com/profile/1533050560",
  },
  {
    profilePhoto: "http://101.42.232.70/image/d784aab1e9dc9a9dc6dd2874ae4f43ea1702563701136748819.jpg",
    name: "林昊",
    slogan: "积极向上，到处睡觉",
    awards: "2023 ICPC 西安 银奖; 2023 ICPC 济南 铜奖;2023 CCPC 秦皇岛 铜奖;2023 CCPC 湘潭邀请赛 银奖;2023 ICPC 西安邀请赛 铜奖",
    codeForces: "https://codeforces.com/profile/Llinhao",
  },
  {
    profilePhoto: "http://101.42.232.70/image/15b19b3487c78db82227f6e23471e5461702564922339328955.jpg",
    name: "翟智伟",
    slogan: "你！真！棒！",
    awards: "2023 ICPC 杭州 银奖;2023 ICPC 西安 铜奖",
    codeForces: "https://codeforces.com/profile/Radiaa",
  },
  {
    profilePhoto: "http://101.42.232.70/image/0cabaa7df372ab197830e5f33bf9fd4c1702615248064311977.png",
    name: "万祎博",
    slogan: "积极向上，到处睡觉",
    awards: "2023 ICPC 西安 银奖; 2023 ICPC 济南 铜奖;2023 CCPC 秦皇岛 铜奖;2023 CCPC 湘潭邀请赛 银奖;2023 ICPC 西安邀请赛 铜奖",
    codeForces: "https://codeforces.com/profile/wa_OIers",
  },
  // {
  //   profilePhoto: "",
  //   name: "",
  //   slogan: "",
  //   awards: "",
  //   codeForces: "",
  // },
]);

</script>

<template>
  <el-container class="Top Bottom Main">
    <el-main class="Container">
      <div class="Title">
        <el-tabs
          :tab-position="tabPosition"
          class=""
        >
          <el-tab-pane class="" label="优秀 xcpcers">
            <el-row style="margin: 0 0 0 20px;" :gutter="12">
              <el-col
                v-for="(item, index) in excellentXcpcers"
                :key="item"
                :span="6"
                style="margin-bottom: 12px;"
              >
                <el-card
                  :body-style="{ padding: '0px' }"
                  shadow="hover"
                >
                  <img
                    :src=item.profilePhoto
                    class="image"
                  />
                  <div style="padding: 12px">
                    <p class="FontSize17">{{ item.name }}</p>
                    <p
                      class="FontSize14"
                      style="margin-top: 8px;"
                    >{{ item.slogan }}</p>
                      <el-tag
                        v-for="major in item.awards.split(/;/)"
                        :key="major"
                        style="margin-top: 0px;"
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