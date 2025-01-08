<template>
  <div id="app" ref="containerRef" style="height: 100vh"></div>
  <SearchMediaModal
    :project-id="projectIdRef"
    @submit="onSearchMediaSubmit"
    @close="onSearchMediaClose"
    v-if="searchMediaShowRef"
  />

  <ProduceVideoModal
    :aspect-ratio="produceVideoRef.aspectRatio"
    :recommend="produceVideoRef.recommend"
    @submit="onProduceVideoSubmit"
    @close="onProduceVideoClose"
    v-if="produceVideoShowRef"
    :file-name="travelItem?.title"
  />
</template>
<script lang="ts" setup>
import { onMounted, onUnmounted, reactive, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { createEditor } from "../utils/editor";
import SearchMediaModal from "./SearchMediaModal.vue";
import ProduceVideoModal from "./ProduceVideoModal.vue";
import { ElLoadingService, ElMessage } from "element-plus";
import { requestPost } from "@/api/ice";
import { addItem } from "@/api/iceJob";
import { syncResourcesToICEProject } from "../utils/travel";
import { delay } from "@/utils";
import { TravelItem } from "@/types/service";

const ossUrl = import.meta.env.VITE_OSS_URL;

const route = useRoute();

const travelId = +route.params.travelId;

if (!travelId) ElMessage.error(`缺少参数travelId`);

const state = reactive({
  loading: true,
});

const containerRef = ref<HTMLDivElement | null>(null);
const editorRef = ref<{ destroy: () => void } | null>(null);
const projectIdRef = ref(route.params.projectId as string);
const searchMediaRef = ref({ resolve: (v: any) => {} });
const searchMediaShowRef = ref(false);
const travelItem = ref<TravelItem>();
const produceVideoRef = ref<{
  timeline: any;
  aspectRatio?: any;
  recommend?: any;
  resolve: () => void;
}>({ resolve: () => {}, timeline: {} });
const produceVideoShowRef = ref(false);
const myLocale = "zh-CN";

watch(
  () => route.params.projectId,
  (value) => {
    if (typeof value === "string") {
      projectIdRef.value = value;
    } else {
      projectIdRef.value = value[0];
    }
  }
);
const onSearchMediaSubmit = (res: any) => {
  searchMediaRef.value.resolve(res);
  searchMediaShowRef.value = false;
};
const onSearchMediaClose = () => {
  searchMediaShowRef.value = false;
};

const onProduceVideoSubmit = async ({ fileName, format, bitrate, resolution }: any) => {
  // 先根据 fileName 和 format 拼接出存储的 mediaURL

  let OutputMediaTarget = "oss-object";
  let StorageLocation;
  let FileName;
  let mediaURL = `${ossUrl}/works/${fileName}.${format}`;

  const [width, height] = resolution;
  try {
    const res = await requestPost("SubmitMediaProducingJob", {
      // https://help.aliyun.com/document_detail/197853.html
      OutputMediaConfig: JSON.stringify({
        mediaURL,
        bitrate,
        width,
        height,
        StorageLocation,
        FileName,
      }),
      OutputMediaTarget,
      ProjectId: projectIdRef.value,
      Timeline: JSON.stringify(produceVideoRef.value.timeline),
    });

    await addItem({
      jobId: res.data?.JobId!,
      status: 0,
      type: 1,
      associationIds: [+travelId],
    });

    ElMessage.success("生成视频成功");
    produceVideoShowRef.value = false;
    produceVideoRef.value.resolve();
  } catch (ex) {
    ElMessage.success("生成视频失败");
    produceVideoShowRef.value = false;
    produceVideoRef.value.resolve();
  }
  produceVideoRef.value.resolve();
  produceVideoShowRef.value = false;
};
const onProduceVideoClose = () => {
  produceVideoShowRef.value = false;
};
onMounted(async () => {

  const loading = ElLoadingService({
    body: true,
    text: "项目初始化中..."
  })

  try {
    if (!containerRef.value) {
      return;
    }

    const {projectId, travel } = await syncResourcesToICEProject(travelId);

    await delay(3000);

    projectIdRef.value = projectId;
    travelItem.value = travel;

    const editor = createEditor({
      container: containerRef.value,
      projectId: projectIdRef.value,
      locale: myLocale,
      mode: "project",
      onSearchMedia: async () => {
        searchMediaShowRef.value = true;
        return new Promise<any>((resolve) => {
          searchMediaRef.value = { resolve: resolve };
        });
      },
      onProduceEditingProjectVideo: async ({
        coverUrl,
        duration = 0,
        aspectRatio,
        timeline,
        recommend,
      }: any) => {
        produceVideoShowRef.value = true;
        return new Promise<void>((resolve) => {
          produceVideoRef.value = {
            resolve: resolve,
            timeline,
            aspectRatio,
            recommend,
          };
        });
      },
      message: ElMessage,
    });
    editor.init();
    editorRef.value = editor;
  } catch (err: any) {
    ElMessage.error(`项目初始化失败:${err && err.message}`);
  }finally {
    loading.close();
  }
});

onUnmounted(() => {
  if (editorRef.value) {
    editorRef.value.destroy();
  }
});
</script>
