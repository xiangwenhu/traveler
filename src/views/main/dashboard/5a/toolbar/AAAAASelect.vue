<template>
  <AAAAA filterable @change="onChange" v-model="state.id" placeholder="请选择景区"></AAAAA>
</template>

<script setup lang="ts">
import { PropType, reactive } from "vue";
import { inject } from "vue";
import { ProvideMapHelper } from "../../map/types";
import AAAAA from "@/components/select/AAAAA.vue";
import { AAAAAItem } from "@/types/service";
import { zoomAndCenter } from "../../map";
import { delay } from "@/utils";

const mapHelper: ProvideMapHelper | undefined = inject("mapHelper");

const props = defineProps({
  map: {
    type: Object as PropType<AMap.Map>,
    required: true,
  },
});

const state = reactive<{
  id: number | undefined;
}>({
  id: undefined,
});

async function onChange(value: number) {
  const map = props.map;

  const markers: AMap.Marker[] = map.getAllOverlays("marker");

  const targetMarker = markers.find((m) => {
    const data: AAAAAItem = m.getExtData();
    return data.id == value;
  });

  if (!targetMarker) return;

  //   map.setZoomAndCenter(12, targetMarker.getPosition()!, false, 3000);

  //   AMap.Event.trigger(map,  "click", map)

  const infoWindows: AMap.InfoWindow[] | undefined = (window as any).__5a__?.infoWindows;
  if (Array.isArray(infoWindows)) {
    infoWindows.forEach((w) => w.hide());
  }

  map.setZoom(6, true);

  await zoomAndCenter(map, 12, targetMarker.getPosition()!, 3000);

  await delay(500);

  AMap.Event.trigger(targetMarker, "click", {
    target: {
      getExtData() {
        return targetMarker.getExtData();
      },
      getPosition() {
        return targetMarker.getPosition();
      },
    },
  });
}
</script>
