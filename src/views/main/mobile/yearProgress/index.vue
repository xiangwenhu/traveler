<template>
  <div class="progress-container">
    <el-statistic title="地点数" :value="total" class="total" />

    <div
      v-for="(item, index) in years"
      :key="item"
      :class="{
        'year-item': true,
        active: activeValue == item,
        completed: activeValue > item,
      }"
    >
      {{ item }}
    </div>

    <el-icon class="close" @click="onClose">
      <Close />
    </el-icon>
  </div>
</template>

<script setup lang="ts">
import { PropType, ref } from "vue";
import {Close} from "@element-plus/icons"

const emits = defineEmits(["close"])

const props = defineProps({
  activeValue: {
    type: Number,
    default() {
      return 0;
    },
  },
  years: {
    type: Array as PropType<number[]>,
    required: true,
  },
  total: {
    type: Number,
    default() {
      return 0;
    },
  },
});


function onClose(){
  emits("close")
}
</script>

<style lang="scss" scoped>
.progress-container {
  position: absolute;
  bottom: 0;
  right: 6px;
  left: 6px;
  display: flex;
  flex-wrap: wrap;
  padding: 0px;
  background-color: #fff;
  z-index: 999;

  .total {
    background-color: #fff;
    color: green;
    margin: 6px;
  }

  .year-item {
    padding: 1vw;
    display: flex;
    align-items: center;
    text-align: center;
    font-size: 12px;
    background: var(--el-color-danger-light-9);
    margin: 1vw;
    // cursor: pointer;
  }

  .year-item.active,
  .year-item.completed {
    color: #fff;
    background-color: green;
  }

  .close{
      position: absolute;
      right: 6px;
      top: 6px;
      cursor: pointer;
  }
}
</style>
