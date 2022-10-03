<template>
  <div class="EditProblemJudgeFile">
    <el-upload
      class="uploadJson"
      drag
      accept=".zip,.in,.out"
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
  </div>
</template>

<script lang="ts" setup>
import qs from "qs";
import { getCurrentInstance, onMounted, reactive } from "vue";
const { proxy } = getCurrentInstance() as any;

function selectFile(e: any, fileList: any) {
  // console.log(fileList[0]);
  let file = new FormData();
  file.append("file", fileList[0].raw);

  proxy.$post("api/file/1000", file, 2).then((res: any) => {
    console.log(res);
  });
}

function removeFile() {}

onMounted(() => {});
</script>

<style scoped lang="scss">
.search {
  display: flex;
  justify-items: center;
  align-content: center;
  margin-bottom: 40px;
}

.table {
  width: 100%;

  > div {
    display: flex;
    align-content: center;
    box-sizing: border-box;
    margin: 5px 0;
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
</style>