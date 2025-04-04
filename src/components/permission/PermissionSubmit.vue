<template>
  <el-button type="primary" size="default" :disabled="disabled">
    <slot></slot>
  </el-button>
</template>

<script setup lang="ts">
import { isReadOnlyUser } from "@/store/quick";

const disabled = isReadOnlyUser();
</script>
