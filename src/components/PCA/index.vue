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
import { ADCODE_CHINA } from "@/const";
import { EnumLevel, type AreaInfoItem, type GeoJSON } from "@/types";
import {
  type CascaderInstance,
  type CascaderValue,
  type Resolve,
  type CascaderNode,
} from "element-plus";
import { onMounted, ref } from "vue";

const rootArea: AreaInfoItem = {
  adcode: ADCODE_CHINA,
  name: "中国",
  level:  EnumLevel.country,
  childrenNum: 34,
};

const pcaData = ref<any[]>();

const emits = defineEmits(["nodeChange"]);

const cityProps = {
  value: "adcode",
  label: "name",
  children: "children",
  // checkStrictly: true,
  lazy: true,
  lazyLoad,
  // emitPath: false,
};

async function lazyLoad(node: CascaderNode, resolve: Resolve) {
  const areaInfo: AreaInfoItem = node.root ? rootArea : node.data as unknown as AreaInfoItem;
  const children: any = await getSONData(areaInfo);
  resolve(children);
}

async function getSONData(areaInfo: AreaInfoItem) {
  const res = await getPCAData(areaInfo?.adcode || ADCODE_CHINA);

  const list = res.data || [];

  const children = list
    .map((p) => ({
      adcode: p.code,
      name: p.name,
      childrenNum: p.childrenNum,
      leaf: p.childrenNum == 0,
    }));
  return children;
}

const refCascader = ref<CascaderInstance>();

function onChange(value: CascaderValue) {
  const nodes = refCascader.value?.getCheckedNodes(false) || [];
  emits(
    "nodeChange",
    nodes.map((n) => n.data)
  );
}

onMounted(() => {
  // getGeoJSONData(rootArea);
});
</script>