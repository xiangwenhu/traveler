<template>
  <el-tree-select
    ref="refTreeSelect"
    placeholder="请选择省市区"
    :load="lazyLoad"
    :props="treeProps"
    v-model="refValue"
    lazy
    check-strictly
    @current-change="onChange"
    filterable
    clearable
    @clear="onClear"
    node-key="adcode"
  ></el-tree-select>
</template>
  
<script setup lang="ts">
import { getPCAData } from "@/api/pca";
import { ADCODE_CHINA } from "@/const";
import { AreaInfoItem, EnumLevel, levelMap, LevelValue } from "@/types";
import { onMounted, ref } from "vue";
import { type TreeNode, type Resolve } from "element-plus";

const refValue = ref();
const rootArea: AreaInfoItem = {
  adcode: ADCODE_CHINA,
  name: "中国",
  level: EnumLevel.country,
  childrenNum: 34,
};

const treeProps = {
  value: "adcode",
  label: "name",
  children: "children",
  isLeaf: "isLeaf",
};

const emits = defineEmits(["nodeChange"]);

const refTreeSelect = ref<any>();

async function lazyLoad(node: TreeNode, resolve: Resolve) {
  const areaInfo: AreaInfoItem =
    node.level == 0 ? rootArea : ((node as any).data as AreaInfoItem);
  const children: any = await getSONData(areaInfo);
  resolve(children);
}

function getSubLevel(level: EnumLevel) {
  return levelMap[(level + 1) as EnumLevel] || EnumLevel.country;
}

async function getSONData(areaInfo: AreaInfoItem) {
  const res = await getPCAData(areaInfo?.adcode || ADCODE_CHINA);

  const list = res.data || [];

  const children = list.map((p) => ({
    adcode: p.code,
    name: p.name,
    childrenNum: p.childrenNum,
    isLeaf: p.childrenNum == 0,
    level: getSubLevel(areaInfo.level),
  }));
  return children;
}

function onChange(value: any) {
  console.log("onChange:", value, refValue.value);
  const node = refTreeSelect.value?.getCurrentNode() || rootArea;
  emits("nodeChange", node);

  refTreeSelect.value?.blur();
}

function onClear() {
  console.log("onClear:");
  emits("nodeChange", rootArea);
  setTimeout(() => {
    refTreeSelect.value?.blur();
  }, 0);
}
</script>
  