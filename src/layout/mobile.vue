<template>
    <el-container
      style="height: 100vh"
      :class="{
        '--full-screen': true,
      }"
    >

      <el-container>
        <el-header v-show="!isFullscreen" style="height: 0">
          <!-- <Header /> -->
        </el-header>
        <Tabs v-show="!isFullscreen" />
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
  </template>
  
  <script lang="ts" setup>
  import { useEventListener, useFullscreen } from "@vueuse/core";
import { computed, onBeforeMount } from "vue";
import { useStore } from "vuex";
  
  const store = useStore();
  
  const { isFullscreen, toggle } = useFullscreen();
  // computed
  const isCollapse = computed(() => store.state.app.isCollapse);
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
    // padding: 16px;
    overflow-x: hidden;
    --el-main-padding: 0;
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
    padding: 0 0 0 0;
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