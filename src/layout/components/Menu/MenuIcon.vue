<template>
  <el-icon>
    <IconCom />
  </el-icon>
</template>


<script lang="ts" setup>
import * as icons from "@element-plus/icons-vue";

const props = defineProps<{ icon: string }>();

// @ts-ignore
const IconCom = icons[props.icon] || icons.Setting;
</script>