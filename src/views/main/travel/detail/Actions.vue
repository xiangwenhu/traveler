<template>
  <div class="re-actions-container ">
    <ActionEdit :item="item" />
    <el-icon class="icon-del" @click="onDelete">
      <Delete />
    </el-icon>
  </div>
</template>


<script setup lang="ts">
import { deleteItem } from "@/api/resource";
import { ResourceItem } from "@/types/service";
import { getOSSClient } from "@/utils/ali-oss";
import { Delete, Edit } from "@element-plus/icons";
import { ElMessage } from "element-plus";
import ActionEdit from "./Action-Edit.vue";

const emits = defineEmits<{
  (e: "delete", id: number): void;
}>();

const props = defineProps<{
  item: ResourceItem;
}>();




async function onDelete(e: Event) {
  const ossClient = getOSSClient();

  e.stopImmediatePropagation();

  await deleteItem(props.item.id!);

  const url = props.item.url.split("com/")[1];
  const res = await ossClient.delete(url);
  if (res.res.status != 200 && res.res.status != 204) {
    return ElMessage.error(res.res.status + "");
  }
  ElMessage.success("删除成功");
  emits("delete", props.item.id!);
}
</script>


<style lang="scss">
.re-actions-container {
  font-size: 22px;

  .el-icon {
    cursor: pointer;
  }
}
</style>