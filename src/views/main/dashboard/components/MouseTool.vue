
<template>
  <span
    :class="{ rule: true, enabled: state.enabledRangingTool, disabled: !state.enabledRangingTool }"
    @click="onToggleRule"
  >
    <svg
      t="1734512385135"
      class="icon"
      viewBox="0 0 1050 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M700.006985 132.490872a67.302111 67.302111 0 0 0 0 96.726464 70.22829 70.22829 0 0 0 97.539292 0 67.302111 67.302111 0 0 0 0-96.726464 70.390856 70.390856 0 0 0-97.539292 0z m63.40054 61.774884a21.296079 21.296079 0 0 1-29.424353 0 18.532465 18.532465 0 0 1 0-26.823305 21.296079 21.296079 0 0 1 29.424353 0 18.532465 18.532465 0 0 1 0 26.823305z"
        fill="#409eff"
        p-id="4235"
      ></path>
      <path
        d="M1030.502619 239.784093L803.886331 19.345293a69.090332 69.090332 0 0 0-95.751071 0L20.15812 689.115098a66.164153 66.164153 0 0 0 0 95.100809L246.611843 1004.654707a69.090332 69.090332 0 0 0 95.751072 0l688.139704-669.769805a66.164153 66.164153 0 0 0 0-95.100809z m-33.976186 60.14923l-41.291634 40.153675-90.38641-89.085887a24.384823 24.384823 0 1 0-34.301318 34.789014L920.28322 373.900619l-60.311796 58.848706-99.977774-98.67725a24.384823 24.384823 0 1 0-34.301318 34.789014l99.327512 97.539292L764.057787 525.411653l-118.185109-116.559454a24.384823 24.384823 0 1 0-34.301317 34.789014l117.534846 115.746626L669.607239 617.748849 601.4923 550.934434A24.384823 24.384823 0 0 0 567.028417 585.235752L634.005398 652.212732l-60.311796 58.686141-153.949516-151.836165a24.384823 24.384823 0 0 0-34.301317 34.789014l153.299254 151.023338-60.311796 58.68614L390.157168 715.288141a24.384823 24.384823 0 0 0-34.301318 34.789014l88.760756 87.460232-60.311796 58.686141-105.667566-104.204477A24.384823 24.384823 0 1 0 243.84823 826.808065l105.017304 103.391649L308.874425 969.703127a19.995555 19.995555 0 0 1-27.798699 0L54.134307 749.264328a17.394507 17.394507 0 0 1 0-25.197651l688.139705-669.769804a19.995555 19.995555 0 0 1 27.798698 0L996.363867 274.735672a17.394507 17.394507 0 0 1 0 25.197651z"
        fill="#409eff"
        p-id="4236"
      ></path>
    </svg>
  </span>
</template>


<script setup lang="ts">
import {
  onBeforeUnmount,
  onMounted,
  onUnmounted,
  PropType,
  reactive,
  ref,
} from "vue";

const props = defineProps({
  map: {
    type: Object as PropType<AMap.Map>,
    required: true,
  },
});

const state = reactive<{
  enabledRangingTool: boolean;
}>({
  enabledRangingTool: false,
});

const refRangingTool = ref<AMap.RangingTool>();

function onToggleRule() {
  if (state.enabledRangingTool) {
    if (refRangingTool.value) {
      let tool = refRangingTool.value;
      tool.turnOff(true);
    }
  } else {
    if (!refRangingTool.value) {
      refRangingTool.value = createRangingTool();
    }
    refRangingTool.value.turnOn();
  }

  state.enabledRangingTool = !state.enabledRangingTool;
}


function createRangingTool() {
  // @ts-ignore
  const rangingTool = new AMap.RangingTool(props.map, {
    startMarkerOptions: {
      //可缺省
      icon: new AMap.Icon({
        size: new AMap.Size(19, 31), //图标大小
        imageSize: new AMap.Size(19, 31),
        image: "//webapi.amap.com/theme/v1.3/markers/b/start.png",
      }),
      offset: new AMap.Pixel(-9, -31),
    },
    endMarkerOptions: {
      //可缺省
      icon: new AMap.Icon({
        size: new AMap.Size(19, 31), //图标大小
        imageSize: new AMap.Size(19, 31),
        image: "//webapi.amap.com/theme/v1.3/markers/b/end.png",
      }),
      offset: new AMap.Pixel(-9, -31),
    },
    midMarkerOptions: {
      //可缺省
      icon: new AMap.Icon({
        size: new AMap.Size(19, 31), //图标大小
        imageSize: new AMap.Size(19, 31),
        image: "//webapi.amap.com/theme/v1.3/markers/b/mid.png",
      }),
      offset: new AMap.Pixel(-9, -31),
    },
    lineOptions: {
      //可缺省
      strokeStyle: "solid",
      strokeColor: "#FF33FF",
      strokeOpacity: 1,
      strokeWeight: 2,
    },
  });

  return rangingTool;
}


</script>

<style lang="scss" scoped>
.rule {
  display: inline-block;
  height: 40px;
  width: 40px;
  cursor: pointer;
}

.enabled {
  color: #409eff;
}

.disabled {
  filter: grayscale(1);
}
</style>