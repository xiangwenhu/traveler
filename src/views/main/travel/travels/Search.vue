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
    <el-form-item label="标题" class="form-item" prop="title">
      <el-input maxlength="50" v-model="formData.title"> </el-input>
    </el-form-item>
    <el-form-item label="标签" prop="tag" class="form-item">
      <el-input v-model="formData.tag"></el-input>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="onSearch">搜索</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { FormInstance, FormRules } from "element-plus";
import { reactive, ref } from "vue";

const refForm = ref<FormInstance>();

const emits = defineEmits<{
  (e: "search", params: SearchParams): void;
}>();

export interface SearchParams {
  title?: string;
  tag?: number | undefined;
}

interface Props {}
const formData = reactive<SearchParams>({
  title: undefined,
  tag: undefined,
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
