<template>
  <div id="container" class="map-container"></div>
  <canvas id="player-map"></canvas>
  <div class="count-container">
    <div class="num">0</div>
    <div class="txt">地点数量</div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, onBeforeUnmount } from "vue";
import {
  buildFeatureCollection,
  getMinMaxYear,
  getTravelItems,
  LocaGeoFeatureItem,
} from "./util";

const refMap = ref<any>();
let ticket: any = -1;
let isUnmounted = false;

async function init() {
  const map = new AMap.Map("container", {
    zoom: 4.8,
    center: [107.818204, 37.202396],
  });

  refMap.value = map;

  var loca = new Loca.Container({
    map,
  });

  var layer = new Loca.IconLayer({
    loca: loca,
    zooms: [2, 20],
    zIndex: 10,
    visible: false,
  });
  // layer.setAllowCollision(false);

  const items = await getTravelItems();
  const featuresData = buildFeatureCollection(items);

  const { min: MinYear, max: MaxYear } = getMinMaxYear(items);

  var yearRange = [MinYear, MaxYear];
  function updateSource(curYear: number) {
    if (isUnmounted) return;

    let features = featuresData.features.filter((f) => {
      let yy = new Date(f.properties.date).getFullYear();
      return yy <= curYear;
    });
    let n = features.length;
    let dom: HTMLDivElement = document.getElementsByClassName(
      "num"
    )[0] as HTMLDivElement;

    dom.innerText = `${n}`;
    var geo = new Loca.GeoJSONSource({
      data: {
        type: "FeatureCollection",
        features: features,
      },
    });
    layer.setSource(geo);
  }

  map.on("complete", () => {
    updateSource(yearRange[0]);

    layer.setStyle({
      icon: "https://a.amap.com/jsapi/static/image/plugin/marker_red.png",
      iconSize: [20, 24],
      unit: "px", // 像素单位
      offset: [10, 10], // 向右上方偏移 10 像素
    });
    loca.add(layer);
    layer.show();
  });

  // //a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png 蓝

  // var dat = new Loca.Dat();
  // dat.addLayer(layer, "点图层");

  addPlayBar();

  function addPlayBar() {
    var canvasDom = document.getElementById("player-map") as HTMLCanvasElement;

    var _style = getComputedStyle(canvasDom);
    let height = _style.getPropertyValue("height");
    let width = _style.getPropertyValue("width");
    canvasDom.height = parseInt(height.slice(0, -2));
    canvasDom.width = parseInt(width.slice(0, -2));

    var dots = Array.from({ length: MaxYear - MinYear + 1 }, (n, i) => {
      return {
        progress: i * (1 / (MaxYear - MinYear)),
        text: `${MinYear + i}年`,
      };
    });

    const player = new PlayBar({
      canvas: canvasDom,
      option: {
        progressTextCallback: (progress: number) => {
          for (let i = 1; i < dots.length; i++) {
            let cur = dots[i];
            let pre = dots[i - 1];
            if (cur.progress >= progress && pre.progress < progress) {
              return cur && cur.text;
            }
          }
          return "";
        },
        background: "rgba(0,0,0,0)",
        dot: {
          color: "#FFF",
          radius: 6,
          borderWidth: 4,
          hoverColor: "#CCC",
        },
        progressDot: {
          color: "green",
          radius: 10,
        },
        progressColor: "green",
        button: {
          radius: 20,
          color: "#B44322",
          pause: true,
        },
        gap: 30,
        step: 1 / (MaxYear - MinYear),
        playTimeLength: 15,
        padding: 20,
        lineColor: "#FFF",
        lineWidth: 3,
        fontColor: "#FFF",
        fontSize: 16,
      },
      data: {
        dots: dots,
        progress: 0,
      },
    });
    player.play();
    player.on("play", (e) => {
      player.play();
    });
    player.on("pause", (e) => {
      player.pause();
    });
    player.on("click", (e) => {
      for (let i = 1; i < dots.length; i++) {
        let cur = dots[i];
        let pre = dots[i - 1];
        if (cur.progress >= e.progress && pre.progress < e.progress) {
          player.setProgress(cur.progress);
          updateData(cur.progress);
          break;
        }
      }
    });

    player.on("progress", (e) => {
      updateData(e.progress);
      // console.log('e.progress', e.progress);
      if (e.progress >= 1) {
        ticket = setTimeout(() => {
          player.setProgress(0);
          player.play();
        }, 1000);
      }
    });

    function updateData(progress: number) {
      let prog = progress >= 1 ? 1 : progress;
      let len = yearRange[yearRange.length - 1] - yearRange[0];
      let ind = len * prog + yearRange[0];
      updateSource(ind);
    }
  }
}

onMounted(() => {
  isUnmounted = false;
  init();
});

onBeforeUnmount(() => {
  isUnmounted = true;
  clearTimeout(ticket);
  ticket = undefined;
  if (refMap.value) {
    refMap.value.destroy();
  }
});
</script>

<style lang="scss" scoped>
.map-container {
  height: 100%;
}
</style>
<style lang="scss" scoped>
#player-map {
  position: absolute;
  bottom: 20px;
  right: 20px;
  left: 100px;
  width: 80%;
  height: 90px;
  padding: 10px;
  background: rgba(100, 100, 100, 0.6);
}

.count-container {
  position: absolute;
  bottom: 40px;
  left: 10px;
  z-index: 1;
}

.num {
  font-size: 26px;
  color: red;
}

.txt {
  font-size: 16px;
  color: red;
}

.demo-title {
  position: absolute;
  top: 25px;
  left: 25px;
  z-index: 1;
}

h1 {
  font-size: 18px;
  margin: 0;
  color: rgb(180, 180, 190);
}

h3 {
  font-size: 12px;
  font-weight: normal;
  margin-top: 5px;
  color: rgb(150, 150, 150);
}
</style>
