<template>
    <el-select clearable filterable>
      <el-option
        v-for="item in list"
        :key="item.name"
        :value="item.account"
        :label="item.name"
      >
        {{ item.name }}
      </el-option>
    </el-select>
  </template>
  
  
  <script lang="ts" setup>
  import { getItems } from "@/api/system/user";
  import { UserItem } from "@/types/service";
  import { onMounted, ref } from "vue";
    
  const list = ref<UserItem[]>();
  
  async function init() {
    try {
  
      const res = await getItems({
        pageNum: 1,
        pageSize: 1000,
      });
  
      if (!res || res.code != 0) return;
      const listVal = res.data?.list || [];
      list.value = listVal;
    } catch (err) {
      console.error("select 5A init error:", err);
    }
  }
  
  onMounted(init);
  </script>