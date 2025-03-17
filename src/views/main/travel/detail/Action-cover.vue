<template>
  <el-popconfirm @confirm="onSetCover" title="确认设置为封面吗">
    <template #reference>
      <el-icon><PictureFilled /></el-icon>
    </template>
  </el-popconfirm>
</template>

<script setup lang="ts">
import { setCover } from "@/api/travel";
import { ResourceItem } from "@/types/service";
import { getOSSClient } from "@/utils/ali-oss";
import { ElMessage, ElMessageBox } from "element-plus";
import { PictureFilled } from "@element-plus/icons";

const props = defineProps<{
  item: ResourceItem;
  travelId: number;
}>();

const emits = defineEmits<{
  (e: "success", id: number): void;
}>();

async function onSetCover(ev: Event) {
  const ossClient = getOSSClient();

  await setCover({
    id: props.travelId,
    cover: props.item.url,
  });

  const url = props.item.url.split("com/")[1];
  const res = await ossClient.delete(url);
  if (res.res.status != 200 && res.res.status != 204) {
    return ElMessage.error(res.res.status + "");
  }
  ElMessage.success("设置成功");
  emits("success", props.item.id!);
}
</script>
