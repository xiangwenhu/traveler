<template>
  <div
    style="
      position: absolute;
      top: 10px;
      left: 10px;
      cursor: pointer;
      z-index: 99;
    "
  >
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
  <Detail :map-data="statisticsData" />
</template>

<script setup lang="ts">
import { AreaInfoItem, GeoJSON } from "@/types";
import { onMounted, ref, onBeforeUnmount } from "vue";
import * as echarts from "echarts";
import { ADCODE_CHINA } from "@/const";
import { getGeoJSON } from "@/api/geo";
import { nextTick } from "vue";
import { Back } from "@element-plus/icons";
import { getFilename, getOptions, getRegionParams } from "./util";
import { ElMessage } from "element-plus";
import Detail from "./detail.vue";
import fanPng from "@/assets/images/404_cloud.png";
import { statisticsByRegion, getItems } from "@/api/travel";
import { TravelRegionStatistics } from "@/types/service";
import { calcImageWithFromUrl, getImageSizeByUrl } from "@/utils/media";
import { formatDate } from "@/utils/date";

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

const statisticsData = ref<TravelRegionStatistics[] | undefined>(undefined);

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

  if (
    stacks.length > 0 &&
    areaInfoInfo.adcode === stacks[stacks.length - 1].adcode
  )
    return;
  stacks.push(areaInfoInfo);
}

async function onViewMap(areaInfo: number | AreaInfoItem) {
  const info: AreaInfoItem =
    typeof areaInfo == "number" ? adCodeMap[areaInfo] : areaInfo;
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
    const mapData = await getStatisticsData();
    statisticsData.value = mapData;

    const areaTotal: Record<string, number> = (mapData || []).reduce(
      (obj, it) => {
        obj[it.code] = it.count;
        return obj;
      },
      {} as Record<string | number, number>
    );
    const options: ChartsExtraOptions = {
      data: geoJSON.features.map((f) => ({
        name: f.properties.name,
        adcode: f.properties.adcode,
        // value: 0
        value: areaTotal ? areaTotal[f.properties.adcode] || 0 : 0,
      })),
    };

    const scatterSeries = await getScatterSeries();
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
  } catch (err: any) {
    ElMessage.error(`数据加载失败：${err && err.message}`);
    refChartIns.value?.hideLoading();
  }
}

async function getScatterSeries() {
  const stacks = areaStacks.value;
  // if (stacks.length <= 2) return undefined;
  // if (stacks.length == 3 && stacks[2].childrenNum != 0) return undefined;

  // 中国/河北/石家庄/长安区 | 中国/天津/河西区
  const isLeaf = stacks[stacks.length - 1].childrenNum == 0;

  const params = {
    province: stacks[1]?.adcode,
    city: stacks[2]?.adcode || null,
    county: stacks[3]?.adcode || null,
    pageSize: 100,
    pageNum: 1,
  };

  const res = await getItems(params);
  if (!res || res.code != 0 || !res.data) return undefined;

  const list = res.data.list || [];
  if (list.length == 0) return undefined;

  const validItems = list.filter((d) => {
    return d.latitude > 0 && d.longitude > 0;
  });
  if (validItems.length == 0) return undefined;

  const series: echarts.SeriesOption[] = [];

  for (let i = 0; i < validItems.length; i++) {
    const t = validItems[i];
    const size = isLeaf
      ? await calcImageWithFromUrl(t.cover, { width: 100 })
      : { width: 8, height: 8 };
    const symbol = isLeaf ? `image://${t.cover}` : "circle";
    series.push({
      tooltip: {
        formatter(params: Record<string, any>) {
          // @ts-ignore
          return `${params.data.name} &nbsp;:  &nbsp;${params.data.date}`;
        },
      },
      name: t.title,
      type: "scatter",
      coordinateSystem: "geo",
      data: [
        {
          name: t.title,
          value: [t.longitude, t.latitude, 99],
          // @ts-ignore
          date: formatDate(t.date),
        },
      ],
      symbolSize: [size?.width, size?.height],
      symbolKeepAspect: true,
      symbol: symbol,
      symbolRotate: 0,
      itemStyle: {
        color: "#409eff",
      },
    });
  }

  return series;
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
    refChartIns.value.on(
      "click",
      "series",
      function (params: echarts.ECElementEvent) {
        if (params.componentSubType !== "map") return;
        // @ts-ignore
        const adcode = params.data.adcode as number;
        if (adcode in adCodeMap) {
          const stacks = areaStacks.value!;
          if (stacks.length > 0 && adcode == stacks[stacks.length - 1].adcode)
            return;
          onViewMap(adcode);
        }
      }
    );

    refChartIns.value.on('georoam', function (params) {
      // 更新缩放比例变量"
      // 这里需要根据params计算出实际的缩放比例
      // 例如，如果params.batch[0].start和params.batch[0].end表示数据范围的百分比
      // 那么缩放比例zoomRatio可以是(end - start) / (100 - 0)（这里是一个简化的例子）
      // 但实际上，你可能需要更复杂的逻辑来处理不同情况
      // var zoomRatio = /* 计算缩放比例的逻辑 */;
      // // 更新图表配置，重新渲染
      // option.series[0].symbolSize = function (data) {
      //     return baseSize * zoomRatio;
      // };
      // myChart.setOption(option);
      console.log("dataZoomed", params);
    });

    viewAreaMap(adCodeMap[ADCODE_CHINA]);
  });
  window.addEventListener("resize", onResize);
});

async function getStatisticsData(): Promise<TravelRegionStatistics[]> {
  try {
    const pcas = areaStacks.value!.slice(1);

    const params = getRegionParams(pcas);

    const res = await statisticsByRegion(params);
    if (!res || res.code != 0) return [];

    return res.data! || [];
  } catch (err) {
    ElMessage.error("获取旅行统计信息失败");
    return [];
  }
}

onBeforeUnmount(() => {
  window.removeEventListener("resize", onResize);

  if (refChartIns.value && !refChartIns.value.isDisposed()) {
    refChartIns.value?.dispose();
  }
});
</script>

<style></style>
