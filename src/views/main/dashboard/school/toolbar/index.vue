<template>
  <div class="tool-bar flex">
    <pca :map="map"></pca>
    <SchoolSelect :map="map"></SchoolSelect>
  </div>
</template>



<script setup lang="ts">
import { PropType } from "vue";
import pca from "./pca.vue";
import SchoolSelect from "./SchoolSelect.vue";

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