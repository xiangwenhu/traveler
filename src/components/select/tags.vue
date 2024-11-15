<template>
    <el-select clearable filterable>
        <el-option v-for="item in list" :key="item.name" :value="item.id" :label="item.name">
            {{ item.name }}
        </el-option>
    </el-select>
</template>


<script lang="ts" setup>
import { getItems } from "@/api/tags";
import { TagItem } from "@/types/service";
import { onMounted, ref } from "vue";

const list = ref<TagItem[]>();

async function init(){
    try{

        const res = await getItems({
            pageNum: 1,
            pageSize: 1000
        });

        if(!res || res.code != 0) return;
        list.value = res.data?.list || []

    }catch(err){
        console.error("select tags init error:", err);
    }
}

onMounted(init)

</script>