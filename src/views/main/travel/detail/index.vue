<template>
  <el-container direction="vertical" style="padding-top: 10px" class="travel-detail">
    <div class="flex summary wp-100">
      <div class="flex">
        <el-image :src="travelItem?.cover" class="cover"></el-image>

        <div class="summary-info">
          <h3>{{ travelItem?.title }}</h3>
          <div>{{ travelItem?.date }}</div>
          <div>数量：{{ oriResources.total }}</div>
        </div>
      </div>

      <div class="op">
        <el-button @click="onAddResource" size="large" type="primary" class="btn-add"
          >添加资源</el-button
        >
        <auto-clip
          :urls="mediaUrls"
          :travel-item="travelItem"
          v-if="travelItem"
        ></auto-clip>

        <ActionFs :travel-item="travelItem" v-if="travelItem"></ActionFs>
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
        v-for="(item, index) in mediaList"
        :key="item.id"
        class="resource"
        @click="onPreview(index)"
      >
        <el-image
          v-if="item.type === 'video' || item.type === 'audio'"
          :src="videoImg"
          fit="cover"
          class="image"
        >
        </el-image>
        <el-image v-else :src="item.url" fit="cover" class="image"></el-image>
        <Actions
          v-if="travelItem"
          :travel="travelItem"
          style="position: absolute; right: 5px; top: 5px"
          :item="item"
          @delete="onDelSuccess"
          @refresh="getTravelItem"
        ></Actions>
        <div>
          <div>{{ item.title }}</div>
        </div>
      </div>
    </div>
    <BottomBack />
  </el-container>
  <MediaViewer
    :url-list="preMediaList"
    v-if="previewParams.show"
    :initial-index="previewParams.initialIndex"
    @close="onClosePreview"
    hideOnClickModal
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
      <el-scrollbar max-height="80vh">
        <Upload
          multiple
          :auto-upload="false"
          v-model:file-list="fileList"
          :on-success="onUploadSuccess"
          ref="refUpload"
          @custom-remove-file="onRemoveFile"
          :accept="ACCEPTS"
          :oss-base="ossBase"
        />
      </el-scrollbar>
      <div class="center" style="margin-top: 10px">
        <el-button @click="onUpload" type="primary">上传</el-button>
        <el-button @click="onCloseUpload">关闭</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, computed } from "vue";
import { EnumResourceType, PagerParams, ResourceItem, TravelItem } from "@/types/service";
import { ElMessage, UploadFile } from "element-plus";
import { getItemById } from "@/api/travel";
import { addItem, getItems as getResourceItems } from "@/api/resource";
import { useRoute } from "vue-router";
import Upload from "@/components/upload/MultiUpload.vue";
import MediaViewer from "@/components/media-viewer/index.vue";
import { Video_Suffix, Image_Suffix, COMMON_AUDIO_SUFFIX } from "@/const/index";
import { getMediaType, isVideoOrAudio } from "@/utils/media";
import videoImg from "@/assets/images/video.jpg";
import AutoClip from "./AutoClip.vue";
import Actions from "./Actions.vue";
import BottomBack from "@/components/BottomBack.vue";
import ActionFs from "./Action-fs.vue";
import { uuidv4 } from "@/utils/uuid";
import { createOSSClient } from "@/utils/ali-oss";

const ACCEPTS = [...Image_Suffix, ...Video_Suffix, COMMON_AUDIO_SUFFIX].join(",");

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

const oriResources = reactive<{
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

function transItems(items: ResourceItem[]): ResourceItem[] {
  return items.map((it) => {
    return {
      ...it,
      type: getMediaType(it.url),
      url: `${it.url}?x-oss-process=image/resize,w_300/quality,Q_80`,
    };
  });
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
      oriResources.list = list;
    } else {
      oriResources.list = oriResources.list.concat(list);
    }

    oriResources.total = res.data?.total || 0;
    state.disabledLoadMore = list.length < pagerParams.pageSize;
  } catch (err) {
    ElMessage.error("查询旅行资源失败");
  }
}

function onDelSuccess(id: number) {
  const r = oriResources.list.filter((it) => it.id !== id);
  oriResources.list = r;
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
    type: EnumResourceType.Image,
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
  createOSSClient();
});

const preMediaList = computed(() => {
  return oriResources.list.map((it) => ({
    title: it.title,
    url: `${it.url}?x-oss-process=image/quality,Q_25`,
  }));
});

const mediaList = computed(() => {
  return transItems(oriResources.list);
});

const mediaUrls = computed(() => {
  return oriResources.list.map((it) => it.url);
});

function onCloseUpload() {
  state.dialog = false;
  fileList.value = [];
  pagerParams.pageNum = 1;
  getResourceList();
  getTravelItem();
}

function onPreview(index: number) {
  if (preMediaList.value.length === 0) return ElMessage.warning(`该旅行暂无媒体资源`);

  previewParams.show = true;
  previewParams.initialIndex = index;
}

function onClosePreview() {
  previewParams.show = false;
  previewParams.initialIndex = 0;
}

const ossBase = computed(() => {
  if (!travelItem.value) return "travel";
  return `travel/${travelItem.value.title}-${travelItem.value.id || ""}`;
});
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
