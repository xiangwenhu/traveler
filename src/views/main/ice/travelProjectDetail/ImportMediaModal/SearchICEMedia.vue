<template>
  <div>
    <el-radio-group
      style="margin-bottom: 20px"
      @change="handleMediaTypeChange"
      v-model="mediaType"
      option-type="button"
      button-style="solid"
    >
      <el-radio :value="op.value" :key="op.value" v-for="op in options">{{
        op.label
      }}</el-radio>
    </el-radio-group>
    <template v-if="status === 'done' && mediaList.length > 0">
      <div style="display: flex; flex-wrap: wrap">
        <template v-for="item in mediaList" :key="item.MediaId">
          <MediaItem
            @click="handleClick(item)"
            :selected="selectedMediaIds.indexOf(item.MediaId) > -1"
            :item="item"
          />
        </template>
      </div>
    </template>
    <template v-else-if="status === 'done'">
      <div style="height: 615px; text-align: center">暂无数据</div>
    </template>
    <template v-if="status === 'loading'">
      <div style="height: 615px; text-align: center">加载中...</div>
    </template>
    <template v-if="status === 'error'">
      <div style="color: red; height: 615px; text-align: center">加载出错</div>
    </template>
    <el-pagination
      style="text-align: center"
      :current="page"
      @change="setPage"
      class="pager"
      background
      layout="prev, pager, next,total,jumper"
      :page-size="PAGE_SIZE"
      v-model:current-page="page"
      :total="total"

    />

    <div class="dialog-footer">
      <el-button @click="onClose"></el-button>
      <el-button type="primary" @click="handleSubmit">导入 </el-button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref, watch } from "vue";
import MediaItem from "../MediaItem.vue";
import { LabelValue } from "@/types/common";
import { requestPost } from "@/api/ice";
import { transMediaList } from "../../utils";

const options: LabelValue<string>[] = [
  { label: "全部", value: "all" },
  { label: "视频", value: "video" },
  { label: "音频", value: "audio" },
  { label: "图片", value: "image" },
];
const PAGE_SIZE = 20;

const emits = defineEmits(["submit", "close"]);

const selectedMedia = ref<any[]>([]);
const confirmLoading = ref(false);
const mediaType = ref(options[0].value);
const status = ref("loading");
const page = ref(1);
const total = ref(0);
const mediaList = ref<any[]>([]);
const selectedMediaIds = ref<string[]>([]);
const handleSubmit = async () => {
  const result = transMediaList(selectedMedia.value);
  emits("submit", result);
};

function onClose(){
  emits("close")
}


const handleMediaTypeChange = (e: any) => {
  mediaType.value = e.target.value;
  page.value = 1;
};
const handleClick = (item: any) => {
  const index = selectedMedia.value.findIndex(
    (m) => m.MediaId === item.MediaId
  );
  if (index > -1) {
    selectedMedia.value = selectedMedia.value.filter((_, i) => i !== index);
  } else {
    selectedMedia.value = selectedMedia.value.concat(item);
  }
};

const setPage = (p: number) => {
  page.value = p;
};

const fetchList = () => {
  status.value = "loading";
  requestPost("ListMediaBasicInfos", {
    // https://help.aliyun.com/document_detail/197964.html
    PageSize: PAGE_SIZE,
    PageNo: page.value,
    MediaType: mediaType.value, // 可填写 all, video, audio, image
    IncludeFileBasicInfo: true,
    Status: "Normal",
  })
    .then((res) => {
      status.value = "done";
      mediaList.value = res.data!.MediaInfos;
      total.value = res.data!.TotalCount;
    })
    .catch(() => {
      status.value = "error";
      total.value = 0;
    });
};

watch(selectedMedia, (data) => {
  selectedMediaIds.value = data.map((m) => m.MediaId);
});

watch([page, mediaType], () => {
  fetchList();
});

onMounted(() => {
  fetchList();
});
</script>
