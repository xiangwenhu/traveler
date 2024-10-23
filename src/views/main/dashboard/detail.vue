<template>
  <el-card class="c-card">
    <div style="text-align: left">旅行详情：</div>
    <el-scrollbar height="300px" v-if="mapData" style="margin-top:4px">
      <el-table :data="mapData || []">
        <el-table-column prop="name" label="区域"></el-table-column>
        <el-table-column prop="count" label="旅行次数" ></el-table-column>
      </el-table>
    </el-scrollbar>
    <el-empty v-else description="该地区暂无旅行信息" image-size="0"> </el-empty>
  </el-card>
</template>

<script setup lang="ts">
import { TravelRegionStatistics } from "@/types/service";

function addressFormatter(data: any, row: any, val: any) {
  return Object.keys(data || {})[0];
}

function countFormatter(data: any, row: any, val: any) {
  return Object.values(data || {})[0];
}

const props = defineProps<{
  mapData: TravelRegionStatistics[] | undefined;
}>();
</script>

<style lang="scss" scoped>
.c-card {
  position: absolute;
  right: 10px;
  top: 50px;
  width: 20vw;
  min-width: 200px;
}

.form-item {
  margin-bottom: 0;
}
</style>
