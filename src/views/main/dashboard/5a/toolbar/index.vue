<template>
  <div class="tool-bar flex">
    <pca :map="map"></pca>
    <AAAAASelect :map="map" ></AAAAASelect>
  </div>
</template>



<script setup lang="ts">
import { PropType } from "vue";
import pca from "./pca.vue";
import AAAAASelect from "./AAAAASelect.vue";

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
  flex-wrap: wrap;
  width: 100%;
}
</style>