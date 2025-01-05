<template>
  <el-dialog :v-model="true" title="提交合成任务">
    <el-form :model="fromState" :initialValues="initValue" ref="formRef">
      <el-form-item name="fileName" label="文件名" :rules="[{ required: true }]">
        <a-input v-model:value="fromState.fileName" />
      </el-form-item>
      <el-form-item name="format" label="格式" :rules="[{ required: true }]">
        <el-select v-model:value="fromState.format">
          <template v-for="f in supportedFormats" :key="f">
            <el-select-option>{{ f }}</el-select-option>
          </template>
        </el-select>
      </el-form-item>
      <el-form-item name="ossBucket" label="存储地址" :rules="[{ required: true }]">
        <template v-if="storageList.length > 0">
          <el-select v-model:value="fromState.ossBucket">
            <el-select-item :value="storageItem.value">{{
              storageItem.label
            }}</el-select-item>
          </el-select>
        </template>
        <template v-else>
          <!-- 一般不需要给用户填写，直接在代码里指定存储地址即可 -->
          <a-input
            v-model:value="fromState.ossBucket"
            placeholder="http://example-bucket.oss-cn-shanghai.aliyuncs.com/"
          />
        </template>
      </el-form-item>
      <el-form-item name="resolution" label="分辨率" :rules="[{ required: true }]">
        <el-select @change="handleResolutionChange" v-model:value="fromState.resolution">
          <template v-for="r in resolutions" :key="r.width">
            <el-select-option :value="r.width">{{ r.label }}</el-select-option>
          </template>
        </el-select>
      </el-form-item>
      <el-form-item name="bitrate" label="码率">
        <a-input v-model:value="fromState.bitrate" />
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive,onMounted } from "vue";
import {requestGet} from '../utils';
import get from 'lodash/get';
import {
  resolutionMap,
  supportedFormats,
  OSS_BUCKET_LOCAL_STORAGE_KEY,
} from "../const";

const formRef = ref();
const storageList = ref<{label:string,value: string}[]>([]);
const { aspectRatio, recommend } = defineProps(["aspectRatio", "recommend"]);
const emit = defineEmits(["submit", "close"]);
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
let fromState = reactive({
  fileName: "",
  format: "",
  ossBucket: "",
  resolution: 0,
  bitrate: 0,
});

const initValue = {
  format: "mp4",
  resolution: `${resolutions[0].width}`,
  bitrate: resolutions[0].bitrate,
  ossBucket: window.localStorage.getItem(OSS_BUCKET_LOCAL_STORAGE_KEY) || "",
};

const handleResolutionChange = (value: ) => {
  const target = resolutions.find((r) => r.width === Number(value));
  if (target) {
    fromState.bitrate = target.bitrate;
  }
};

const fetchStorageList =  async ()=>{
    const storageListReq = await requestGet("GetStorageList");
    const list =  get(storageListReq,'data.StorageInfoList',[]);
    storageList.value = list.map((item: any)=>{
       return {
         label: `${item.StorageLocation}`,
         value: `${item.StorageType === 'vod_oss_bucket'?'vod':'http'}://${item.StorageLocation}`,
       };
    });
  } ;

const handleSubmit = async () => {
  try {
    await formRef.value.validate();
  } catch (ex) {
    return;
  }
  debugger
  const { fileName, format, ossBucket, resolution, bitrate } = fromState;
  const target = resolutions.find((r) => r.width === Number(resolution));
  window.localStorage.setItem(OSS_BUCKET_LOCAL_STORAGE_KEY, ossBucket);
  emit("submit", {
    fileName,
    format,
    ossBucket,
    bitrate,
    resolution: [target.width, target.height],
  });
};

onMounted(() => {
  fetchStorageList();
});
</script>
