<template>
  <el-select clearable filterable>
    <el-option v-for="item in list" :key="item.name" :value="item.id" :label="item.name">
      {{ item.name }}
    </el-option>
  </el-select>
</template>

<script lang="ts" setup>
import { getItems } from "@/api/school";
import { SchoolItem } from "@/types/service";
import { onMounted, ref } from "vue";
import { useStore } from "vuex";

const store = useStore();

const list = ref<SchoolItem[]>();

async function init() {
  try {
    const items = store.state["school"].items;

    if (Array.isArray(items) && items.length > 0) {
      list.value = items;
      return;
    }

    const res = await getItems({
      pageNum: 1,
      pageSize: 1000,
    });

    if (!res || res.code != 0) return;
    const listVal = res.data?.list || [];
    list.value = listVal;
    store.commit("school/setItems", listVal);
  } catch (err) {
    console.error("select school init error:", err);
  }
}

onMounted(init);
</script>
