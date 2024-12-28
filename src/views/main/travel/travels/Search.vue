<template>
  <el-form
    ref="refForm"
    :model="formData"
    inline="true"
    size="default"
    class="s-form"
    label-position="top"
  >
    <el-form-item prop="title">
      <el-input maxlength="50" v-model="formData.title" placeholder="请输入标题">
      </el-input>
    </el-form-item>
    <el-form-item prop="regions">
      <tree-select @node-change="onPCAChange" ref="refTree"></tree-select>
    </el-form-item>
    <el-form-item>
      <el-date-picker
        v-model="state.dates"
        type="daterange"
        range-separator="至"
        start-placeholder="开始时间"
        end-placeholder="结束时间"
      />
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="onSearch">搜索</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { FormInstance, FormRules } from "element-plus";
import { reactive, ref } from "vue";
import PCA from "@/components/PCA/index.vue";
import { regionsToPCA } from "@/utils/pca";
import TreeSelect from "@/components/PCA/TreeSelect.vue";
import { AreaInfoItem } from "@/types";
import { ADCODE_CHINA } from "@/const";

const refForm = ref<FormInstance>();

const emits = defineEmits<{
  (e: "search", params: SearchParams): void;
}>();

const state = reactive<{
  region?: AreaInfoItem;
  dates?: string[];
}>({});

export interface SearchParams {
  title?: string;
  status?: string;
  province?: number;
  city?: number | null | undefined;
  county?: number | null | undefined;
  date?: string;
  endDate?: string;
}

interface Props {}
const formData = reactive<SearchParams>({
  title: undefined,
});

const props = defineProps<Props>();

function getSearchParams() {
  const params = {
    ...formData,
  };

  if (state.dates && state.dates.length == 2) {
    params.date = state.dates[0];
    params.endDate = state.dates[1];
  }

  if (state.region && state.region.adcode !== ADCODE_CHINA) {
    switch (state.region.level) {
      case 1:
        params.province = state.region.adcode;
        break;
      case 2:
        params.city = state.region.adcode;
        break;
      case 3:
        params.county = state.region.adcode;
        break;
    }
  }

  return params;
}

function onSearch() {
  emits("search", getSearchParams());
}

async function onPCAChange(data: AreaInfoItem) {
  state.region = data;
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
