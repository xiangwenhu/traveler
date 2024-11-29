<template>
  <SchoolSelect
    filterable
    @change="onChange"
    v-model="state.id"
    placeholder="请选择高校"
  ></SchoolSelect>
  <el-checkbox v-model="state.is211" @change="onTypeChange">211</el-checkbox>
  <el-checkbox v-model="state.is985" @change="onTypeChange">985</el-checkbox>
</template>

<script setup lang="ts">
import { PropType, reactive } from "vue";
import { inject } from "vue";
import { ProvideMapHelper } from "../../map/types";
import SchoolSelect from "@/components/select/School.vue";
import { SchoolItem } from "@/types/service";
import { setOverlayersVisible, zoomAndCenter } from "../../map";
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
  is211: boolean;
  is985: boolean;
}>({
  id: undefined,
  is211: false,
  is985: false,
});

async function onChange(value: number) {
  const map = props.map;

  const markers: AMap.Marker[] = map.getAllOverlays("marker");

  const targetMarker = markers.find((m) => {
    const data: SchoolItem = m.getExtData();
    return data.id == value;
  });

  if (!targetMarker) return;

  //   map.setZoomAndCenter(12, targetMarker.getPosition()!, false, 3000);

  //   AMap.Event.trigger(map,  "click", map)

  const infoWindows: AMap.InfoWindow[] | undefined = (window as any).__5a__
    ?.infoWindows;
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

async function onTypeChange() {
  const map = props.map;

  const markers: AMap.Marker[] = map.getAllOverlays("marker");

  const { is211, is985 } = state;

  let targetMarkers: AMap.Marker[] = markers;

  if (is211) {
    targetMarkers = markers.filter((m) => {
      const data: SchoolItem = m.getExtData();
      return (data.is211 == true);
    });
  }
  if (is985) {
    targetMarkers = markers.filter((m) => {
      const data: SchoolItem = m.getExtData();
      return (data.is985 == true);
    });

  }
  setOverlayersVisible(map, "marker", false);
  const items: SchoolItem[] = targetMarkers.map((m) => m.getExtData());
  targetMarkers.forEach((m) => m.remove());

  mapHelper?.addMarkers(items, {
    showLabel: false,
  });
}
</script>
