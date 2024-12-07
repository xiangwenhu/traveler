<template>
  <el-container direction="vertical" style="padding-top: 10px">
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
        <el-button
          @click="onSubmitMediaProducing"
          size="large"
          type="danger"
          class="btn-add"
          >一键成片</el-button
        >
      </div>
    </div>
    <el-divider> </el-divider>
    <div v-if="travelItem?.works && travelItem.works.length > 0">
      <h2>作品</h2>
      <div class="flex">
        <video
          v-for="(item, index) in travelItem.works"
          :key="index"
          :src="item.url"
          controls
          style="margin-left: 20px; width: 200px"
        ></video>
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
        <div>
          <div>{{ item.title }} {{ item.id }}</div>
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
import { ElLoading, ElMessage, UploadFile, UploadInstance } from "element-plus";
import { getItemById } from "@/api/travel";
import { addItem, getItems as getResourceItems } from "@/api/resource";
import { useRoute } from "vue-router";
import Upload from "@/components/upload/MultiUpload.vue";
import MediaViewer from "@/components/media-viewer/index.vue";
import { Video_Suffix, Image_Suffix, COMMON_AUDIO_SUFFIX } from "@/const/index";
import { isVideoOrAudio } from "@/utils/media";
import videoImg from "@/assets/images/video.jpg";
import {
  submitMediaProducing,
  submitTravelMediaProducing,
  TravelMediaProducingOptions,
} from "@/api/ice";
import { MediaProducingOptions } from "@/types/ice";
import { throttle } from "lodash";
import { delay } from "@/utils";

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
  return resources.list.map((it) => it.url);
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

const onSubmitMediaProducing = throttle(
  async function onSubmitMediaProducing() {
    const loadingEl = ElLoading.service({
      lock: true,
    });

    try {

      await delay(200);

      if (mediaList.value.length === 0)
        return ElMessage.error(`该旅行暂无媒体资源`);

      const data: TravelMediaProducingOptions = {
        travelId,
        video: {
          urls: mediaList.value,
          options: {
            mainTrack: true,
            imageDuration: 4,
            useTransition: true,
            transitionDuration: 1,
          },
        },
        bgMusic: {
          url: "https://traveler-traveler.oss-cn-beijing.aliyuncs.com/music/1c1c9684-0d30-4ce6-91d5-4c6973077182.mp3",
          options: {
            LoopMode: true,
          },
        },
        output: {
          FileName: `${travelItem.value?.title}.mp4`,
        },
        userData: {
          title: travelItem.value?.title,
        },
      };
      const res = await submitTravelMediaProducing(data);

      console.log("res:", res);
    } catch (err: any) {
      ElMessage.error(`提交失败：${err && err.message}`);
    } finally {
      loadingEl.close();
    }
  },
  5000,
  {
    trailing: false,
  }
);
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
  height: calc(100vh - 280px);
}

.resources {
  flex-wrap: wrap;
  .resource {
    margin: 20px;

    .image {
      width: 200px;
      height: 160px;
    }
  }
}
</style>
