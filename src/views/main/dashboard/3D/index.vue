<template>
  <div class="3d-map" ref="refMapEl" id="map-3d"></div>
</template>


<script setup lang="ts">
/* eslint-disable no-undef */
import { LineLayer, Marker, PointLayer, PolygonLayer, Scene } from "@antv/l7";
import { GaodeMap, Map } from "@antv/l7-maps";
import * as District from "district-data";
import { onMounted, ref } from "vue";
import { setBoundsAndGetFitZoom } from "../map";

const refMapEl = ref<HTMLDivElement>();

const pointData = [
  {
    data: [113.177855, 23.068432],
    longitude: "113.177855",
    latitude: "23.068432",
    to_longitude: "108.484899",
    to_latitude: "22.826101",
    text: "广州",
    color: "rgb(57,255,20)",
    value: "1",
    unit: "天",
  },
];

async function init() {
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
    mapEl.style.background = "red";
    for (let i = 0; i < pointData.length; i++) {
      const el = document.createElement("label");
      el.className = "labelclass";
      el.textContent = pointData[i].value + pointData[i].unit;
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
        lng: Number(pointData[i].longitude) * 1,
        lat: Number(pointData[i].latitude),
      });
      scene.addMarker(marker);
    }
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
        // 省份边界
        const lineDown = new LineLayer({
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

        scene.addLayer(lineDown);

        const layer = new PolygonLayer({
          visible: true,
        })
          .source(data)
          .shape("extrude")
          .color("red")
          .style({
            heightfixed: true,
            pickLight: true,
            opacity: 0.8,
          });

        scene.addLayer(layer);

        return "";
      });

    source
      .getData({
        level: "country",
        precision: "low",
      })
      .then((data) => {
        // 中国地图填充面
        // debugger
        // const provincelayer = new PolygonLayer({
        //   autoFit: true,
        // })
        //   .source(data)
        //   .size(650000)
        //   .shape("extrude")
        //   .color("#5886CF")
        //   .style({
        //     heightfixed: true,
        //     pickLight: true,
        //     opacity: 0.8,
        //   });
        // 国界线 九段线
        const boundaryLine = new LineLayer({ zIndex: 10 })
          .source(data)
          .shape("line")
          .color("#5DDDFF")
          .size(1)
          .style({
            raisingHeight: 650000,
          });

        scene.addLayer(boundaryLine);

        // scene.addLayer(provincelayer);

        return "";
      });

    const pointLayer = new PointLayer({
      depth: false,
      zIndex: 11,
      heightFixed: true,
    })
      .source(pointData, {
        parser: {
          type: "json",
          x: "longitude",
          y: "latitude",
        },
      })
      .shape("cylinder")
      .size([4, 4, 90])
      .active(true)
      .color("color")
      .style({
        opacity: 1,
        opacityLinear: {
          enable: true, // true - false
          dir: "up", // up - down
        },
        lightEnable: false,
      });
    const pointLayer2 = new PointLayer({ zIndex: 10 })
      .source(pointData, {
        parser: {
          type: "json",
          x: "longitude",
          y: "latitude",
        },
      })
      .shape("circle")
      .active(true)
      .animate(true)
      .size(40)
      .color("color");

    const textLayer = new PointLayer({ zIndex: 2 })
      .source(pointData, {
        parser: {
          type: "json",
          x: "longitude",
          y: "latitude",
        },
      })
      .shape("text", "text")
      .size(14)
      .color("#0ff")
      .style({
        textAnchor: "center", // 文本相对锚点的位置 center|left|right|top|bottom|top-left
        spacing: 2, // 字符间距
        padding: [1, 1], // 文本包围盒 padding [水平，垂直]，影响碰撞检测结果，避免相邻文本靠的太近
        stroke: "#0ff", // 描边颜色
        strokeWidth: 0.2, // 描边宽度
        raisingHeight: 2551000,
        textAllowOverlap: true,
        heightFixed: true,
      });
    const imageLayer = new PointLayer({ zIndex: 15 })
      .source(pointData, {
        parser: {
          type: "json",
          x: "longitude",
          y: "latitude",
        },
      })
      .shape("text", ["00", "01", "02"])
      .size(10)
      .style({
        raisingHeight: 110,
      });
    scene.addLayer(textLayer);
    scene.addLayer(imageLayer);
    scene.addLayer(pointLayer);
    scene.addLayer(pointLayer2);

    return "";
  });
}

onMounted(init);
</script>