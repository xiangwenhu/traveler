<template>
  <el-upload
    ref="refUpload"
    :http-request="httpRequest"
    :on-exceed="onExceed"
    list-type="picture-card"
    drag
    :before-upload="beforeAUpload"
    :on-error="handleOnError"
    accept="image/jpeg,image/png,image/gif,video/mp4,video/x-m4v,video/quicktime"
  >
    <el-icon><Plus /></el-icon>
    <template #tip>
      <div class="el-upload__tip">请选择视频/音频/图片，单个文件最大100M</div>
    </template>
    <template #file="{ file }">
      <el-image
        :src="file.url"
        class="el-upload-list__item-thumbnail"
        fit="contain"
        v-if="isImage(file.name)"
      ></el-image>
      <div v-else-if="isVideoOrAudio(file.name)">
        <video :src="file.url"></video>
      </div>
      <div v-else>
        {{ file.name }}
      </div>
      <span class="el-upload-list__item-actions">
        <span
          class="el-upload-list__item-preview"
          @click="onPictureCardPreview(file)"
          v-if="isImage(file.name) || isVideoOrAudio(file.name)"
        >
          <el-icon><zoom-in /></el-icon>
        </span>
        <span
          v-if="!disabled"
          class="el-upload-list__item-delete"
          @click="onRemove(file)"
        >
          <el-icon><Delete /></el-icon>
        </span>
      </span>

      <label class="el-upload-list__item-status-label" style="color: #fff">
        <el-icon><Check /> </el-icon>
      </label>
    </template>
    <el-dialog v-model="dialogVisible" v-if="dialogVisible" append-to-body center>
      <img
        w-full
        :src="dialogMediaUrl"
        alt="Preview Image"
        v-if="isImage(dialogFile?.name || '')"
      />
      <video
        v-else
        :src="dialogMediaUrl"
        alt="Preview Video or Audio"
        controls
        w-full
        style="max-height: 60vh"
      ></video>
    </el-dialog>
  </el-upload>
</template>

<script setup lang="ts">
import {
  ElMessage,
  FormInstance,
  FormRules,
  UploadFile,
  UploadInstance,
  UploadRequestOptions,
} from "element-plus";
import { UploadProps, ElUpload } from "element-plus";
import { ref, onMounted } from "vue";
import { getSTSToken } from "@/api/ali";
import { createOSSClient, getOSSClient } from "@/utils/ali-oss";
import { uuidv4 } from "@/utils/uuid";
import { Delete, Download, Plus, ZoomIn, Check } from "@element-plus/icons";
import { isImage, isVideoOrAudio } from "@/utils/media";

const props = defineProps({
  ossBase: {
    type: String,
    default() {
      return "";
    },
  },
});

const refUpload = ref<UploadInstance>();

defineExpose({
  refUpload,
});

const dialogMediaUrl = ref("");
const dialogFile = ref<UploadFile>();
const dialogVisible = ref(false);
const disabled = ref(false);

function httpRequest(options: UploadRequestOptions) {
  const ossClient = getOSSClient();
  if (!ossClient)
    return options.onError(new ElUpload.UploadAjaxError("上传组件初始化失败", 0, "post", ""));

  const file = options.file;

  const filename = `${uuidv4()}-${file.name}`;
  const fullFilename = props.ossBase ? `${props.ossBase}/${filename}` : filename;

  ossClient
    .put(fullFilename, file)
    .then((res) => {
      if (res && res.res.status == 200) {
        return options.onSuccess(res.url);
      }

      // message: string, status: number, method: string, url: string
      options.onError(
        new ElUpload.UploadAjaxError("文件上传失败", res?.res.status || 0, "post", "")
      );
    })
    .catch((err) => {
      options.onError(
        new ElUpload.UploadAjaxError((err && err.message) || "文件上传失败", 500, "post", "")
      );
      // options.onError(err);
    });
}

const emits = defineEmits(["close", "ok", "custom-remove-file"]);

const onExceed: UploadProps["onExceed"] = (files, uploadFiles) => {
  ElMessage.error(`超过了文件上传数量`);
};

const onRemove = (file: UploadFile) => {
  emits("custom-remove-file", file);
};

const onPictureCardPreview = (file: UploadFile) => {
  dialogFile.value = file;
  dialogMediaUrl.value = file.url!;
  dialogVisible.value = true;
};

const beforeAUpload: UploadProps["beforeUpload"] = (rawFile) => {
  if (rawFile.size / 1024 / 1024 > 100) {
    ElMessage.error("单个文件最大100M");
    return false;
  }
  return true;
};

function handleOnError(error: any, uploadFile: any, uploadFiles: any) {
  // 错误处理逻辑
  ElMessage.error({ message: `上传过程中遇到错误: ${error.message}`, duration: 5000 });
}

onMounted(() => {
  createOSSClient();
});
</script>

<style lang="scss" scoped>
.el-upload__tip {
  margin-left: 10px;
  min-height: 200px;
}
</style>
