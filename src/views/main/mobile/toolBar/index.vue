<template>
  <div class="tool-bar">
    <search-map  :map="map" ></search-map>
    <config-setting @save="onConfigSave" :config="{}"></config-setting>
  </div>
</template>



<script setup lang="ts">
import { PropType } from "vue";
import ConfigSetting, { IConfigSettings } from "./ConfigSetting.vue";
import SearchMap from "./SearchMap.vue";
import { clearAllOverlays, colorRegionsByLevel } from "../util";
import { TravelItem } from "@/types/service";
import { reactive } from "vue";
import { Search } from "@element-plus/icons";
import { useStore } from "vuex";
import { EnumColorRegionLevel } from "@/store/modules/map";

const emits = defineEmits(["refresh"])

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

</script>


<style lang="scss" scoped>
.tool-bar {
  position: absolute;
  right: 10px;
  top: 10px;

  .map-search {
    cursor: pointer;
  }
}
</style>