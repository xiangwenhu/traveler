<template>
  <div class="tool-bar">
    <tree-select @node-change="onPCAChange" style="width: 300px"></tree-select>
  </div>
</template>



<script setup lang="ts">
import TreeSelect from "@/components/PCA/TreeSelect.vue";
import { AreaInfoItem, EnumLevel } from "@/types";
import { inject, PropType, ref } from "vue";
import {
  zoomAndCenter,
  getVisibleOverlays,
  colorRegionByAdcode,
} from "@/views/main/dashboard/map";
import { AAAAAItem } from "@/types/service";
import { ADCODE_CHINA } from "@/const";
import { ProvideMapHelper } from "../../map/types";

const mapHelper: ProvideMapHelper | undefined = inject("mapHelper");

const props = defineProps({
  map: {
    type: Object as PropType<AMap.Map>,
    required: true,
  },
});

function getZoom(level: EnumLevel) {
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
function onPCAChange(data: AreaInfoItem) {
  if (refLastArea.value && refLastArea.value.adcode === data.adcode) return;

  refLastArea.value = data;

  const map = props.map;

  if (data.adcode === ADCODE_CHINA) {
    mapHelper?.refresh();
    return;
  }

  var geocoder = new AMap.Geocoder({
    city: data.adcode, // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
  });
  geocoder.getLocation(data.name, async function (status: string, result: any) {
    if (
      status === "complete" &&
      result.info === "OK" &&
      Array.isArray(result.geocodes)
    ) {
      // result中对应详细地理坐标信息
      console.log(result);
      const loc = result.geocodes[0]?.location;
      const zoom = getZoom(data.level);
      await zoomAndCenter(map, zoom, new AMap.LngLat(loc.lng, loc.lat), 1000);

      const visibleMarkers: AMap.Marker[] = getVisibleOverlays(map, "marker");

      visibleMarkers.forEach((m) => {
        const data: AAAAAItem = m.getExtData();
        m.setLabel({
          content: `<div class='info'>${data.name}</div>`,
          offset: new AMap.Pixel(0, 0),
          direction: "bottom",
        });
      });

      colorRegionByAdcode(map, data.adcode);
    }
  });
}
</script>



<style lang="scss" scoped>
.tool-bar {
  position: absolute;
  top: 0;
  left: 0;
}
</style>