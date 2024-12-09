<template>
  <el-container
    direction="vertical"
    style="padding-top: 10px"
    class="travel-detail"
  >
    <div class="flex summary wp-100">
      <div class="flex">
        <el-image :src="travelItem?.cover" class="cover"></el-image>
        <div class="summary-info">
          <h3>{{ travelItem?.title }}</h3>
          <div>{{ travelItem?.date }}</div>
          <div>数量：{{ resources.total }}</div>
        </div>
      </div>

      <div class="op">
        <el-button
          @click="onAddResource"
          size="large"
          type="primary"
          class="btn-add"
          >添加资源</el-button
        >
        <auto-clip
          :urls="mediaList"
          :travel-item="travelItem"
          v-if="travelItem"
        ></auto-clip>
      </div>
    </div>
    <el-divider> </el-divider>
    <div v-if="travelItem?.works && travelItem.works.length > 0">
      <h2>作品</h2>
      <div class="flex-w-c">
        <div v-for="(item, index) in travelItem.works" :key="index">
          <video :src="item.url" controls class="video"></video>
          <div>{{ item.title }}</div>
        </div>
      </div>
      <el-divider></el-divider>
    </div>

    <h2>素材</h2>
    <div
      class="infinite-list-wrapper resources flex"
      style="overflow: auto"
      v-infinite-scroll="getMore"
      :infinite-scroll-delay="200"
      :infinite-scroll-disabled="state.disabledLoadMore"
      :infinite-scroll-immediate="false"
    >
      <div
        v-for="(item, index) in resources.list"
        :key="item.id"
        class="resource"
        @click="onPreview(index)"
      >
        <el-image
          v-if="isVideoOrAudio(item.url)"
          :src="videoImg"
          fit="cover"
          class="image"
        >
        </el-image>
        <el-image v-else :src="item.url" fit="cover" class="image"></el-image>
        <Actions
          style="position: absolute; right: 5px; top: 5px"
          :item="item"
          @delete="onDelSuccess"
        ></Actions>
        <div>
          <div>{{ item.title }}</div>
        </div>
      </div>
    </div>
  </el-container>
  <MediaViewer
    :url-list="mediaList"
    v-if="previewParams.show"
    :initial-index="previewParams.initialIndex"
    @close="onClosePreview"
  >
  </MediaViewer>
  <el-dialog
    center
    v-model="state.dialog"
    title="资源上传"
    v-if="state.dialog"
    @close="onCloseUpload"
    width="60vw"
  >
    <div>
      <Upload
        multiple
        :auto-upload="false"
        v-model:file-list="fileList"
        :on-success="onUploadSuccess"
        ref="refUpload"
        @custom-remove-file="onRemoveFile"
        :accept="ACCEPTS"
        oss-base="travel"
      />
      <div>
        <el-button @click="onUpload" type="primary">上传</el-button>
        <el-button @click="onCloseUpload">关闭</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, computed } from "vue";
import {
  EnumResouceType,
  PagerParams,
  ResourceItem,
  TravelItem,
} from "@/types/service";
import { ElMessage, UploadFile } from "element-plus";
import { getItemById } from "@/api/travel";
import { addItem, getItems as getResourceItems } from "@/api/resource";
import { useRoute } from "vue-router";
import Upload from "@/components/upload/MultiUpload.vue";
import MediaViewer from "@/components/media-viewer/index.vue";
import { Video_Suffix, Image_Suffix, COMMON_AUDIO_SUFFIX } from "@/const/index";
import { isVideoOrAudio } from "@/utils/media";
import videoImg from "@/assets/images/video.jpg";
import AutoClip from "./AutoClip.vue";
import Actions from "./Actions.vue";

const ACCEPTS = [...Image_Suffix, ...Video_Suffix, COMMON_AUDIO_SUFFIX].join(
  ","
);

const props = defineProps<{
  travelId: number | undefined;
}>();

const state = reactive<{
  loading: boolean;
  dialog: boolean;
  disabledLoadMore: boolean;
}>({
  loading: false,
  dialog: false,
  disabledLoadMore: false,
});

const pagerParams = reactive<PagerParams>({
  pageNum: 1,
  pageSize: 1000,
});

const previewParams = reactive<{
  show: boolean;
  initialIndex: number;
}>({
  show: false,
  initialIndex: 0,
});

const travelItem = ref<TravelItem>();

const resources = reactive<{
  total: number;
  list: ResourceItem[];
}>({
  total: 0,
  list: [],
});

const fileList = ref<UploadFile[]>();
const refUpload = ref<typeof Upload>();

const route = useRoute();
const travelId = props.travelId || +route.params.id!;

async function getTravelItem() {
  try {
    const res = await getItemById(travelId);
    if (!res || res.code != 0) return;

    travelItem.value = res.data;
  } catch (err) {
    ElMessage.error("查询旅行信息失败");
  }
}

async function getMore() {
  pagerParams.pageNum++;
  getResourceList();
}

async function getResourceList() {
  try {
    const res = await getResourceItems({
      travelId,
      ...pagerParams,
    });
    if (!res || res.code != 0) return;

    const list = res.data?.list || [];

    if (pagerParams.pageNum === 1) {
      resources.list = list;
    } else {
      resources.list = resources.list.concat(list);
    }

    resources.total = res.data?.total || 0;
    state.disabledLoadMore = list.length < pagerParams.pageSize;
  } catch (err) {
    ElMessage.error("查询旅行资源失败");
  }
}

function onDelSuccess(id: number) {
  const r = resources.list.filter((it) => it.id !== id);
  resources.list = r;
}

function onAddResource() {
  state.dialog = true;
}

function onUploadSuccess(
  response: any,
  uploadFile: UploadFile,
  uploadFiles: UploadFile[]
) {
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

function onUpload() {
  refUpload.value!.refUpload.submit();
}

function onRemoveFile(file: UploadFile) {
  if (!fileList.value) return;

  const index = fileList.value.findIndex((f) => f.uid == file.uid);
  if (index != -1) {
    fileList.value.splice(index, 1);
  }
}

onMounted(() => {
  getTravelItem();
  getResourceList();
});

const mediaList = computed(() => {
  return resources.list.map((it) => ({
    title: it.title,
    url: it.url,
  }));
});

function onCloseUpload() {
  state.dialog = false;
  fileList.value = [];
  pagerParams.pageNum = 1;
  getResourceList();
  getTravelItem();
}

function onPreview(index: number) {
  if (mediaList.value.length === 0)
    return ElMessage.warning(`该旅行暂无媒体资源`);

  previewParams.show = true;
  previewParams.initialIndex = index;
}

function onClosePreview() {
  previewParams.show = false;
  previewParams.initialIndex = 0;
}
</script>

<style lang="scss" scoped>
.summary {
  position: relative;

  .summary-info {
    text-align: left;
    display: flex;
    // align-items: center;
    justify-content: center;
    flex-direction: column;
    margin-left: 10px;
  }

  .cover {
    height: 100px;
  }

  .op {
    position: absolute;
    right: 20px;
  }
}

.infinite-list-wrapper {
  min-height: 40vh;
  // height: calc(100vh - 280px);
}

.video {
  margin: 10px;
  max-width: 300px;
}

.resources {
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  .resource {
    margin: 20px;
    position: relative;

    .image {
      width: 200px;
      height: 160px;
    }
  }
}
</style>
