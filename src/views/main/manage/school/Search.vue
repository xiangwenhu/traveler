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
    <el-form-item label="名称" class="form-item" prop="title">
      <el-input maxlength="50" v-model="formData.name"> </el-input>
    </el-form-item>
    <el-form-item label="省市县" class="form-item">
      <PCASelect @node-change="onPCAChange" ref="refTree"></PCASelect>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="onSearch">搜索</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { FormInstance, FormRules } from "element-plus";
import { reactive, ref } from "vue";
import PCASelect from "@/components/PCA/TreeSelect.vue";
import { AreaInfoItem } from "@/types";
import { getParamsByAreaInfo } from "@/utils/pca";

const refForm = ref<FormInstance>();

const state = reactive<{
  region?: AreaInfoItem;
}>({});


const emits = defineEmits<{
  (e: "search", params: SearchParams): void;
}>();

export interface SearchParams {
  name?: string;
  tag?: number | undefined;
}

interface Props {}
const formData = reactive<SearchParams>({
  name: undefined,
});

async function onPCAChange(data: AreaInfoItem) {
  state.region = data;
}

function getSearchParams() {
  const pcaParams = getParamsByAreaInfo(state.region);
  let params = {
    ...formData,
    ...pcaParams
  };
  return params;
}

const props = defineProps<Props>();

function onSearch() {
  emits("search", getSearchParams());
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
