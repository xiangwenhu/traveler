<template>
    <el-select clearable filterable>
        <el-option v-for="item in items" :key="item.value" :value="item.value" :label="item.label">
            {{ item.label }}
        </el-option>
    </el-select>
</template>


<script lang="ts" setup>
import { TravelStatusList as items } from "@/const/index";

</script>