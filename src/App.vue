<template>
  <el-config-provider :locale="zhCn" :size="size">
    <router-view></router-view>
  </el-config-provider>
</template>

<script lang="ts" setup>
import { defineComponent, computed, onMounted, onBeforeUnmount } from "vue";
import { useI18n } from "vue-i18n";
import { useStore } from "vuex";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import "./app.scss";
import { useFullscreen } from "@vueuse/core";
import { createOSSClient } from "./utils/ali-oss";

const { isFullscreen, toggle } = useFullscreen();

const store = useStore();
const i18n = useI18n({
  silentTranslationWarn: true,
  missingWarn: false,
  silentFallbackWarn: true,
  fallbackWarn: false,
  legacy: false,
});
const size = computed(() => "default");
const messages: any = i18n.messages.value;
const locale = computed(() => {
  return {
    name: i18n.locale.value,
    el: messages[i18n.locale.value].el,
  };
});

function checkFullScreen() {
  const fullscreenElement =
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.mozFullScreenElement ||
    document.msFullscreenElement ||
    window.innerHeight === screen.height;
  if (fullscreenElement) {
    !isFullscreen.value && toggle();
    console.log("进入全屏模式");
  } else {
    isFullscreen.value && toggle();
    console.log("退出全屏模式");
  }
}

onMounted(() => {
  window.addEventListener("resize", checkFullScreen);
  window.addEventListener("load", checkFullScreen);
  createOSSClient();
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", checkFullScreen);
  window.removeEventListener("load", checkFullScreen);
});

// 监听全屏状态变化
document.addEventListener(
  "fullscreenchange",
  function () {
    if (document.fullscreenElement) {
      console.log("进入了全屏模式");
    } else {
      console.log("退出了全屏模式");
    }
  },
  false
);
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100%;
  height: 100vh;
}
:focus-visible {
  outline: none;
}
</style>
