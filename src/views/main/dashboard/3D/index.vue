<template>
  <div class="3d-map" ref="refMapEl" id="map-3d"></div>
</template>


<script setup lang="ts">
/* eslint-disable no-undef */
import { statisticsByRegion } from "@/api/travel";
import { PROVINCE_CENTER } from "@/const/map";
import { TravelItem } from "@/types/service";
import { arrayToRecord } from "@/utils";
import { LineLayer, Marker, PointLayer, PolygonLayer, Scene } from "@antv/l7";
import { GaodeMap, Map } from "@antv/l7-maps";
import * as District from "district-data";
import { onMounted, ref } from "vue";
import { setBoundsAndGetFitZoom } from "../map";
import { getTravelItems } from "../map/util";

const refMapEl = ref<HTMLDivElement>();

async function renderMap() {
  const source = new District.RDBSource({
    version: 2023,
  });

  const scene = new Scene({
    id: "map-3d",
    map: new Map({
      center: [111.4453125, 32.84267363195431],
      pitch: 35,
      zoom: 3,
    }),
  });

  scene.addImage(
    "00",
    "https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*PPo0QYHNResAAAAAAAAAAAAADmJ7AQ/original"
  );
  scene.addImage(
    "01",
    "https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*epXiTZ8B1McAAAAAAAAAAAAADmJ7AQ/original"
  );
  scene.addImage(
    "02",
    "https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*6WGaQKkJppIAAAAAAAAAAAAADmJ7AQ/original"
  );
  scene.setBgColor("#131722");
  scene.on("loaded", () => {
    const mapEl = refMapEl.value!;
    // mapEl.style.background = "red";

    onSceneLoaded(scene, source);

    //   source
    //     .getData({
    //       level: "country",
    //       precision: "low",
    //     })
    //     .then((data) => {
    //       // 中国地图填充面
    //       const provincelayer = new PolygonLayer({
    //         autoFit: true,
    //       })
    //         .source(data)
    //         .size(650000)
    //         .shape("extrude")
    //         .color("#5886CF")
    //         .style({
    //           heightfixed: true,
    //           pickLight: true,
    //           opacity: 0.8,
    //         });
    //       // 国界线 九段线
    //       const boundaryLine = new LineLayer({ zIndex: 10 })
    //         .source(data)
    //         .shape("line")
    //         .color("#5DDDFF")
    //         .size(1)
    //         .style({
    //           raisingHeight: 650000,
    //         });

    //       scene.addLayer(boundaryLine);

    //       scene.addLayer(provincelayer);

    //       return "";
    //     });
  });
}

async function onSceneLoaded(scene: Scene, source: District.RDBSource) {
  const items = await getTravelItems();

  const cProvinceMap = arrayToRecord(items, "province");

  source
    .getData({
      level: "province",
      precision: "low",
    })
    .then((data) => {
      const newFeatures = data.features.filter((item) => {
        return item.properties.name;
      });
      const newData = {
        type: "FeatureCollection",
        features: newFeatures,
      };

      const unArrivedFeatures = data.features.filter((item) => {
        return !cProvinceMap[item.properties.adcode];
      });

      // 省份边界
      const unArrivedlines = new LineLayer({
        zIndex: 100,
      })
        .source(newData)
        .shape("line")
        .color("#FFF")
        .size(0.6)
        .style({
          raisingHeight: 650000,
          opacity: 0.8,
        });
      scene.addLayer(unArrivedlines);

      // 未去过的
      const unArrivedlayer = new PolygonLayer({
        visible: true,
      })
        .source({
          type: "FeatureCollection",
          features: unArrivedFeatures,
        })
        .size(650000)
        .shape("extrude")
        .color("#5886CF")
        .style({
          heightfixed: true,
          pickLight: true,
          opacity: 0.8,
        });

      scene.addLayer(unArrivedlayer);

      // 达到过的
      const arrivedFeatures = data.features.filter((item) => {
        return !!cProvinceMap[item.properties.adcode];
      });

      // 去过的
      const arrivedlayer = new PolygonLayer({
        visible: true,
      })
        .source({
          type: "FeatureCollection",
          features: arrivedFeatures,
        })
        .size(650000)
        .shape("extrude")
        .color("#439B61")
        .style({
          heightfixed: true,
          pickLight: true,
          opacity: 0.8,
        });

      scene.addLayer(arrivedlayer);

      return "";
    });

    addLabelMarkers(scene)
}

async function addLabelMarkers(scene: Scene) {
  const pMap = arrayToRecord(PROVINCE_CENTER, "adcode");
  const res = await statisticsByRegion({});

  const pointData = res.data || [];

  for (let i = 0; i < pointData.length; i++) {
    const t = pointData[i];
    const p = pMap[t.code]!;

    const el = document.createElement("label");
    el.className = "labelclass";
    el.textContent = `${t.count}`;
    el.style.background = "#e24c4c8c";
    el.style.borderRadius = "50%"; // 圆角半径设为半个宽度/高度，形成圆形
    el.style.width = "40px";
    el.style.height = "40px";
    el.style.borderColor = "#e24c4c8c";
    el.style.textAlign = "center";
    el.style.lineHeight = "40px";
    el.style.color = "#fff";
    const marker = new Marker({
      element: el,
      offsets: [50, 10],
    }).setLnglat({
      lng: p.center[0] as number,
      lat: p.center[1] as number,
    });
    scene.addMarker(marker);
  }
}

async function init() {
  renderMap();
}

onMounted(init);
</script>