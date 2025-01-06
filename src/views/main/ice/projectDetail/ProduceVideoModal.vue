<template>
  <el-dialog v-model="dialogVisible" title="提交合成任务" append-to-body @close="onClose" >
    <el-form :model="fromData" ref="formRef" :rules="rules" label-width="120" size="large">
      <el-form-item name="fileName" label="文件名" required>
        <el-input v-model="fromData.fileName" />
      </el-form-item>
      <el-form-item name="format" label="格式" required>
        <el-select v-model="fromData.format">
          <el-option
            v-for="f in supportedFormats"
            :key="f"
            :label="f"
            :value="f"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item name="resolution" label="分辨率" required>
        <el-select @change="handleResolutionChange" v-model="fromData.resolution">
          <el-option :value="r.width" v-for="r in resolutions" :key="r.width" :label="r.label"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item name="bitrate" label="码率">
        <el-input v-model:value="fromData.bitrate" />
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="onClose" size="large">关闭</el-button>
        <el-button type="primary" @click="handleSubmit" size="large">提交作业 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from "vue";
import { requestGet } from "../utils";
import get from "lodash/get";
import { resolutionMap, supportedFormats, OSS_BUCKET_LOCAL_STORAGE_KEY } from "../const";
import { FormRules } from "element-plus";

const dialogVisible = ref(true);

const rules: FormRules = {
  fileName: [
    {
      required: true,
      message: "请输入文件名",
      trigger: "blur",
    },
  ],
  format: [
    {
      required: true,
      message: "请选择文件格式",
      trigger: "blur",
    },
  ],
  resolution: [
    {
      required: true,
      message: "请选择分辨率",
      trigger: "blur",
    },
  ],
};

const formRef = ref();
const storageList = ref<{ label: string; value: string }[]>([]);
const { aspectRatio, recommend } = defineProps(["aspectRatio", "recommend"]);
const emits = defineEmits(["submit", "close"]);
const confirmLoading = ref(false);
let resolutions = resolutionMap[aspectRatio] || [];
if (recommend && recommend.width && recommend.height) {
  // 根据 WebSDK 传入的预览比例来决定合成的宽高
  const fromRecommend = {
    label: `推荐分辨率 ${recommend.width} x ${recommend.height}`,
    width: recommend.width,
    height: recommend.height,
    bitrate: recommend.bitrate || 1500,
  };
  resolutions = [fromRecommend].concat(resolutions);
}
let fromData = reactive({
  fileName: "剪辑",
  format: "mp4",
  resolution: resolutions[0]?.width,
  bitrate: resolutions[0]?.bitrate,
});

const handleResolutionChange = (value: any) => {
  const target = resolutions.find((r: any) => r.width === Number(value));
  if (target) {
    fromData.bitrate = target.bitrate;
  }
};

const fetchStorageList = async () => {
  const storageListReq = await requestGet("GetStorageList");
  const list = get(storageListReq, "data.StorageInfoList", []);
  storageList.value = list.map((item: any) => {
    return {
      label: `${item.StorageLocation}`,
      value: `${item.StorageType === "vod_oss_bucket" ? "vod" : "http"}://${
        item.StorageLocation
      }`,
    };
  });
};

const handleSubmit = async () => {
  try {
    await formRef.value.validate();
  } catch (ex) {
    return;
  }
  const { fileName, format, resolution, bitrate } = fromData;
  const target = resolutions.find((r) => r.width === Number(resolution));
  emits("submit", {
    fileName,
    format,
    bitrate,
    resolution: [target.width, target.height],
  });
};

function onClose() {
  emits("close");
}

onMounted(() => {
  // fetchStorageList();
});
</script>
