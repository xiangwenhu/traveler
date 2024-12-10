<template>
  <div class="report-container">
    <div class="summary-container flex-w">
      <el-statistic title="总旅行次数" :value="summaryData?.travels" />

      <el-statistic title="已旅行5A数" :value="summaryData?.AAAAAs" />

      <el-statistic title="已旅行高校数" :value="summaryData?.schools" />

      <el-statistic title="已旅行省" :value="summaryData?.provinces" />

      <el-statistic title="已旅行市" :value="summaryData?.cities" />

      <el-statistic title="已旅行县" :value="summaryData?.counties" />
    </div>
    <div class="flex-w flex-c pies-container">
      <chartCom
        :options="pieOptions['5a']"
        v-if="pieOptions['5a']"
        class="c-pie"
      ></chartCom>

      <chartCom
        :options="pieOptions.school"
        v-if="pieOptions.school"
        class="c-pie"
      ></chartCom>

      <chartCom
        :options="pieOptions.province"
        v-if="pieOptions.province"
        class="c-pie"
      ></chartCom>

      <chartCom
        :options="pieOptions.city"
        v-if="pieOptions.city"
        class="c-pie"
      ></chartCom>

      <chartCom
        :options="pieOptions.county"
        v-if="pieOptions.county"
        class="c-pie"
      ></chartCom>
    </div>

    <div class="flex-w">
      <chartCom
        :options="yearsTotalOptions"
        v-if="yearsTotalOptions"
        class="c-years"
      ></chartCom>

      <chartCom
        :options="yearsOptions"
        v-if="yearsOptions"
        class="c-years"
      ></chartCom>
    </div>
  </div>
</template>


<script setup lang="ts">
import { SummaryData, TravelReport, YearsData } from "@/utils/report";
import { onMounted, reactive, ref } from "vue";
import chartCom from "@/components/charts/index.vue";

const yearsTotalOptions = ref<echarts.EChartsOption>();

const yearsOptions = ref<echarts.EChartsOption>();

const summaryData = ref<SummaryData>();

const pieOptions = reactive<{
  "5a"?: echarts.EChartsOption;
  school?: echarts.EChartsOption;
  province?: echarts.EChartsOption;
  city?: echarts.EChartsOption;
  county?: echarts.EChartsOption;
}>({});

function createYearsOptions(data: YearsData[], title: string) {
  const options: echarts.EChartsOption = {
    title: {
      text: title,
    },
    tooltip: {
      trigger: "axis",
    },
    legend: {
      data: ["旅行", "5A景区", "高校", "省"],
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    toolbox: {
      feature: {
        saveAsImage: {},
      },
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: data.map((d) => d.year),
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        name: "旅行",
        type: "line",
        // stack: "Total",
        data: data.map((d) => d.travels),
      },
      {
        name: "5A景区",
        type: "line",
        data: data.map((d) => d.AAAAAs),
      },
      {
        name: "高校",
        type: "line",
        data: data.map((d) => d.schools),
      },
      {
        name: "省",
        type: "line",
        data: data.map((d) => d.provinces),
      },
    ],
  };

  return options;
}

function createPieOptions(opts: {
  title: string;
  data: { value: number; name: string; itemStyle?: any }[];
  series: {
    name: string;
  };
}) {
  const options: echarts.EChartsOption = {
    title: {
      text: opts.title,
      left: "center",
    },
    tooltip: {
      trigger: "item",
    },
    series: [
      {
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
        name: "访问来源",
        type: "pie",
        radius: "55%",
        data: opts.data,
        label: {
          position: "inside",
          color:  '#FFFFFF',
          show: true,
          // formatter: "{b}: {d}%", // 显示名称和百分比
          formatter (data) {
            if(data.data.name == '未达') return ''
            return  `已达：${data.percent!}%`
          },
        },
      },
    ],
  };
  return options;
}

function batchPies(data: SummaryData) {
  const itemStyle = {
    arrived: {
      color: "#91cc75",
    },
    notArrived: {
      color: "#5470c6",
    },
  };

  pieOptions["5a"] = createPieOptions({
    title: "5A",
    data: [
      {
        name: "已达",
        value: data.AAAAAs,
        itemStyle: itemStyle.arrived,
      },
      {
        name: "未达",
        value: 340 - data.AAAAAs,
        itemStyle: itemStyle.notArrived,
      },
    ],
    series: {
      name: "5A",
    },
  });

  pieOptions.school = createPieOptions({
    title: "高校",
    data: [
      {
        name: "已去过",
        value: data.schools,
        itemStyle: itemStyle.arrived,
      },
      {
        name: "未达",
        value: 132 - data.schools,
      },
    ],
    series: {
      name: "高校",
    },
  });

  pieOptions.province = createPieOptions({
    title: "省",
    data: [
      {
        name: "已去过",
        value: data.provinces,
        itemStyle: itemStyle.arrived,
      },
      {
        name: "未达",
        value: 34 - data.provinces,
      },
    ],
    series: {
      name: "省",
    },
  });

  pieOptions.city = createPieOptions({
    title: "市",
    data: [
      {
        name: "已去过",
        value: data.cities,
        itemStyle: itemStyle.arrived,
      },
      {
        name: "未达",
        value: 685 - data.cities,
      },
    ],
    series: {
      name: "市",
    },
  });

  pieOptions.county = createPieOptions({
    title: "县",
    data: [
      {
        name: "已去过",
        value: data.counties,
        itemStyle: itemStyle.arrived,
      },
      {
        name: "未达",
        value: 2844 - data.counties,
      },
    ],
    series: {
      name: "县",
    },
  });
}

async function initData() {
  const r = new TravelReport();

  await r.prepare();

  yearsTotalOptions.value = createYearsOptions(r.yearsTotal(), "旅行-总");
  yearsOptions.value = createYearsOptions(r.years(), "旅行-年");

  const summary = r.summary();
  summaryData.value = summary;

  batchPies(summaryData.value);
}

onMounted(() => {
  initData();
});
</script>


<style lang="scss" scoped>
.report-container {
  .summary-container {
    margin: 30px;
  }

  :deep(.el-statistic) {
    flex: 1;
  }

  :deep(.el-statistic__head) {
    font-size: 16px;
  }
  :deep(.el-statistic__number) {
    font-size: 28px;
  }
}

.c-years {
  margin: 10px;
  height: 300px;
  width: calc(50vw - 36px);
  min-width: 300px;
}

.c-pie {
  width: 300px;
  height: 300px;
}
</style>