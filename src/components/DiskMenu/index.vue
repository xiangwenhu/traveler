<template>
  <!-- <div class="menus-entry" @click="toggleVisible">
    菜单
    <div class="menus" v-if="state.visible">
      <Menu @click="onMenuClick" />
    </div>
  </div> -->

  <div class="menus-entry">
    <Menu @click="onMenuClick" />
  </div>
</template>


<script setup lang="ts">
import { onMounted, reactive } from "vue";
import { useRouter } from "vue-router";
import { MapLocation, Setting, Phone, Ship } from "@element-plus/icons-vue";
import Menu from "@/layout/components/Menu/index.vue";

const state = reactive<{
  visible: boolean;
}>({
  visible: false,
});

const router = useRouter();

function init() {}

function toggleVisible() {
  state.visible = !state.visible;
}

function onMenuClick(ev: Event) {
  ev.stopImmediatePropagation();
}

onMounted(init);

window.addEventListener("route-change", () => {
  state.visible = false;
});
</script>


<style lang="scss" scoped>
.menus-entry {
  height: 40px;
  // width: 60px;
  // width: 200px;
  position: fixed;
  bottom: 0px;
  right: 2px;
  left: 2px;
  background: radial-gradient(circle at 70% 30%, #0aafe6, #222222);
  border-radius: 50%;
  // line-height: 60px;
  font-size: 20px;
  text-align: center;
  cursor: pointer;
  color: #fff;
  z-index: 990;
  // left: 50%;
  // transform: translateX(-50%);

  :deep(.el-sub-menu__title){
    padding: 0 10px;
  }

}

.menus {
  position: absolute;
  bottom: 40px;
  background-color: cornflowerblue;
  display: flex;
  flex-direction: column;
  font-size: 30px;
}
</style>