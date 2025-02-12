<template>
  <MediaViewer v-if="previewParams.show" :url-list="urlList || previewParams.urlList"
    :initial-index="initialIndex || previewParams.initialIndex" @close="emits('close')" hideOnClickModal>
  </MediaViewer>
</template>


<script setup lang="ts">
import { getItems } from "@/api/resource";
import MediaViewer from "@/components/media-viewer/index.vue";
import { ElMessage } from "element-plus";
import { onMounted, reactive } from "vue";

const emits = defineEmits(["close"]);


interface MediaItem {
  url: string;
  title: string;
}

const props = defineProps<{
  urlList?: MediaItem[];
  travelId?: number;
  initialIndex?: number;
  useRequest?: boolean;
}>();

const previewParams = reactive<{
  show: boolean;
  initialIndex: number;
  urlList: MediaItem[];
}>({
  show: false,
  initialIndex: 0,
  urlList: [],
});

async function init() {
  try {
    if (!props.useRequest) return;

    const res = await getItems({
      travelId: props.travelId!,
      pageNum: 1,
      pageSize: 100,
    });
    if (!res || res.code != 0) return;

    previewParams.urlList = (res.data?.list || []).map((el) => ({ title: el.title, url: el.url }));
    previewParams.initialIndex = 0;

    if (previewParams.urlList.length > 0) {
      previewParams.show = true;
    } else {
      ElMessage.error(`该旅行暂无媒体资源`);
      emits('close')
    }
  } catch (err) {
    ElMessage.error("初始化媒体预览组件失败");
    emits('close')
  }
}

onMounted(() => {
  init();
});
</script>