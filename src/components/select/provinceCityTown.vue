<template>
  <el-cascader
    ref="refCascader"
    filterable
    :props="cityProps"
    :options="pcaData"
    placeholder="请选择省市区"
    @change="onChange"
  ></el-cascader>
</template>

<script setup lang="ts">
import { getPCAData } from "@/api/pca";
import {
  type CascaderInstance,
  ElCalendar,
  type CascaderValue,
} from "element-plus";
import { onMounted, ref } from "vue";

const pcaData = ref<any[]>();

const emits = defineEmits(["nodeChange"]);

const cityProps = {
  value: "name",
  label: "name",
  children: "children",
  //   checkStrictly: true,
  //   emitPath: false,
};

const refCascader = ref<CascaderInstance>();

function onChange(value: CascaderValue) {
  const node = refCascader.value?.getCheckedNodes(false);
  if (!node || (Array.isArray(node) && node.length == 0))
    emits("nodeChange", undefined);

  // @ts-ignore
  const data = node[node.length - 1].data;
  emits("nodeChange", data);
}

async function getPCADataList() {
  const res = await getPCAData();
  pcaData.value = res.children;
}

onMounted(() => {
  getPCADataList();
});
</script>
