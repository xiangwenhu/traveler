
<template>
  <el-container>
    <div>
      <el-button @click="onAddResource">添加素材</el-button>
    </div>
  </el-container>
  <el-dialog v-model="state.dialog">
    <div>
      <upload
        :auto-upload="false"
        v-model:file-list="fileList"
        @on-chang="onFileChange"
        ref="uploadRef"
      />
      <div>
        <el-button @click="onUpload">上传</el-button>
      </div>
    </div>
  </el-dialog>
</template>


<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { EnumResouceType, ResourceItem, TravelItem } from "@/types/service";
import { ElMessage, UploadFile, UploadInstance } from "element-plus";
import { getItemById } from "@/api/travel";
import { addItem } from "@/api/resource";

import { useRoute } from "vue-router";
import upload from "@/components/upload/index.vue";

const state = reactive<{
  loading: boolean;
  dialog: boolean;
}>({
  loading: false,
  dialog: false,
});

const item = ref<TravelItem>();

const fileList = ref<UploadFile[]>();
const uploadRef = ref<UploadInstance>();

const route = useRoute();
const travelId = +route.params.id!;

async function getItem() {
  try {
    const res = await getItemById(travelId);
    if (!res || res.code != 0) return;

    item.value = res.data;
  } catch (err) {
    ElMessage.error("查询");
  }
}

function onAddResource() {
  state.dialog = true;
}

function onFileChange(uploadFile: UploadFile, uploadFiles: UploadFile[]) {
  if (uploadFile.status === "success") {
    const item: ResourceItem = {
      travelId,
      type: EnumResouceType.Image,
      url: uploadFile.response as string,
      duration: 0,
      title: uploadFile.raw!.name,
      size: 0,
      width: 0,
      height: 0,
    };

    addItem(item);
  }
}

function onUpload() {
  uploadRef.value!.submit();
}

onMounted(() => {
  getItem();
});
</script>