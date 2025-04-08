<template>
  <el-popconfirm @confirm="onToDelete" @cancel="onCancel" v-bind="props" teleported>
    <template #reference>
      <el-icon :size="size">
        <Delete />
      </el-icon>
    </template>
  </el-popconfirm>
</template>

<script setup lang="ts">
import { isReadOnlyUser } from "@/store/quick";
import { Delete } from "@element-plus/icons";
import { ElMessage, popconfirmEmits, PopconfirmProps } from "element-plus";

const props = defineProps<PopconfirmProps & {
  size: string
}>();


const emits = defineEmits(["confirm", "cancel"]);

const editable = !isReadOnlyUser();
function onToDelete(e: any) {
  if (!editable) return ElMessage.error("当前用户无权限");
  emits("confirm", e);
}

function onCancel(e: any) {
  emits("cancel", e);
}
</script>
