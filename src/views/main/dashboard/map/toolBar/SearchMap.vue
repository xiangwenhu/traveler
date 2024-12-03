<template>
  <el-icon
    style="font-size: 40px; cursor: pointer"
    color="#409eff"
    @click="onShowSearch"
  >
    <Search />
  </el-icon>

  <el-drawer
    v-if="state.showSearch"
    class="layer-search"
    v-model="state.showSearch"
    top="100px"
    append-to-body
    :modal="false"
    :close-on-click-modal="false"
    size="20vw"
    modal-class="layer-search-modal"
    @close="onClose"
    title="搜索"
  >
    <div class="layer-search-content">
      <el-input
        size="large"
        @keypress.enter="onSearch"
        v-model="state.keywords"
      >
        <template #append>
          <el-button :icon="Search" @click="onSearch" />
        </template>
      </el-input>
      <div id="result-panel"></div>
    </div>
  </el-drawer>
</template>


<script setup lang="ts">
import { TravelItem } from "@/types/service";
import { Search } from "@element-plus/icons";
import { ElMessage } from "element-plus";
import { map } from "lodash";
import { PropType, reactive } from "vue";
import { inject } from "vue";
import { ProvideMapHelper } from "../types";

const props = defineProps({
  map: {
    type: Object as PropType<AMap.Map>,
    required: true,
  },
  items: {
    type: Array as PropType<TravelItem[]>,
    required: true,
  },
});

const mapHelper: ProvideMapHelper | undefined = inject("mapHelper");

const state = reactive<{
  showSearch: boolean;
  keywords: string;
  /**
   * 执行过搜索
   */
  searched: boolean;
}>({
  showSearch: false,
  keywords: "",
  searched: false,
});

function onShowSearch() {
  state.showSearch = true;
}

function onSearch() {
  const kw = state.keywords.trim();
  if (kw == "") return ElMessage.error("请先输入关键字");

  props.map.clearMap();
  state.searched = true;
  const placeSearch = new AMap.PlaceSearch({
    pageSize: 10, //单页显示结果条数
    pageIndex: 1, //页码
    map: props.map, //展现结果的地图实例
    panel: "result-panel", //参数值为你页面定义容器的 id 值<div id="my-panel"></div>，结果列表将在此容器中进行展示。
    autoFitView: true, //是否自动调整地图视野使绘制的 Marker 点都处于视口的可见范围
  });
  placeSearch.search(kw);
}

function onClose() {
  if (state.searched) {
    props.map.clearMap();
    mapHelper?.refresh();
  }
}
</script>


<style >
.layer-search {
  pointer-events: auto;
}

.layer-search-modal {
  pointer-events: none;
}

.layer-search-content {
}
</style>