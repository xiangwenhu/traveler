<template>
  <div class="tool-bar">
    <MouseTool :map="map"></MouseTool>
    <search-map :map="map"></search-map>
    <config-setting @save="onConfigSave" :config="{}"></config-setting>
    <Filter @filter="onFilter" />
  </div>
</template>



<script setup lang="ts">
import { PropType } from "vue";
import ConfigSetting, { IConfigSettings } from "./ConfigSetting.vue";
import { clearAllOverlays, colorRegionsByLevel } from "../util";
import { TravelItem } from "@/types/service";
import { reactive } from "vue";
import { Search } from "@element-plus/icons";
import { useStore } from "vuex";
import { EnumColorRegionLevel } from "@/store/modules/map";
import MouseTool from "../../components/MouseTool.vue";
import SearchMap from "../../components/SearchMap.vue";
import Filter, { FilterData } from "./Filter.vue";

const emits = defineEmits(["refresh", "filter"])

const store = useStore();


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

function onConfigSave(config: IConfigSettings) {
  if (!props.map) return;
  emits("refresh")
}

function onFilter(data: FilterData) {
  emits("filter", data)
}

</script>


<style lang="scss" scoped>
.tool-bar {
  position: absolute;
  right: 10px;
  top: 10px;
  flex-wrap: wrap;

  .map-search {
    cursor: pointer;
  }
}
</style>