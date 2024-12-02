<template>
  <div class="menus-entry" @click="toggleVisible">
    菜单
    <div class="menus" v-if="state.visible">
      <Menu @click="onMenuClick" />
    </div>
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


window.addEventListener("route-change", ()=> {
  state.visible = false;
})

</script>


<style lang="scss" scoped>
.menus-entry {
  height: 60px;
  width: 60px;
  position: fixed;
  bottom: 30px;
  right: 10px;
  background: radial-gradient(circle at 70% 30%, #0aafe6, #222222);
  border-radius: 50%;
  line-height: 60px;
  font-size: 20px;
  text-align: center;
  cursor: pointer;
  color: #fff;
  z-index: 999;
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