<template>
  <el-form v-bind="$attrs" :label-position="settings.labelPos">
    <slot></slot>
  </el-form>
</template>


<script setup lang="ts">
import { isSmallSizeDevice } from "@/utils/mobile";

const CONFIG = {
  mobile: {
    labelPos: "top",
  },
  pc: {
    labelPos: "left",
  },
};

const settings = getSettings();

function getSettings() {
  const isMobile = isSmallSizeDevice();
  return isMobile ? CONFIG.mobile : CONFIG.pc;
}
</script>