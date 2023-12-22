<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { useThemeSwitchStore } from "../pinia/themeSwitch";
import MdEditor from "md-editor-v3";
import "md-editor-v3/lib/style.css";
const tabPosition = ref('left')
const themeSwitchStore = useThemeSwitchStore();

import data_excellentXcpcers from '../assets/json/excellentXcpcers.json';
import data_graduatedXcpcers from '../assets/json/graduatedXcpcers.json';
import data_excellentGraduatedXcpcers from '../assets/json/excellentGraduatedXcpcers.json';

const excellentXcpcers = ref([]);
const graduatedXcpcers = ref([]);
const excellentGraduatedXcpcers = ref([]);

onMounted(() => {
  excellentXcpcers.value = data_excellentXcpcers;
  graduatedXcpcers.value = data_graduatedXcpcers;
  excellentGraduatedXcpcers.value = data_excellentGraduatedXcpcers;
});

</script>

<template>
  <el-container class="Top Bottom Main">
    <el-main class="Container">
      <div class="Title">
        <el-tabs
          :tab-position="tabPosition"
          class=""
        >
          <el-tab-pane
            class=""
            label="在役优秀 Xcpcers"
          >
            <el-row
              style="margin: 0 0 0 0px;"
              :gutter="12"
            >
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
          <el-tab-pane label="往届优秀 Xcpcers">
            <!-- <el-descriptions
              class="margin-top"
              title="With border"
              :column="3"
              :size=""
              border
              v-for="(item) in "
            > -->
            <el-descriptions
              class="margin-top"
              :column="3"
              border
              v-for="(item) in data_excellentGraduatedXcpcers"
              style="margin: 24px 0 0 0;"
            >
              <el-descriptions-item>
                <template #label>
                  <div class="cell-item NoWrap">
                    <el-icon>
                      <user />
                    </el-icon>
                    姓名
                  </div>
                </template>
                {{ item.Name }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template #label>
                  <div class="cell-item NoWrap">
                    <el-icon>
                      <office-building />
                    </el-icon>
                    单位
                  </div>
                </template>
                {{ item.Company }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template #label>
                  <div class="cell-item NoWrap">
                    职位/职称
                  </div>
                </template>
                {{ item['Position/Title'] }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template #label>
                  <div class="cell-item NoWrap">
                    <!-- <el-icon><Timer /></el-icon> -->
                    毕业年份
                  </div>
                </template>
                {{ item.GraduationYear }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template #label>
                  <div class="cell-item NoWrap">
                    <!-- <el-icon>
                      <ChatLineSquare />
                    </el-icon> -->
                    寄语
                  </div>
                </template>
                {{ item.Greetings }}
              </el-descriptions-item>
            </el-descriptions>
          </el-tab-pane>
          <el-tab-pane label="退役 Xcpcers">
            <el-table
              :data="graduatedXcpcers"
              stripe
            >
              <el-table-column
                prop="Name"
                label="姓名"
                align="center"
                width="120"
              />
              <el-table-column
                prop="GraduationYear"
                label="毕业年份"
                align="center"
                width="120"
              />
              <el-table-column
                prop="City"
                label="工作城市"
                align="center"
                width="120"
              />
              <el-table-column
                prop="Company"
                label="单位"
                align="center"
              />
              <el-table-column
                prop="Position/Title"
                label="职务/职称"
                align="center"
              />
            </el-table>
          </el-tab-pane>
          <!-- <el-tab-pane label=""></el-tab-pane> -->
          <!-- <el-tab-pane label=""></el-tab-pane> -->
          <!-- <el-tab-pane
            label="OJ 信息"
            stripe
          >
          </el-tab-pane> -->
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