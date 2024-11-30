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
  
