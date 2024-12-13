<template>
  <div class="report-container">
    <div class="flex-w wp-100 flex-c">
      <div class="summary-container flex-w flex-c">
        <el-statistic title="旅行" :value="summaryData?.travels" />

        <el-statistic title="天数" :value="summaryData?.days" />

        <el-statistic title="花费" :value="summaryData?.cost" />
      </div>

      <div class="summary-container flex-w flex-c">
        <el-statistic title="5A" :value="summaryData?.AAAAAs" />

        <el-statistic title="高校" :value="summaryData?.schools" />

        <el-statistic title="省" :value="summaryData?.provinces" />

        <el-statistic title="市" :value="summaryData?.cities" />

        <el-statistic title="县" :value="summaryData?.counties" />
      </div>
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

      <chartCom
        :options="yearsCostOptions"
        v-if="yearsCostOptions"
        class="c-years"
      ></chartCom>

      <chartCom
        :options="yearsDaysOptions"
        v-if="yearsDaysOptions"
        class="c-years"
      ></chartCom>
    </div>
  </div>
</template>


<script setup lang="ts">
import { SummaryData, TravelReport, YearsData } from "@/utils/report";
import { onMounted, reactive, ref } from "vue";
import chartCom from "@/components/charts/index.vue";
import {
  createPieOptions,
  createYearCostOptions,
  createYearsOptions,
} from "./util";

const yearsTotalOptions = ref<echarts.EChartsOption>();
const yearsOptions = ref<echarts.EChartsOption>();

const yearsCostOptions = ref<echarts.EChartsOption>();
const yearsDaysOptions = ref<echarts.EChartsOption>();

const summaryData = ref<SummaryData>();

const pieOptions = reactive<{
  "5a"?: echarts.EChartsOption;
  school?: echarts.EChartsOption;
  province?: echarts.EChartsOption;
  city?: echarts.EChartsOption;
  county?: echarts.EChartsOption;
}>({});

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

  yearsTotalOptions.value = createYearsOptions(r.yearsTotal(), {
    title: "旅行-总",
    mark: false,
  });
  yearsOptions.value = createYearsOptions(r.years(), {
    title: "旅行-年",
    mark: true,
  });

  yearsCostOptions.value = createYearCostOptions(r.years(), {
    title: "旅行费用",
  });

  yearsDaysOptions.value = createYearCostOptions(r.years(), {
    title: "旅行天数",
  });

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

  :deep(.el-statistic) {
    min-width: 150px;
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
  width: calc(50vw - 60px);
  min-width: 600px;
}

.c-pie {
  width: 300px;
  height: 300px;
}
</style>