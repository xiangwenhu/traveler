<template>
  <div :class="`item ${selected ? 'selected' : ''}`" @click="emit('click')">
    <div class="cover" :style="{ backgroundImage: `url(${coverUrl})` }"></div>

    <template v-if="mediaType !== 'image'">
      <div class="duration">{{ durationFormat }}</div>
    </template>

    <div className="title">{{ title }}</div>
  </div>
</template>

<script lang="ts" setup>
import { formatTime } from "../utils";

const { item, selected } = defineProps(["item", "selected"]);
const emit = defineEmits(["click"]);
const mediaType = item.MediaBasicInfo.MediaType;
let coverUrl: string;
let title: string;
let duration: number = 0;

if (mediaType === "image") {
  coverUrl = item.FileInfoList[0].FileBasicInfo.FileUrl;
  title = item.FileInfoList[0].FileBasicInfo.FileName;
} else {
  coverUrl =
    item.MediaBasicInfo.CoverURL ||
    "https://img.alicdn.com/imgextra/i2/O1CN01fRTy3n1ZM1jvBOiyO_!!6000000003179-2-tps-240-136.png";
  title = item.FileInfoList[0].FileBasicInfo.FileName;
  duration = item.FileInfoList[0].FileBasicInfo.Duration;
}
const durationFormat = formatTime(duration || 0);
</script>



<style lang="scss" scoped>
.item {
  position: relative;
  margin: 10px;
  cursor: pointer;
  width: 144px;
}

.item.selected {
  outline: 2px solid #1890ff;
  outline-offset: 5px;
}

.cover {
  width: 100%;
  padding-top: 56.25%;
  background-color: #1c1e26;
  background-repeat: no-repeat;
  background-position: 50%;
  background-size: contain;
}

.duration {
  position: absolute;
  top: 4px;
  right: 4px;
  background-color: rgba(0, 0, 0, 0.5);
  color: #eeeeee;
}

.title {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>

