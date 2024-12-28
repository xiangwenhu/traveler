<template>
  <el-form
    ref="refForm"
    :model="formData"
    inline="true" 
    size="default"
    class="s-form"
    label-position="top"

  >
    <el-form-item  prop="title">
      <el-input maxlength="50" v-model="formData.title" placeholder="请输入标题"> </el-input>
    </el-form-item>
    <el-form-item  prop="regions" >
      <PCA v-model="state.regions" placeholder="请选择"></PCA>
    </el-form-item>
    <el-form-item  >
      <el-date-picker
        v-model="state.dates"
        type="daterange"
        range-separator="至"
        start-placeholder="开始时间"
        end-placeholder="结束时间"
      />
    </el-form-item>

    <el-form-item >
      <el-button type="primary" @click="onSearch">搜索</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { FormInstance, FormRules } from "element-plus";
import { reactive, ref } from "vue";
import PCA from "@/components/PCA/index.vue";

const refForm = ref<FormInstance>();

const emits = defineEmits<{
  (e: "search", params: SearchParams): void;
}>();

const state = reactive<{
   regions?: number[],
   dates?: string[] 
  }>({});

export interface SearchParams {
  title?: string;
  status?: string;
  province?: number;
  city?: number;
  county?: number | null;
  date?: string;
  endDate?: string;
}

interface Props {}
const formData = reactive<SearchParams>({
  title: undefined,
});

const props = defineProps<Props>();


function getSearchParams(){

}

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
