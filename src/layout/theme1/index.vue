<template>
  <el-container
    style="height: 100vh"
    :class="{
      '--full-screen': isFullscreen,
    }"
  >
    <div
      class="mask"
      v-show="!isCollapse && !isFullscreen"
      @click="hideMenu"
    ></div>
    <!-- <el-aside
      style="position: relative"
      :width="isCollapse ? '60px' : '250px'"
      :class="isCollapse ? 'hide-aside' : 'show-side'"
      v-show="!isFullscreen"
    >
      <Logo v-if="showLogo" />
      <Menu></Menu>

      <el-icon class="logout" @click="onLoginOut">
        <SwitchButton />
      </el-icon>
    </el-aside> -->
    <el-container>
      <!-- <el-header v-show="!isFullscreen" style="height: 0">
        <Header />
      </el-header> -->
      <!-- <Tabs v-show="!isFullscreen" /> -->
      <el-main>
        <router-view v-slot="{ Component, route }">
          <transition
            :name="route.meta.transition || 'fade-transform'"
            mode="out-in"
          >
            <keep-alive
              v-if="keepAliveComponentsName"
              :include="keepAliveComponentsName"
            >
              <component :is="Component" :key="route.fullPath" />
            </keep-alive>
            <component v-else :is="Component" :key="route.fullPath" />
          </transition>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
  <DiskMenu />
</template>

<script lang="ts" setup>
import { defineComponent, computed, onBeforeMount } from "vue";
import { useStore } from "vuex";
import { useEventListener } from "@vueuse/core";
import Menu from "../components/Menu/index.vue";
import Logo from "../components/Logo/index.vue";
import Header from "./Header/index.vue";
import Tabs from "./Tabs/index.vue";
import FullScreen from "../components/functionList/fullscreen.vue";
import { useFullscreen } from "@vueuse/core";
import { SwitchButton } from "@element-plus/icons";
import DiskMenu from "@/components/DiskMenu/index.vue"

const store = useStore();

const { isFullscreen, toggle } = useFullscreen();
// computed
const isCollapse = computed(() => store.state.app.isCollapse);
const contentFullScreen = computed(() => store.state.app.contentFullScreen);
const showLogo = computed(() => store.state.app.showLogo);
const showTabs = computed(() => store.state.app.showTabs);
const keepAliveComponentsName = computed(
  () => store.getters["keepAlive/keepAliveComponentsName"]
);
// 页面宽度变化监听后执行的方法
const resizeHandler = () => {
  if (document.body.clientWidth <= 1000 && !isCollapse.value) {
    store.commit("app/isCollapseChange", true);
  } else if (document.body.clientWidth > 1000 && isCollapse.value) {
    store.commit("app/isCollapseChange", false);
  }
};
// 初始化调用
resizeHandler();
// beforeMount
onBeforeMount(() => {
  // 监听页面变化
  useEventListener("resize", resizeHandler);
});
// methods
// 隐藏菜单
const hideMenu = () => {
  store.commit("app/isCollapseChange", true);
};

const onLoginOut = () => {
  store.dispatch("user/loginOut");
};
</script>

<style lang="scss" scoped>
.el-header {
  padding-left: 0;
  padding-right: 0;
}
.el-aside {
  display: flex;
  flex-direction: column;
  transition: 0.2s;
  overflow-x: hidden;
  transition: 0.3s;
  &::-webkit-scrollbar {
    width: 0 !important;
  }
}
.el-main {
  background-color: var(--system-container-background);
  height: 100%;
  padding: 16px;
  overflow-x: hidden;
}
:deep(.el-main-box) {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
  position: relative;
}
@media screen and (max-width: 1000px) {
  .el-aside {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    z-index: 1000;
    &.hide-aside {
      left: -250px;
    }
  }
  .mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 999;
    background: rgba(0, 0, 0, 0.5);
  }
}

.--full-screen .el-main {
  padding: 0;
}

.logout {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 10px;
  font-size: 24px;
  color: #fff;
  cursor: pointer;
}
</style>