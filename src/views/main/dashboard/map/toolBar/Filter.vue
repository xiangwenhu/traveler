<template>
  <el-icon class="icon-setting" style="font-size: 2.4rem; --color: #409eff; cursor: pointer;" @click="toggleDrawer">
    <Filter />
  </el-icon>
  <el-drawer v-model="state.showDrawer" title="过滤" append-to-body class="drawer travel-filter-drawer" v-if="state.showDrawer">
    <el-form :model="formData" size="large" label-suffix=":" v-bind="formSetting">
      <el-form-item label="年" prop="year" size="large">
        <el-date-picker v-model="formData.year" placeholder="选择年" type="yearrange" />
      </el-form-item>
      <el-form-item label="省" prop="chinaOnly">
        <tree-select placeholder="选择省" @node-change="onPCAChange" ref="refTree" v-model="formData.province"
          :max-level="1"></tree-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="state.showDrawer = false">关闭</el-button>
        <el-button type="primary" @click="onSave">保存</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { getFormSettings } from "@/utils/mobile";
import { Filter } from "@element-plus/icons-vue"
import { reactive } from "vue";
import TreeSelect from "@/components/PCA/TreeSelect.vue";
import { AreaInfoItem } from "@/types";
import { getYearEnd, getYearStart } from "@/utils/dateFormat";
import { copyUnEmptyProperty } from "@/utils/arrHandle";
import { ADCODE_CHINA } from "@/const";

const formSetting = getFormSettings();

export interface FilterData {
  province?: string | number;
  date?: string;
  endDate?: string;
}


const emits = defineEmits<{
  (e: "filter", data: FilterData): void;
}>();

function getInitData() {
  return {

  };
}

const formData = reactive<{
  year?: any[],
  province?: number | string
}>(getInitData());


const state = reactive<{
  showDrawer: boolean;
}>({
  showDrawer: false,
});

function toggleDrawer() {
  state.showDrawer = !state.showDrawer;
}

async function onPCAChange(data: AreaInfoItem) {
  formData.province = data.adcode
  console.log("formData:", formData)
  if (data.adcode === ADCODE_CHINA) {
    formData.province = ""
  }
}


function onSave() {
  const data: any = {
    province: formData.province
  }

  if (Array.isArray(formData.year) && formData.year.filter(Boolean).length >= 2) {
    data.date = getYearStart(formData.year[0]).toJSON();
    data.endDate = getYearEnd(formData.year[1]).toJSON();
  }

  const sData: FilterData = copyUnEmptyProperty(data);

  console.log("onSave", sData);

  emits("filter", sData)
  toggleDrawer();
}

</script>

<style lang="scss">

.travel-filter-drawer {
  min-width: 320px;
}
</style>
  