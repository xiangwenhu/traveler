<template>
  <el-icon
    size="large"
    color="#409eff"
    class="icon-setting"
    style="font-size: 2.4rem"
    @click="toggleDrawer"
  >
    <Setting />
  </el-icon>
  <el-drawer
    v-model="state.showDrawer"
    title="设置"
    append-to-body
    class="drawer config-setting-drawer"
    v-if="state.showDrawer"
  >
    <el-form :model="formData" size="large" label-suffix=":" v-bind="formSetting">
      <el-form-item
        label="区域标记级别"
        prop="colorRegionLevel"
        size="large"
        required
      >
        <el-segmented
          v-model="formData.colorRegionLevel"
          :options="ColorRegionLevel"
          style="margin-bottom: 1rem"
        />
      </el-form-item>
      <el-form-item label="仅仅显示中国区域" prop="chinaOnly">
        <el-switch v-model="formData.chinaOnly"> </el-switch>
      </el-form-item>
      <el-form-item label="地图样式" prop="mapStyle">
        <map-style-select v-model="formData.mapStyle"></map-style-select>
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
import { EnumColorRegionLevel, MapSettingState } from "@/store/modules/map";
import { Setting } from "@element-plus/icons";
import { reactive } from "vue";
import { useStore } from "vuex";
import { getFormSettings } from "@/utils/mobile";
import MapStyleSelect from "@/components/select/MapStyle.vue";
import { MapStyle } from "@/types/map";

const formSetting = getFormSettings();


const store = useStore();

const settings: MapSettingState = {
  ...store.getters["map/value"],
} as any;

export interface IConfigSettings {
  colorRegionLevel: EnumColorRegionLevel;
  chinaOnly: boolean;
  mapStyle: MapStyle
}

const emits = defineEmits<{
  (e: "save"): void;
}>();

const ColorRegionLevel = [
  {
    label: "省级",
    value: EnumColorRegionLevel.Province,
  },
  {
    label: "市级",
    value: EnumColorRegionLevel.City,
  },
];

const state = reactive<{
  showDrawer: boolean;
}>({
  showDrawer: false,
});

const props = defineProps<{
  config: Partial<IConfigSettings>;
}>();

function getInitData() {
  return {
    // @ts-ignore
    ...settings,
  } as IConfigSettings;
}

const formData = reactive<IConfigSettings>(getInitData());

function toggleDrawer() {
  state.showDrawer = !state.showDrawer;
}

function onSave() {
  // store.commit("map/setColorRegionLevel", formData.colorRegionLevel);
  store.commit("map/setValue", formData);

  emits("save");
  state.showDrawer = false;
}
</script>
  
<style lang="scss" scoped>
.icon-setting {
  // font-size: 40px;
  cursor: pointer;
}


</style>

<style lang="scss">

.config-setting-drawer {
  min-width: 320px;
}
</style>
  
  