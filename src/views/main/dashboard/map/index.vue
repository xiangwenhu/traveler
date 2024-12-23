<template>
  <div id="container" class="map-container dashboard-map"></div>
  <preview-medias
    v-if="previewParams.preview"
    :use-request="true"
    :travel-id="previewParams.travelItem?.id"
    @close="onClosePreview"
  ></preview-medias>

  <create-form
    v-if="state.dialogAddTravel"
    @close="state.dialogAddTravel = false"
    :item="state.editItem"
    @ok="onCreatedTravel"
  ></create-form>

  <el-dialog
    width="90%"
    v-if="state.dialogTravelDetail"
    v-model="state.dialogTravelDetail"
    top="5vh"
    @close="onRefresh"
    center
  >
    <el-scrollbar height="82vh">
      <travel-detail :travel-id="state.editItem?.id"></travel-detail>
    </el-scrollbar>
  </el-dialog>

  <tool-bar
    :map="refAMap"
    v-if="refAMap"
    :items="refTItems"
    @refresh="onRefresh"
  />
  <year-progress
    v-if="autoPlayState.playing"
    :active-value="autoPlayState?.year"
    :years="autoPlayState.years"
    :total="autoPlayState.total"
    @close="autoPlayState.playing = false"
  ></year-progress>
</template>

<script setup lang="ts">
import { nextTick, onMounted, provide, ref } from "vue";
import { TravelItem } from "@/types/service";
import PreviewMedias from "../../travel/detail/previewMedias.vue";
import { reactive } from "vue";
import {
  addColorRegionsL2,
  addElasticMarkers,
  clearAllOverlays,
  colorRegionsByLevel,
  getTravelItems,
  zoomAndCenter,
} from "./util";
import { onBeforeMount } from "vue";
import useContextMenu from "./hooks/useContextMenu";
import CreateForm from "../../travel/travels/CreateForm.vue";
import { copyUnEmptyProperty } from "@/utils/arrHandle";
import useAutoPlay from "./hooks/useAutoPlay";
import TravelDetail from "../../travel/detail/index.vue";
import ConfigSetting, { IConfigSettings } from "./configSetting/index.vue";
import useAutoMarkerByYear from "./hooks/useAutoMarkerByYear";
import YearProgress from "./yearProgress/index.vue";
import ToolBar from "./toolBar/index.vue";
import { useStore } from "vuex";
import { EnumColorRegionLevel, MapSettingState } from "@/store/modules/map";
import useChinaOnly from "./hooks/useMaskPath";
import { setBoundsAndGetFitZoom, setBoundsAndGetFitZoomPlus } from "../map";
import { MapStyle } from "@/types/map";

const store = useStore();

const { getMaskPath } = useChinaOnly();

let refAMap = ref<AMap.Map>();
const refTItems = ref<TravelItem[]>([]);

const state = reactive<{
  editItem: Partial<TravelItem> | undefined;
  dialogAddTravel: boolean;
  dialogTravelDetail: boolean;
}>({
  editItem: undefined,
  dialogAddTravel: false,
  dialogTravelDetail: false,
});

const previewParams = reactive<{
  preview: boolean;
  travelItem: TravelItem | undefined;
}>({
  preview: false,
  travelItem: undefined,
});

const autoPlayState = reactive<{
  year: number;
  years: number[];
  playing: boolean;
  total: number;
}>({
  year: 0,
  years: [],
  playing: false,
  total: 0,
});

function onClosePreview() {
  previewParams.preview = false;
  previewParams.travelItem = undefined;
}

const { startAutoPlay, stopAutoPlay, setMap } = useAutoPlay(undefined, {
  intervalTime: 3 * 1000,
  canAutoPlay() {
    const map = refAMap.value;
    if (!map) return false;

    return true;
  },
});

const { startPlay, stopPlay } = useAutoMarkerByYear({
  onPlayYear(year, total) {
    autoPlayState.year = year;
    autoPlayState.total = total;
  },
  onPlayStart(years) {
    autoPlayState.playing = true;
    autoPlayState.years = years;
  },
});

async function init() {
  const mapSetting: MapSettingState = store.getters["map/value"];

  const mapOptions: AMap.MapOptions = {
    zoom: 5,
    mapStyle: `amap://styles/${mapSetting.mapStyle || MapStyle.fresh}`,
    // center: [107.818204, 38.202396],
    rotateEnable: true,
    pitchEnable: true,
    pitch: 40,
    rotation: 0,
    // viewMode:'3D'
  };

  if (mapSetting.chinaOnly) {
    const marskPath = await getMaskPath("中国", {
      extensions: "all",
      subdistrict: 0,
      level: "country",
    });

    mapOptions.mask = marskPath;
  }

  // 初始化地图
  refAMap.value = new AMap.Map("container", mapOptions);


  window.__amap__ = refAMap.value;

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

  // 初始化时设置边界
  setMapToBounds(aMap);

  const zoom = await setBoundsAndGetFitZoom(aMap);
  store.commit("map/setFitZoom", zoom);

  onRenderContent();

  useContextMenu(aMap, {
    onAdd(data) {
      state.dialogAddTravel = true;
      const item: Partial<TravelItem> = {
        longitude: data.longitude,
        latitude: data.latitude,
        title: data.title,
        province: +data.province,
        city: +data.city,
        county: +data.county,
        address: data.title,
      };
      state.editItem = copyUnEmptyProperty(item);
    },
    onStartAutoPlay() {
      startAutoPlay();
    },
    onStopAutoPlay() {
      stopAutoPlay();
    },
    onPlayByYear() {
      clearAllOverlays(aMap, "polygon");
      clearAllOverlays(aMap, "elasticmarker");
      startPlay(aMap, refTItems.value);
    },
  });

  window.addEventListener("orientationchange", async () => {
    // const zoom = await setBoundsAndGetFitZoom(aMap);
    // store.commit("map/setFitZoom", zoom);
    location.reload();
  });
}

async function onRenderContent() {
  await onGetTravelItems();

  if (!refAMap.value) return;

  const map = refAMap.value;

  const items = refTItems.value;

  // 添加覆盖物品
  addElasticMarkers(map, items, {
    onPreview(item) {
      previewParams.travelItem = item;
      previewParams.preview = true;
    },
    canAnimation() {
      return (
        !previewParams.preview &&
        !state.dialogAddTravel &&
        !state.dialogTravelDetail
      );
    },
    onEdit(item) {
      state.dialogTravelDetail = true;
      state.editItem = item;
    },
  }).then(() => {
    autoPlayActions();
  });

  const mapSetting: MapSettingState = store.getters["map/value"];
  // 标记层级
  colorRegionsByLevel(
    map,
    items,
    mapSetting.colorRegionLevel || EnumColorRegionLevel.City
  );
}

function autoPlayActions() {
  setMap(refAMap.value!);

  // startAutoPlay();
}

async function onGetTravelItems() {
  const items = await getTravelItems();
  refTItems.value = items || [];
}

onMounted(() => {
  init();
  document.addEventListener("visibilitychange", onVisibilityChange);
});

onBeforeMount(() => {
  stopAutoPlay();
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
    stopAutoPlay();
  }
}

function onCreatedTravel(id: number) {
  state.dialogTravelDetail = true;
  state.editItem = {
    id,
  };
}

provide("mapHelper", {
  refresh: onRefresh,
});
</script>

<style lang="scss" scoped>
.map-container {
  height: 100%;
}
</style>

<style lang="scss">
.amap-overlay-elastic-container {
  .amap-icon img {
    position: relative;
    left: 0;
  }
}

.dashboard-map {
  .amap-icon img {
    position: relative;
  }
}

.c-marker-label {
  cursor: pointer;
  width: 50vw;
  max-width: 400px;


  .label-img{
    width: 100%;
    height: 200px;
    object-fit: cover
  }
}

.amap-menu-outer ul li {
  cursor: pointer;
}

.map-custom-context-menu {
  background-color: #fff;
  border-radius: 6px;
  padding: 6px 16px;
}
</style>
