<template>
  <el-config-provider :locale="zhCn" :size="size">
    <router-view></router-view>
  </el-config-provider>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useStore } from "vuex";
import zhCn from 'element-plus/es/locale/lang/zh-cn'

export default defineComponent({
  name: "App",
  setup() {
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
    return {
      locale,
      size,
    };
  },
});
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
