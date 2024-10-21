<template>
  <el-upload
    ref="refUpload"
    :auto-upload="false"
    :http-request="httpRequest"
    :on-exceed="handleExceed"
  >
    <el-button type="primary">点击选择文件</el-button>
    <template #tip>
      <div class="el-upload__tip">jpg/png文件，单个文件最大50M</div>
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
import { reactive } from "vue";
import { ref } from "vue";
import OSS from "ali-oss";

let client: OSS;


async function initClient() {

    const res = await fetch("/api/ali/getSTSToken", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    }).then(res => res.json());

    client = new OSS({
        // yourRegion填写Bucket所在地域。以华东1（杭州）为例，yourRegion填写为oss-cn-hangzhou。
        region: "oss-cn-beijing",
        // 从STS服务获取的临时访问密钥（AccessKey ID和AccessKey Secret）。
        accessKeyId:  res.AccessKeyId,
        accessKeySecret: res.AccessKeySecret,
        // 从STS服务获取的安全令牌（SecurityToken）。
        stsToken: res.SecurityToken,
        // 填写Bucket名称。
        bucket: "traveler-traveler",
    });
}

initClient();


const refUpload = ref<UploadInstance>();

export declare class UploadAjaxError extends Error {
  name: string;
  status: number;
  method: string;
  url: string;
  constructor(message: string, status: number, method: string, url: string);
}

function httpRequest(options: UploadRequestOptions) {
  uploadAttachment({}, options.file)
    .then((res) => {
      if (res && res.code == 200) {
        return options.onSuccess(res.data);
      }

      // message: string, status: number, method: string, url: string
      options.onError(
        new UploadAjaxError("文件上传失败", res.code, "post", "")
      );
    })
    .catch((err) => {
      options.onError(
        new UploadAjaxError(
          (err && err.message) || "文件上传失败",
          500,
          "post",
          ""
        )
      );
    });
}



async function uploadFiles() {
  const files = getNeedUploadFiles();
  if (files.length == 0) return true;
  const alertId: number = props.item.alertId;
  const res = await uploadAttachment({ alertId }, files);
  if (!res || res.code !== 200)
    throw new Error(`文件上传失败：${res.msg || "未知错误"}`);
  return true;
}

const emits = defineEmits(["close", "ok"]);


const handleExceed: UploadProps["onExceed"] = (files, uploadFiles) => {
  ElMessage.error(`超过了文件上传数量`);
};

</script>
  
<style lang="scss" scoped>
.el-upload__tip {
  margin-left: 10px;
}
</style>
  