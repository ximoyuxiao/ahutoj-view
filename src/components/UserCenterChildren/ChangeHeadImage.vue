<template>
  <div class="changeHeadImage">
    <div class="title" style="height: 30px">
      修改头像
    </div>
    <el-icon class="close cursor_pointer" size="30px" @click="props.close(11)">
      <CircleClose />
    </el-icon>
    <div class="uploadImage">
      <div class="preview">
        <div class="originImage">
          <div class="img">
            <img v-if="headImage.originImageBlobURL" :src="headImage.originImageBlobURL">
            <el-icon size="42px" v-else>
              <SemiSelect />
            </el-icon>
          </div>
          <div class="hint">原始图片</div>
          <div class="hint">{{ headImage.originImageBlobURL ? (headImage.originImage?.size / 1024).toFixed(2) + "KB" : "" }}
          </div>
        </div>
        <div class="compressResult">
          <div class="compressPercent">{{ headImage.compressedImageBlobURL ? "压缩率：" + headImage.compressPercent + "%" :
            "" }}</div>
          <el-divider />
          <div> 压缩后最大支持100KB大小图片</div>
        </div>
        <div class="compressedImage">
          <div class="img">
            <img v-if="headImage.compressedImageBlobURL" :src="headImage.compressedImageBlobURL">
            <el-icon size="42px" v-else>
              <SemiSelect />
            </el-icon>
          </div>
          <div class="hint">自动压缩</div>
          <div class="hint">{{ headImage.compressedImageBlobURL ? (headImage.compressedImage?.size / 1024).toFixed(2) +
            "KB" : "" }}</div>
        </div>
      </div>
      <el-upload ref="upload" class="upload" :limit="1" :auto-upload="false" :show-file-list="false"
        :on-change="headImage.selectImage">
        <template #trigger>
          <div class="btn cursor_pointer">
            <el-icon>
              <FolderOpened />
            </el-icon>
            &nbsp;选择图片
          </div>
        </template>
        <div class="btn  cursor_pointer" @click="headImage.uploadHeadImage">
          <el-icon>
            <Upload />
          </el-icon>
          &nbsp;确定
        </div>
      </el-upload>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { getCurrentInstance, onMounted, reactive } from "vue";
import { useThemeSwitchStore } from "../../pinia/themeSwitch";
import { useUserDataStore } from "../../pinia/userData";
import {
  FileConvertor,
  ImageFileUploadUtils,
  ImageFileUtils,
} from "../../utils/fileUtils";
const { proxy } = getCurrentInstance() as any;
const userDataStore = useUserDataStore();

const props = defineProps(["userInfo", "close"]);

var headImage = reactive({
  loading: null,
  //原始图片
  originImage: null,
  originImageBlobURL: "",
  //压缩后的图片
  compressedImage: null,
  compressedImageBlobURL: "",
  //压缩率
  compressPercent: "",
  //上传后的图片地址
  newHeadURL: "",
  //选择图片后
  selectImage: (imageObject: any) => {
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedMimeTypes.includes(imageObject.raw.type)) {
      proxy.elMessage({ message: "请选择有效的图片文件", type: "error" });
      proxy.$refs.upload.clearFiles();
      return;
    }
    headImage.loading = proxy.elLoading({
      node: document.getElementsByClassName("changeHeadImage")[0],
    });
    proxy.$refs.upload.clearFiles();

    let image = imageObject.raw;
    ImageFileUtils.userHeadImageCompress(image).then((res: any) => {
      let compressedImage = res.data;
      headImage.originImageBlobURL = FileConvertor.file2Blob(image);
      headImage.compressedImageBlobURL =
        FileConvertor.file2Blob(compressedImage);
      headImage.originImage = image;
      headImage.compressedImage = compressedImage;
      headImage.compressPercent = (
        ((headImage.originImage.size - headImage.compressedImage.size) /
          headImage.originImage.size) *
        100
      ).toFixed(2);
      headImage.loading.close();
    });
  },
  //点击上传
  uploadHeadImage: () => {
    if (!headImage.originImageBlobURL || !headImage.compressedImageBlobURL) {
      proxy.elMessage({ message: "请选择图片", type: "error" });
      return;
    }
    ImageFileUploadUtils.uploadUserHeadImage(headImage.compressedImage).then(
      (res: any) => {
        let data = res.data;
        if (data.code == 0) {
          //修改成功
          props.close(11);
          props.userInfo.HeadURL = data.ImageURL;
          proxy.elMessage({ message: "修改成功", type: "success" });
        }
        proxy.codeProcessor(
          data?.code ?? 100001,
          data?.msg ?? "服务器错误\\\\error"
        );
      }
    );
  },
});

onMounted(() => {
  // console.log(props.userInfo);
});
</script>

<style lang="scss" scoped>
.changeHeadImage {
  position: relative;
  margin-top: $modelDistance;
  padding: 12px 50px 12px 40px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  border-radius: 12px;
  @include box_shadow(0, 0, 8px, 1px, "fill52");

  &:hover {
    @include fill_color("fill2");
    @include box_shadow(0, 0, 8px, 1px, "fill51");
  }

  >.title {
    @include font_color("font1");
    font-size: $fontSize8;
    letter-spacing: 1px;
    display: flex;
    min-width: 100%;
    margin: 5px 0;

    span {
      width: 60px;
    }
  }

  >.close {
    position: absolute;
    right: 10px;
    top: 10px;
    @include font_color("font3");

    &:hover {
      @include font_color("font1");
    }
  }

  >.uploadImage {
    width: 100%;
    display: flex;
    flex-direction: column;

    >.preview {
      display: flex;
      @include font_color("font2");

      >div {
        margin: 15px;
        display: flex;
        flex-direction: column;
        align-items: center;

        >.img {
          height: $userCenter_UserHeadImageSide;
          width: $userCenter_UserHeadImageSide;
          border-radius: 12px;
          @include box_shadow(0, 0, 2px, 1px, "font2");
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;

          >img {
            width: 100%;
            height: 100%;
            max-width: 100%;
            max-height: 100%;
          }
        }
      }

      >.compressResult {
        margin: 0;
        height: inherit;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        >div {
          margin: 0;
        }

        >.compressPercent {
          @include font_color("fill21");
        }
      }
    }

    >.upload {
      display: flex;

      >div {
        margin: 12px;
      }
    }
  }

  .btn {
    position: relative;
    overflow: hidden;
    margin: 8px 0;
    width: 200px;
    height: 40px;
    border-radius: 12px;
    font-size: $fontSize5;
    @include font_color("font1");
    letter-spacing: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    @include box_shadow(0, 0, 2px, 1px, "border2");
    transition-duration: 200ms;

    &:hover {
      @include box_shadow(0, 0, 2px, 1px, "fill12");
      @include fill_color("fill15");
    }
  }
}
</style>