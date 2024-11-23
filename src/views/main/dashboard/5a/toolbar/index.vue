<template>
  <div class="tool-bar">
    <pca :map="map"></pca>
  </div>
</template>



<script setup lang="ts">
import { PropType } from "vue";
import pca from "./pca.vue";
import { TravelItem } from "@/types/service";

const props = defineProps({
  map: {
    type: Object as PropType<AMap.Map>,
    required: true,
  }
});
</script>



<style lang="scss" scoped>
.tool-bar {
  position: absolute;
  top: 0;
  left: 0;
}
</style>