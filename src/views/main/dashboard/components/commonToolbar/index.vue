<template>
  <div class="common-tool-bar">
    <MouseTool :map="map"></MouseTool>
    <search-map :map="map"></search-map>
  </div>
</template>



<script setup lang="ts">
import { PropType } from "vue";
import MouseTool from "../MouseTool.vue";
import SearchMap from "../SearchMap.vue";

const emits = defineEmits(["refresh"])

const props = defineProps({
  map: {
    type: Object as PropType<AMap.Map>,
    required: true,
  }
});

</script>


<style lang="scss" scoped>
.common-tool-bar {
  position: absolute;
  right: 10px;
  top: 10px;
  flex-wrap: wrap;

  .map-search {
    cursor: pointer;
  }
}
</style>