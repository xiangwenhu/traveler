<template>
  <teleport to="body">
    <transition name="viewer-fade" appear>
      <div
        ref="wrapper"
        :tabindex="-1"
        :class="`${ns.e('wrapper')} media-viewer`"
        :style="{ zIndex }"
      >
        <div :class="ns.e('mask')" @click.self="hideOnClickModal && hide()" />

        <!-- CLOSE -->
        <span :class="[ns.e('btn'), ns.e('close')]" @click="hide">
          <el-icon>
            <Close />
          </el-icon>
        </span>

        <!-- ARROW -->
        <template v-if="!isSingle">
          <span :class="arrowPrevKls" @click="prev">
            <el-icon>
              <ArrowLeft />
            </el-icon>
          </span>
          <span :class="arrowNextKls" @click="next">
            <el-icon>
              <ArrowRight />
            </el-icon>
          </span>
        </template>
        <!-- ACTIONS -->
        <div :class="[ns.e('btn'), ns.e('actions')]">
          <div :class="ns.e('actions__inner')">
            <el-icon @click="handleActions('zoomOut')">
              <ZoomOut />
            </el-icon>
            <el-icon @click="handleActions('zoomIn')">
              <ZoomIn />
            </el-icon>
            <i :class="ns.e('actions__divider')" />
            <el-icon @click="toggleMode">
              <component :is="mode.icon" />
            </el-icon>
            <i :class="ns.e('actions__divider')" />
            <el-icon @click="handleActions('anticlockwise')">
              <RefreshLeft />
            </el-icon>
            <el-icon @click="handleActions('clockwise')">
              <RefreshRight />
            </el-icon>
          </div>
        </div>
        <!-- CANVAS -->
        <div :class="ns.e('canvas')">
          <div v-for="(item, i) in urlList" :key="`${item.url}${i}`">
            <div v-if="isVideoOrAudio(item.url)">
              <video
                class="video"
                controls
                :src="item.url"
                v-if="i === activeIndex"
                :ref="(el) => (mediaRefs[i] = el as HTMLVideoElement)"
                autoplay
                :style="mediaStyle"
              ></video>
              <div class="title" v-if="i === activeIndex">{{ item.title }}</div>
            </div>

            <div v-else>
              <img
                v-show="i === activeIndex"
                :ref="(el) => (mediaRefs[i] = el as HTMLImageElement)"
                :src="item.url"
                :style="mediaStyle"
                :class="ns.e('img')"
                :crossorigin="crossorigin"
                @load="handleLoad"
                @error="handleError"
                @mousedown="handleMouseDown"
              />
              <div class="title" v-if="i === activeIndex">{{ item.title }}</div>
            </div>
          </div>
        </div>
        <slot />
      </div>
    </transition>
  </teleport>
</template>

<script lang="ts" setup>
import {
  computed,
  effectScope,
  markRaw,
  nextTick,
  onMounted,
  ref,
  shallowRef,
  watch,
} from "vue";
import { useEventListener } from "@vueuse/core";
import throttle from "lodash/throttle";
import { useLocale, useNamespace, useZIndex } from "element-plus";
import { EVENT_CODE } from "element-plus";
import {
  ArrowLeft,
  ArrowRight,
  Close,
  FullScreen,
  RefreshLeft,
  RefreshRight,
  ScaleToOriginal,
  ZoomIn,
  ZoomOut,
} from "@element-plus/icons-vue";
import { imageViewerEmits, imageViewerProps } from "element-plus";

import type { CSSProperties, PropType } from "vue";
import type { ImageViewerAction, ImageViewerMode } from "element-plus";
import { isVideoOrAudio } from "@/utils/media";
import { viewerProps } from "./util";

const modes: Record<"CONTAIN" | "ORIGINAL", ImageViewerMode> = {
  CONTAIN: {
    name: "contain",
    icon: markRaw(FullScreen),
  },
  ORIGINAL: {
    name: "original",
    icon: markRaw(ScaleToOriginal),
  },
};

defineOptions({
  name: "MediaViewer",
});

const props = defineProps(viewerProps);
const emit = defineEmits(imageViewerEmits);

const { t } = useLocale();
const ns = useNamespace("image-viewer");
const { nextZIndex } = useZIndex();
const wrapper = ref<HTMLDivElement>();
const mediaRefs = ref<(HTMLImageElement | HTMLVideoElement)[]>([]);

const scopeEventListener = effectScope();

const loading = ref(true);
const activeIndex = ref(props.initialIndex);
const mode = shallowRef<ImageViewerMode>(modes.CONTAIN);
const transform = ref({
  scale: 1,
  deg: 0,
  offsetX: 0,
  offsetY: 0,
  enableTransition: false,
});
const zIndex = ref(props.zIndex ?? nextZIndex());

const isSingle = computed(() => {
  const { urlList } = props;
  return urlList.length <= 1;
});

const isFirst = computed(() => {
  return activeIndex.value === 0;
});

const isLast = computed(() => {
  return activeIndex.value === props.urlList.length - 1;
});

const currentImg = computed(() => {
  return props.urlList[activeIndex.value];
});

const arrowPrevKls = computed(() => [
  ns.e("btn"),
  ns.e("prev"),
  ns.is("disabled", !props.infinite && isFirst.value),
]);

const arrowNextKls = computed(() => [
  ns.e("btn"),
  ns.e("next"),
  ns.is("disabled", !props.infinite && isLast.value),
]);

const mediaStyle = computed(() => {
  const { scale, deg, offsetX, offsetY, enableTransition } = transform.value;
  let translateX = offsetX / scale;
  let translateY = offsetY / scale;

  const radian = (deg * Math.PI) / 180;
  const cosRadian = Math.cos(radian);
  const sinRadian = Math.sin(radian);
  translateX = translateX * cosRadian + translateY * sinRadian;
  translateY = translateY * cosRadian - (offsetX / scale) * sinRadian;

  const style: CSSProperties = {
    transform: `scale(${scale}) rotate(${deg}deg) translate(${translateX}px, ${translateY}px)`,
    transition: enableTransition ? "transform .3s" : "",
  };
  if (mode.value.name === modes.CONTAIN.name) {
    style.maxWidth = style.maxHeight = "100%";
  }
  return style;
});

function hide() {
  unregisterEventListener();
  emit("close");
}

function registerEventListener() {
  const keydownHandler = throttle((e: KeyboardEvent) => {
    switch (e.code) {
      // ESC
      case EVENT_CODE.esc:
        props.closeOnPressEscape && hide();
        break;
      // SPACE
      case EVENT_CODE.space:
        toggleMode();
        break;
      // LEFT_ARROW
      case EVENT_CODE.left:
        prev();
        break;
      // UP_ARROW
      case EVENT_CODE.up:
        handleActions("zoomIn");
        break;
      // RIGHT_ARROW
      case EVENT_CODE.right:
        next();
        break;
      // DOWN_ARROW
      case EVENT_CODE.down:
        handleActions("zoomOut");
        break;
    }
  });
  const mousewheelHandler = throttle((e: WheelEvent) => {
    const delta = e.deltaY || e.deltaX;
    handleActions(delta < 0 ? "zoomIn" : "zoomOut", {
      zoomRate: props.zoomRate,
      enableTransition: false,
    });
  });

  scopeEventListener.run(() => {
    useEventListener(document, "keydown", keydownHandler);
    useEventListener(document, "wheel", mousewheelHandler);
  });
}

function unregisterEventListener() {
  scopeEventListener.stop();
}

function handleLoad() {
  loading.value = false;
}

function handleError(e: Event) {
  loading.value = false;
  (e.target as HTMLImageElement).alt = t("el.image.error");
}

function handleMouseDown(e: MouseEvent) {
  if (loading.value || e.button !== 0 || !wrapper.value) return;
  transform.value.enableTransition = false;

  const { offsetX, offsetY } = transform.value;
  const startX = e.pageX;
  const startY = e.pageY;

  const dragHandler = throttle((ev: MouseEvent) => {
    transform.value = {
      ...transform.value,
      offsetX: offsetX + ev.pageX - startX,
      offsetY: offsetY + ev.pageY - startY,
    };
  });
  const removeMousemove = useEventListener(document, "mousemove", dragHandler);
  useEventListener(document, "mouseup", () => {
    removeMousemove();
  });

  e.preventDefault();
}

function reset() {
  transform.value = {
    scale: 1,
    deg: 0,
    offsetX: 0,
    offsetY: 0,
    enableTransition: false,
  };
}

function toggleMode() {
  if (loading.value) return;

  const modeNames = Object.keys(modes);
  const modeValues = Object.values(modes);
  const currentMode = mode.value.name;
  const index = modeValues.findIndex((i) => i.name === currentMode);
  const nextIndex = (index + 1) % modeNames.length;
  mode.value = modes[modeNames[nextIndex]];
  reset();
}

function setActiveItem(index: number) {
  const len = props.urlList.length;
  activeIndex.value = (index + len) % len;
}

function prev() {
  if (isFirst.value && !props.infinite) return;
  setActiveItem(activeIndex.value - 1);
}

function next() {
  if (isLast.value && !props.infinite) return;
  setActiveItem(activeIndex.value + 1);
}

function handleActions(action: ImageViewerAction, options = {}) {
  if (loading.value) return;
  const { minScale, maxScale } = props;
  const { zoomRate, rotateDeg, enableTransition } = {
    zoomRate: props.zoomRate,
    rotateDeg: 90,
    enableTransition: true,
    ...options,
  };
  switch (action) {
    case "zoomOut":
      if (transform.value.scale > minScale) {
        transform.value.scale = Number.parseFloat(
          (transform.value.scale / zoomRate).toFixed(3)
        );
      }
      break;
    case "zoomIn":
      if (transform.value.scale < maxScale) {
        transform.value.scale = Number.parseFloat(
          (transform.value.scale * zoomRate).toFixed(3)
        );
      }
      break;
    case "clockwise":
      transform.value.deg += rotateDeg;
      emit("rotate", transform.value.deg);
      break;
    case "anticlockwise":
      transform.value.deg -= rotateDeg;
      emit("rotate", transform.value.deg);
      break;
  }
  transform.value.enableTransition = enableTransition;
}

watch(currentImg, () => {
  nextTick(() => {
    const $media = mediaRefs.value[0];
    // if (!$media?.complete) {
    //   loading.value = true;
    // }
  });
});

watch(activeIndex, (val) => {
  reset();
  emit("switch", val);
});

onMounted(() => {
  registerEventListener();
  // add tabindex then wrapper can be focusable via Javascript
  // focus wrapper so arrow key can't cause inner scroll behavior underneath
  wrapper.value?.focus?.();
});

defineExpose({
  /**
   * @description manually switch image
   */
  setActiveItem,
});
</script>


<style lang="scss" scoped>
.media-viewer {
  .video, .el-image-viewer__img {
    max-height: 90vh !important;
    position: relative;
    max-width: 90vw !important;
  }

  .title {
    position: absolute;
    bottom: 100px;
    left: 0;
    right: 0;
    text-align: center;
    color: #fff;
    z-index: 99;
  }
}
</style>