<template>
  <el-card class="c-card">
    <div style="text-align: left">统计信息</div>
    <el-divider></el-divider>
    <el-form label-suffix="">
      <el-form-item label="总旅行次数" class="form-item">{{
        mapData?.total || 0
      }}</el-form-item>
      <el-form-item label="总照片数量" class="form-item">{{
        mapData?.pictureTotal || 0
      }}</el-form-item>
      <el-form-item label="总视频数" class="form-item">{{
        mapData?.videoTotal || 0
      }}</el-form-item>
      <el-form-item label="总音频数" class="form-item">{{
        mapData?.audioTotal || 0
      }}</el-form-item>
    </el-form>
    <el-divider ></el-divider>
    <div style="text-align: left">旅行详情：</div>
    <el-scrollbar height="300px" v-if="mapData" style="margin-top:4px">
      <el-table :data="mapData.details || []">
        <el-table-column prop="deviceName" label="设备名称"></el-table-column>
        <el-table-column prop="coordinate" label="经纬度" ></el-table-column>
        <el-table-column prop="state" label="状态" width="60"></el-table-column>
      </el-table>
    </el-scrollbar>
    <el-empty v-else description="该地区暂无设备信息" image-size="0"> </el-empty>
  </el-card>
</template>

<script setup lang="ts">
import { TerminalMapData } from "@/types/map";

function addressFormatter(data: any, row: any, val: any) {
  return Object.keys(data || {})[0];
}

function countFormatter(data: any, row: any, val: any) {
  return Object.values(data || {})[0];
}

const props = defineProps<{
  mapData: TerminalMapData | undefined;
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
