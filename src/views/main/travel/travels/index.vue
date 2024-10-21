<template>
  <div>
    <el-button type="primary" @click="onToAdd">新建旅行</el-button>

    <create-form v-if="state.dialog" @close="state.dialog = false"></create-form>
  </div>
</template>






<script setup lang="ts">
import { reactive } from "vue";
import CreateForm from "./CreateForm.vue";

const state = reactive<{
  dialog: boolean;
  editItem: any;
}>({
  dialog: false,
  editItem: undefined,
});

function onToAdd() {
  state.dialog = true;
}
</script>