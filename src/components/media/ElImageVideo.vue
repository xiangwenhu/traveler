<template>
  <el-image>
    <template #viewer>
      <div class="image-slot">
        <el-icon><icon-picture /></el-icon>
      </div>
    </template>
  </el-image>
</template>


<script lang="ts" setup>
import videoImg from "@/assets/images/video.jpg";
import { Picture as IconPicture } from "@element-plus/icons-vue";

const props = defineProps({
  coverUrl: {
    type: String,
    default() {
      return videoImg;
    },
  },
  // src: {
  //   type: String,
  //   required: true,
  // },
});
</script>