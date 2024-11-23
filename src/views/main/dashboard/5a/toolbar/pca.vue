<template>
  <tree-select @node-change="onPCAChange" style="width: 300px"></tree-select>
</template>
  
  
  
<script setup lang="ts">
import TreeSelect from "@/components/PCA/TreeSelect.vue";
import { AreaInfoItem, EnumLevel } from "@/types";
import { inject, markRaw, PropType, ref } from "vue";
import {
  zoomAndCenter,
  getVisibleOverlays,
  colorRegionByAdcode,
  getMarkersInPolygonByAreaInfo,
  setOverlayersVisible,
} from "@/views/main/dashboard/map";
import { AAAAAItem, TravelItem } from "@/types/service";
import { ADCODE_CHINA } from "@/const";
import { ProvideMapHelper } from "../../map/types";
import { addMarkers } from "../util";
import { delay } from "@/utils";

const mapHelper: ProvideMapHelper | undefined = inject("mapHelper");

const props = defineProps({
  map: {
    type: Object as PropType<AMap.Map>,
    required: true,
  },
});

/**
 * TODO:: 根据面积？决定zoom?
 * @param level
 */
function getZoom(data: AreaInfoItem) {
  if (data.name.startsWith("市")) {
    return 9;
  }

  const level = data.level;
  switch (level) {
    case EnumLevel.country:
      return 5;
    case EnumLevel.province:
      return 7.1;
    case EnumLevel.city:
      return 9;
    case EnumLevel.district:
      return 11;
    default:
      return 5;
  }
}

const refLastArea = ref<AreaInfoItem>();
async function onPCAChange(data: AreaInfoItem) {
  if (refLastArea.value && refLastArea.value.adcode === data.adcode) return;

  refLastArea.value = data;

  const map = props.map;

  // 删除颜色区域
  const polygons = map.getAllOverlays("polygon");
  polygons.forEach((p) => map.remove(p));

  // 全国
  if (data.adcode === ADCODE_CHINA) {
    mapHelper?.refresh();
    return;
  }

  // 查询选中行政单位的经纬度，zoomAndCenter
  // 同时颜色标记该区域
  // const geocoder = new AMap.Geocoder({
  //   city: data.adcode, // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
  // });
  // geocoder.getLocation(data.name, async function (status: string, result: any) {
  //   if (
  //     status === "complete" &&
  //     result.info === "OK" &&
  //     Array.isArray(result.geocodes)
  //   ) {
  //     // result中对应详细地理坐标信息
  //     console.log(result);
  //     const loc = result.geocodes[0]?.location;
  //     const zoom = getZoom(data);
  //     // zoom and center
  //     zoomAndCenter(map, zoom, new AMap.LngLat(loc.lng, loc.lat), 1000);
  //     // 颜色标记
  //     colorRegionByAdcode(map, data.adcode);

  //     hilightMarkers(data);
  //   }
  // });

  setOverlayersVisible(map, "marker", false);
  const overlayers = await colorRegionByAdcode(map, data.adcode);
  map.setFitView(overlayers, false, [0, 0, 0, 0]);
  hilightMarkers(data);
}

function hilightMarkers(data: AreaInfoItem) {
  const map = props.map;
  // marker显示label
  getMarkersInPolygonByAreaInfo(map, data).then(async (markers) => {
    // 隐藏其他的

    const items: AAAAAItem[] = markers.map((m) => m.getExtData());
    markers.forEach((m) => m.remove());

    await delay(500);
    mapHelper?.addMarkers(items, {
      showLabel: true,
    });
  });
}
</script>
  
