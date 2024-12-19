<template>
  <div id="container-5a" class="map-container"></div>
  <preview-medias
    v-if="previewParams.preview"
    :use-request="true"
    :travel-id="previewParams.travelId"
    @close="onClosePreview"
  ></preview-medias>

  <toolbar v-if="refAMap" :map="refAMap" :travels="refTItems"></toolbar>
  <commonToolbar v-if="refAMap" :map="refAMap"></commonToolbar>
</template>
  
  <script setup lang="ts">
import { EnumColorRegionLevel, MapSettingState } from "@/store/modules/map";
import { onBeforeMount, onMounted, provide, reactive, ref } from "vue";
import { useStore } from "vuex";

import { colorRegionsByLevel, getTravelItems } from "../map/util";
import { getItems } from "@/api/5A";
import { AAAAAItem, TravelItem } from "@/types/service";
import { addMarkers } from "./util";
import PreviewMedias from "../../travel/detail/previewMedias.vue";
import Toolbar from "./toolbar/index.vue";
import { ElMessage } from "element-plus";
import { setBoundsAndGetFitZoom } from "../map";
import commonToolbar from "../components/commonToolBar/index.vue";

const store = useStore();

let refAMap = ref<AMap.Map>();
const refItems = ref<AAAAAItem[]>([]);

const refTItems = ref<TravelItem[]>([]);

const previewParams = reactive<{
  preview: boolean;
  travelId: number | undefined;
}>({
  preview: false,
  travelId: undefined,
});

async function init() {
  const mapSetting: MapSettingState = store.getters["map/value"];

  const mapOptions: AMap.MapOptions = {
    zoom: 5,
    center: [107.818204, 38.202396],
  };

  // 初始化地图
  refAMap.value = new AMap.Map("container-5a", mapOptions);

  const aMap = refAMap.value;

  const scale = new AMap.Scale();
  aMap.addControl(scale);

  // 设置地图边界
  function setMapToBounds(aMap: AMap.Map) {
    var chinaBounds = [
      [73.626945, 8.265458], // 左下角
      [135.056457, 53.555498], // 右上角
    ];

    // 设置边界
    var minLat = chinaBounds[0][1];
    var maxLat = chinaBounds[1][1];
    var minLng = chinaBounds[0][0];
    var maxLng = chinaBounds[1][0];

    var center = aMap.getCenter();
    var lat = center.lat;
    var lng = center.lng;

    if (lat < minLat || lat > maxLat || lng < minLng || lng > maxLng) {
      aMap.setCenter([
        minLng + (maxLng - minLng) / 2,
        minLat + (maxLat - minLat) / 2,
      ]);
    }
  }
  // 监听地图移动事件
  // aMap.on("zoomchange", function () {
  //   setMapToBounds(aMap);
  // });
  aMap.on("moveend", function () {
    setMapToBounds(aMap);
  });

  setBoundsAndGetFitZoom(aMap);
  // 初始化时设置边界
  setMapToBounds(aMap);

  onRenderContent();
}

async function onRenderContent() {
  await onGetItems();

  if (!refAMap.value) return;

  const map = refAMap.value;

  const items = refItems.value;

  const mapSetting: MapSettingState = store.getters["map/value"];

  const tItems = await getTravelItems();

  refTItems.value = tItems;

  addMarkers(map, items, tItems, {
    onPreview(travelId: number) {
      previewParams.travelId = travelId;
      previewParams.preview = true;
    },
  });
}

async function onGetItems() {
  const res = await getItems({
    pageNum: 1,
    pageSize: 999,
  });
  refItems.value = res.data?.list || [];
}

onMounted(() => {
  init();
  document.addEventListener("visibilitychange", onVisibilityChange);
});

onBeforeMount(() => {
  document.removeEventListener("visibilitychange", onVisibilityChange);
  if (refAMap.value) {
    refAMap.value.destroy();
  }
});

async function onRefresh() {
  const map = refAMap.value;
  if (!map) return;
  // map.clearMap();
  // await zoomAndCenter(map, 5);
  // onRenderContent();
  map.setStatus({
    showIndoorMap: false,
    resizeEnable: true,
    dragEnable: false,
    keyboardEnable: false,
    doubleClickZoom: false,
    zoomEnable: false,
    rotateEnable: false,
  });
  map.destroy();
  refAMap.value = undefined;
  init();
}

function onVisibilityChange() {
  if (document.hidden == true) {
  }
}

function addMarkersFromAAAAA(
  items: AAAAAItem[],
  options: {
    showLabel?: boolean;
  } = {}
) {
  const map = refAMap.value;
  const tItems = refTItems.value;
  if (!map || !tItems) return ElMessage.error("数据初始化异常");

  addMarkers(map, items, tItems, {
    ...options,
    onPreview(travelId: number) {
      previewParams.travelId = travelId;
      previewParams.preview = true;
    },
  });
}

provide("mapHelper", {
  refresh: onRefresh,
  addMarkers: addMarkersFromAAAAA,
});

function onClosePreview() {
  previewParams.preview = false;
  previewParams.travelId = undefined;
}
</script>
  
  <style lang="scss" scoped>
.map-container {
  height: 100%;
}
</style>
  
  <style lang="scss">
.amap-layers {
  .amap-icon img {
    left: 0;
  }
}

.c-marker-label {
  cursor: pointer;
}

.amap-menu-outer ul li {
  cursor: pointer;
}

// .custom-content-marker {
//   position: relative;
//   width: 25px;
//   height: 34px;
// }

// .custom-content-marker img {
//   width: 100%;
//   height: 100%;
// }

// .custom-content-marker .close-btn {
//   position: absolute;
//   top: -6px;
//   right: -8px;
//   width: 15px;
//   height: 15px;
//   font-size: 12px;
//   background: #ccc;
//   border-radius: 50%;
//   color: #fff;
//   text-align: center;
//   line-height: 15px;
//   box-shadow: -1px 1px 1px rgba(10, 10, 10, 0.2);
// }

// .custom-content-marker .close-btn:hover {
//   background: #666;
// }
</style>
  