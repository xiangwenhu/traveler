<template>
  <el-form
    ref="refForm"
    :model="formData"
    label-suffix="："
    label-width="100"
    :inline="true"
    size="default"
    class="s-form"
  >
    <el-form-item label="标签名" prop="name" class="form-item">
      <enable-status v-model="formData.name"></enable-status>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="onSearch">搜索</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import EnableStatus from "@/components/select/enableStatus.vue";
import { FormInstance, FormRules } from "element-plus";
import { reactive, ref } from "vue";

const refForm = ref<FormInstance>();

const emits = defineEmits<{
  (e: "search", params: SearchParams): void;
}>();

export interface SearchParams {
  name?: string;
}

interface Props {}
const formData = reactive<SearchParams>({
  name: '',
});

const props = defineProps<Props>();

function onSearch() {
  emits("search", formData);
}
</script>

<style lang="scss" scoped>
.s-form {
  text-align: left;

  .form-item {
    width: 20%;
    // width: 220px;
    min-width: 240px;
  }
}
</style>
