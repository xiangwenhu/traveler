<template>
  <div style="position: absolute; top: 10px; left: 10px; cursor: pointer; z-index: 99">
    <el-space>
      <div
        style="display: inline-block; cursor: pointer"
        class="center"
        @click="onBack()"
        :class="{
          disabled: areaStacks.length === 1,
        }"
      >
        <el-icon size="large" style="vertical-align: bottom">
          <Back />
        </el-icon>
        返回
      </div>
    </el-space>
  </div>

  <div id="main" style="height: 100%; width: 100%" ref="refDom"></div>
  <!-- <Detail :map-data="terminalMapData" /> -->
</template>

<script setup lang="ts">
import { AreaInfoItem, GeoJSON } from "@/types";
import { onMounted, ref, onBeforeUnmount } from "vue";
import * as echarts from "echarts";
import { ADCODE_CHINA } from "@/const";
import { getGeoJSON } from "@/api/geo";
import { nextTick } from "vue";
import { Back } from "@element-plus/icons";
import { getFilename, getOptions } from "./util";
import { ElMessage } from "element-plus";
import { copyUnEmptyProperty } from "@/utils/arrHandle";
import Detail from "./detail.vue";
import { TerminalMapData } from "@/types/map";
import fanPng from "@/assets/images/fan.png";
import { arrToPCAData } from "@/utils/pca";
import { pcaManager } from "@/store/global/pca";

const adCodeMap: Record<string, AreaInfoItem> = {
  [ADCODE_CHINA]: {
    adcode: ADCODE_CHINA,
    name: "中国",
    level: "country",
    childrenNum: 34,
  },
};

const levelHandlerMap = {
  country: viewAreaMap,
  province: viewAreaMap,
  city: viewAreaMap,
  district: viewAreaMap,
};

const areaStacks = ref<AreaInfoItem[]>([]);

const terminalMapData = ref<TerminalMapData | undefined>(undefined);

function onBack() {
  const stacks = areaStacks.value;

  if (stacks.length === 1) {
    return;
  }
  stacks.pop();
  const adcode = stacks[stacks.length - 1];
  stacks.pop();
  onViewMap(adcode);
}

function pushStack(areaInfoInfo: AreaInfoItem) {
  const stacks = areaStacks.value;

  if (stacks.length > 0 && areaInfoInfo.adcode === stacks[stacks.length - 1].adcode)
    return;
  stacks.push(areaInfoInfo);
}

async function onViewMap(areaInfo: number | AreaInfoItem) {
  const info: AreaInfoItem = typeof areaInfo == "number" ? adCodeMap[areaInfo] : areaInfo;
  const handler = levelHandlerMap[info.level];
  console.log("onViewMap:", info);
  await handler(info);
  console.log("stacks:", areaStacks);
}

// https://lbs.amap.com/api/javascript-api-v2/guide/services/district-search
const refDom = ref<HTMLDivElement>();
const refChartIns = ref<echarts.ECharts>();

interface ChartsExtraOptions {
  data: { name: string; value: string | number }[];
  series?: echarts.SeriesOption[];
  center?: (number | string)[];
  zoom?: number;
}

function initEcharts(map: string | number, options: ChartsExtraOptions) {
  const mOptions = getOptions(map, options);
  // chartInstance.value!.clear();
  refChartIns.value!.setOption(mOptions, true);
}

async function ensureGeoJSON(areaInfo: AreaInfoItem) {
  const { adcode, level, childrenNum } = areaInfo;
  const mapData = echarts.getMap(`${adcode}`);

  let geoJSON: GeoJSON;
  if (mapData) {
    geoJSON = mapData.geoJSON;
  } else {
    const fName = getFilename(areaInfo);
    geoJSON = await getGeoJSON(fName);
    // geoJSON.features = geoJSON.features.filter((f) => f.properties.name);
    echarts.registerMap(`${adcode}`, geoJSON as any);
  }

  geoJSON.features.forEach((p) => {
    adCodeMap[p.properties.adcode] = {
      adcode: p.properties.adcode,
      name: p.properties.name,
      level: p.properties.level,
      childrenNum: p.properties.childrenNum,
    };
  });

  return geoJSON;
}

async function viewAreaMap(areaInfo: AreaInfoItem) {
  try {
    refChartIns.value?.showLoading();
    const { adcode, level, childrenNum } = areaInfo;
    const geoJSON: GeoJSON = await ensureGeoJSON(areaInfo);

    pushStack(areaInfo);

    // TODO:: 获取设备数据
    const mapData: TerminalMapData = await getMapData();
    terminalMapData.value = mapData;

    const areaTotal: Record<string, number> = (mapData?.areaTotal || []).reduce(
      (obj, it) => {
        const keys = Object.keys(it);
        obj[keys[0]] = +it[keys[0]];
        return obj;
      },
      {} as Record<string, number>
    );
    const options: ChartsExtraOptions = {
      data: geoJSON.features.map((f) => ({
        name: f.properties.name,
        adcode: f.properties.adcode,
        // value: 0
        value: mapData?.areaTotal
          ? areaTotal[f.properties.name as string] || 0
          : mapData.total,
      })),
    };

    const scatterSeries = getScatterSeries(mapData);
    if (Array.isArray(scatterSeries)) {
      // @ts-ignore
      options.series = scatterSeries;
    }

    if (adcode == ADCODE_CHINA) {
      options.center = [112.641447, 36.425509];
      options.zoom = 1.6;
    }
    initEcharts(adcode, options);
    refChartIns.value?.hideLoading();
    planRefresh();
  } catch (err: any) {
    ElMessage.error(`数据加载失败：${err && err.message}`);
    refChartIns.value?.hideLoading();
  }
}

const regex_coordinate = /^-?(\d|1[0-7]?|\d\d|\d\d\d|1[0-7]\d\d|\d\d[0-7]?)\.{1}\d+,-?(\d|[1-8]?\d|\d\d|90)\.{1}\d+$/;

function getScatterSeries(data: TerminalMapData) {
  if (!data || !data.devInfos) return undefined;
  const validItems = (data.devInfos || []).filter((d) => {
    return regex_coordinate.test(d.coordinate || "");
  });
  if (validItems.length == 0) return undefined;

  const dataArr = validItems.map((it) => {
    const coordinateArr = it.coordinate
      .split(",")
      .map((c) => +c)
      .slice(0, 2);
    return {
      name: it.deviceName,
      value: coordinateArr,
      state: it.state
    };
  });
  const series: echarts.SeriesOption[] = [
    {      
      tooltip: {
          formatter(params, ticket) {
            // @ts-ignore
            return `${params.data.name} &nbsp;:  &nbsp;${params.data.state}`;
          },
        },
      name: "设备信息",
      type: "scatter",
      coordinateSystem: "geo",
      data: dataArr,
      symbolSize: 20,
      // symbol: "image://http://localhost:3001/images/fan.png", // 这里填写你想要展示的图片的URL
      symbol: `image://${fanPng}`,
      symbolRotate: 0,

      // data: [
      //   {
      //     name: "",
      //     value: [88.718619, 38.138863], // 这里填写具体的经纬度和图片URL
      //   },
      // ],
      // symbolSize: 20,
      // symbol: "image://http://localhost:3001/images/fan.png", // 这里填写你想要展示的图片的URL
      // symbolRotate: 0,
    },
  ];

  return series
}

function onResize() {
  if (refChartIns.value) {
    const options = refChartIns.value.getOption();
    refChartIns.value.resize();
    refChartIns.value.setOption(options, true);
  }
}

onMounted(() => {
  nextTick(() => {
    refChartIns.value = echarts.init(refDom.value);
    refChartIns.value.on("click", "series", function (params: echarts.ECElementEvent) {
      if (params.componentSubType !== "map") return;
      // @ts-ignore
      const adcode = params.data.adcode as number;
      if (adcode in adCodeMap) {
        const stacks = areaStacks.value!;
        if (stacks.length > 0 && adcode == stacks[stacks.length - 1].adcode) return;
        onViewMap(adcode);
      }
    });
    viewAreaMap(adCodeMap[ADCODE_CHINA]);
  });
  window.addEventListener("resize", onResize);
});

async function getMapData() {
  try {
    const pcas = areaStacks.value!.slice(1);

    if (!pcaManager.initialized) {
      await pcaManager.init();
    }

    // debugger;
    const oriParams = pcaManager.getMapQuery(pcas);

    const params = copyUnEmptyProperty(oriParams);

    // const res = await getTerminalMapData(params);
    // if (!res || res.code != 200) return;

    // return res.data || {};
    return {};
  } catch (err) {
    ElMessage.error("获取设备信息失败");
  }
}

let ticket: any;
function planRefresh() {
  clearTimeout(ticket);
  ticket = setTimeout(() => {
    const area = areaStacks.value[areaStacks.value.length - 1] || adCodeMap[ADCODE_CHINA];
    viewAreaMap(area);
    planRefresh();
  }, 30 * 1000);
}

onBeforeUnmount(() => {
  clearTimeout(ticket);
  window.removeEventListener("resize", onResize);

  if (refChartIns.value && !refChartIns.value.isDisposed()) {
    refChartIns.value?.dispose();
  }
});
</script>

<style></style>
