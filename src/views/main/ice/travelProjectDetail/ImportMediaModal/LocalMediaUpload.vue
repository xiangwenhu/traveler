

<template>
  <div>
    <Upload
      multiple
      :auto-upload="false"
      v-model:file-list="fileList"
      :on-success="onUploadSuccess"
      ref="refUpload"
      @custom-remove-file="onRemoveFile"
      :accept="ACCEPTS"
      oss-base="ice-local-upload"
    />
    <div class="dialog-footer">
      <el-button @click="onClose">关闭</el-button>
      <el-button @click="onUpload" type="primary">上传</el-button>
      <el-button @click="onSubmit" type="primary" style="margin-left: 10px"
        >同步到项目</el-button
      >
    </div>
  </div>
</template>


<script setup lang="ts">
import { ElLoadingService, ElMessage, UploadFile } from "element-plus";
import { ref } from "vue";
import Upload from "@/components/upload/MultiUpload.vue";
import { COMMON_AUDIO_SUFFIX, Image_Suffix, Video_Suffix } from "@/const";
import { getFilenameWithoutExtension, getMediaType } from "@/utils/media";
import { batchRegisterMediasAddToProject } from "../../utils/travel";
import { RegisterMediaInfo, RegisterMediaType } from "@/api/ice";
import { GetEditingProjectMaterialsRes } from "@/types/ice";
import { delay } from "@/utils";

const ACCEPTS = [...Image_Suffix, ...Video_Suffix, COMMON_AUDIO_SUFFIX].join(
  ","
);
const fileList = ref<UploadFile[]>();
const refUpload = ref<typeof Upload>();

const sourceMedias = ref<(RegisterMediaInfo & { uid: number })[]>([]);

const emits = defineEmits(["submit", "close"]);

const props = defineProps<{
  projectId: string;
}>();

async function onUploadSuccess(
  response: any,
  uploadFile: UploadFile,
  uploadFiles: UploadFile[]
) {
  const url = uploadFile.response as string;
  const uid = uploadFile.uid;
  const fileName = getFilenameWithoutExtension(url);

  const info = {
    MediaType: getMediaType(url) as RegisterMediaType,
    Overwrite: true,
    InputURL: url,
    Title: fileName,
    uid,
  };
  sourceMedias.value.push(info);
}

function onUpload() {
  refUpload.value!.refUpload.submit();
}

function onRemoveFile(file: UploadFile) {
  if (!fileList.value) return;

  const index = fileList.value.findIndex((f) => f.uid == file.uid);
  if (index != -1) {
    fileList.value.splice(index, 1);
  }

  const indexS = sourceMedias.value.findIndex((s) => s.uid == file.uid);
  if (index != -1) {
    sourceMedias.value.splice(index, 1);
  }
}

async function onSubmit() {
  const loading = ElLoadingService({
    target: "dialog-ice-project",
    text: "资源同步中......"
  })
  try {
    if (sourceMedias.value.length === 0) return;

    const results = await batchRegisterMediasAddToProject(
      sourceMedias.value,
      props.projectId
    );

    await delay(3500)

    emits("submit", results);
  } catch (err: any) {
    ElMessage.error(`同步失败:${err && err.message}`);
  }finally {
    loading.close();
  }
}

function onClose() {
  emits("close");
}
</script>