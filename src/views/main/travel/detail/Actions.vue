<template>
  <div class="re-actions-container" @click.stop>
    <ActionEdit :item="item" />
    <!-- <el-icon class="icon-del" @click="onToDelete">
      <Delete />
    </el-icon> -->
    <permission-delete
      class="icon-delete"
      title="确认删除吗!？"
      style="margin-left: 0;"
      @confirm="onToDelete"
    ></permission-delete>

    <ActionCover
      @success="onSetCoverSuccess"
      :item="item"
      :travel-id="travel.id"
      v-if="travel.id"
    />
  </div>
</template>

<script setup lang="ts">
import { deleteItem } from "@/api/resource";
import { ResourceItem, TravelItem } from "@/types/service";
import { createOSSClient, getOSSClient } from "@/utils/ali-oss";
import { Delete, PictureFilled } from "@element-plus/icons";
import { ElDialog, ElMessage, ElMessageBox } from "element-plus";
import ActionEdit from "./Action-Edit.vue";
import ActionCover from "./Action-cover.vue";
import { onMounted } from "vue";

const emits = defineEmits<{
  (e: "delete", id: number): void;
  (e: "refresh"): void;
}>();

const props = defineProps<{
  item: ResourceItem;
  travel: TravelItem;
}>();

function onToDelete(e: Event) {
  e.stopImmediatePropagation();

  // ElMessageBox.confirm("确认删除该资源吗?", "警告", {
  //   confirmButtonText: "确认",
  //   cancelButtonText: "取消",
  //   type: "warning",
  // })
  //   .then(() => {
      onDelete();
    // })
    // .catch(() => {});
}

async function onDelete() {
  const ossClient = getOSSClient();

  await deleteItem(props.item.id!);

  const url = props.item.url.split("com/")[1];
  const res = await ossClient.delete(url);
  if (res.res.status != 200 && res.res.status != 204) {
    return ElMessage.error(res.res.status + "");
  }
  ElMessage.success("删除成功");
  emits("delete", props.item.id!);
}

function onSetCoverSuccess() {
  emits("refresh");
}

onMounted(() => {
  createOSSClient();
});
</script>

<style lang="scss">
.re-actions-container {
  font-size: 22px;
  background-color: rgba(0, 0, 0, 0.4);

  .el-icon {
    color: #fff;
  }

  .el-icon {
    cursor: pointer;
  }
}
</style>
