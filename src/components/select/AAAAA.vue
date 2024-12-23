<template>
  <el-select clearable filterable @change="onChange" ref="refSelect">
    <el-option
      v-for="item in list"
      :key="item.name"
      :value="item.id"
      :label="item.name"
    >
      {{ item.name }}
    </el-option>
  </el-select>
</template>


<script lang="ts" setup>
import { getItems } from "@/api/5A";
import { AAAAAItem } from "@/types/service";
import { SelectControl } from "@antv/l7";
import { SelectDropdownInstance } from "element-plus/es/components/select-v2/src/select-dropdown";
import { onMounted, ref } from "vue";
import { useStore } from "vuex";


const refSelect = ref<any>();

const store = useStore();

const list = ref<AAAAAItem[]>();

async function init() {
  try {
    const items = store.state["5A"].items;

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
    store.commit('5A/setItems', listVal)
  } catch (err) {
    console.error("select 5A init error:", err);
  }
}


function onChange(){
  refSelect.value!.blur();
}

onMounted(init);
</script>