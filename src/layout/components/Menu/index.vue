<template>
  <el-scrollbar>
    <el-menu
      class="layout-menu system-scrollbar bottom-fixed-menu"
      background-color="var(--system-menu-background)"
      text-color="var(--system-menu-text-color)"
      active-text-color="var(--system-primary-color)"
      :mode="mode"
      :default-active="activeMenu"
      :class="isCollapse ? 'collapse' : ''"
      :collapse="isCollapse"
      :collapse-transition="false"
      :unique-opened="expandOneMenu"
      :popper-offset="0"
      menu-trigger="click"
      :hide-timeout="500"
      :ellipsis="false"
      :close-on-click-outside="true"
    >
      <menu-item v-for="(menu, key) in allRoutes" :key="key" :menu="menu" />
    </el-menu>
  </el-scrollbar>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
import MenuItem from "./MenuItem.vue";
export default defineComponent({
  props: {
    mode: {
      type: String,
      default: "horizontal",
    },
  },
  components: {
    MenuItem,
  },
  setup(props) {
    const { mode } = props;
    const store = useStore();
    const isCollapse = computed(() => store.state.app.isCollapse);
    const expandOneMenu = computed(() => store.state.app.expandOneMenu);
    const allRoutes = useRouter().options.routes;
    const route = useRoute();
    const activeMenu: any = computed(() => {
      const { meta, path } = route;
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      return path;
    });
    onMounted(() => {});
    return {
      isCollapse,
      expandOneMenu,
      allRoutes,
      activeMenu,
      mode,
    };
  },
});
</script>

<style lang="scss" scoped>
.el-scrollbar {
  background-color: var(--system-menu-background);
  flex: 1;
}
.layout-menu {
  width: 100%;
  border: none;
  display: flex;
  &.collapse {
    margin-left: 0px;
  }
  :deep() {

    .el-menu-item,
    .el-sub-menu {
      background-color: var(--system-menu-background) !important;
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
    }
    .el-menu-item i,
    .el-menu-item-group__title,
    .el-sub-menu__title i {
      color: var(--system-menu-text-color);
    }
    .el-menu-item,
    .el-sub-menu__title {
      &.is-active {
        background-color: var(--system-primary-color) !important;
        color: var(--system-primary-text-color) !important;
        i {
          color: var(--system-primary-text-color) !important;
        }
        &:hover {
          background-color: var(--system-primary-color) !important;
          color: var(--system-primary-text-color) !important;
        }
      }
      &:hover {
        background-color: var(--system-menu-hover-background) !important;
      }
    }
    .el-sub-menu {
      &.is-active {
        > .el-sub-menu__title,
        > .el-sub-menu__title i {
          color: var(--system-menu-submenu-active-color) !important;
        }
      }
      .el-menu-item {
        background-color: var(--system-menu-children-background) !important;
        &.is-active {
          background-color: var(--system-primary-color) !important;
          color: var(--system-primary-text-color) !important;
          &:hover {
            background-color: var(--system-primary-color) !important;
            color: var(--system-primary-text-color) !important;
          }
        }
        &:hover {
          background-color: var(--system-menu-hover-background) !important;
        }
      }
      .el-sub-menu {
        .el-sub-menu__title {
          background-color: var(--system-menu-children-background) !important;
          &:hover {
            background-color: var(--system-menu-hover-background) !important;
          }
        }
      }
    }
  }
}
</style>

<style lang="scss" >

  .menus-entry .el-menu--horizontal{
    height: 40px;
  }

</style>