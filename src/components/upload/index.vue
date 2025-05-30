<template>
  <el-upload
    ref="refUpload"
    v-bind="attrs"
    :http-request="httpRequest"
    :on-exceed="handleExceed"
    drag
    accept="image/jpeg,image/png,image/gif,video/mp4,video/x-m4v,video/quicktime"
    :before-upload="beforeAUpload"
    :on-error="handleOnError"
  >
    <el-button type="primary">点击选择文件</el-button>
    <template #tip>
      <div class="el-upload__tip">jpg/png文件，单个文件最大100M</div>
    </template>
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
import { UploadProps } from "element-plus";
import { ref, onMounted, useAttrs } from "vue";
import OSS from "ali-oss";
import { createOSSClient, getOSSClient } from "@/utils/ali-oss";
import { uuidv4 } from "@/utils/uuid";
import UploadAjaxError from "@/utils/UploadAjaxError";

const attrs = useAttrs();

let client: OSS;

const refUpload = ref<UploadInstance>();

function buildName(fileName: string) {
  return `${attrs.dir || ""}/${uuidv4()}-${fileName}`;
}

function httpRequest(options: UploadRequestOptions) {
  const ossClient = getOSSClient();
  if (!ossClient)
    return options.onError(new UploadAjaxError("上传组件初始化失败", 0, "post", ""));

  const file = options.file;
  ossClient
    .put(buildName(file.name), file)
    .then((res) => {
      if (res && res.res.status == 200) {
        return options.onSuccess(res.url);
      }

      // message: string, status: number, method: string, url: string
      options.onError(
        new UploadAjaxError("文件上传失败", res?.res.status || 0, "post", "")
      );
    })
    .catch((err) => {
      options.onError(
        new UploadAjaxError((err && err.message) || "文件上传失败", 500, "post", "")
      );
    });
}

const emits = defineEmits(["close", "ok"]);

const handleExceed: UploadProps["onExceed"] = (files, uploadFiles) => {
  ElMessage.error(`超过了文件上传数量`);
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
}
</style>
