import { YearsData } from "@/utils/report";

interface CommonNameValue {
    name: string;
    value: number;
}

export function createYearsOptions(
    data: YearsData[],
    opts: {
        title: string;
        mark: boolean;
    }
) {
    const markOptions = {
        markPoint: {
            data: [
                { type: "max", name: "Max" },
                { type: "min", name: "Min" },
            ],
        },
        markLine: {
            data: [{ type: "average", name: "Avg" }],
        },
    };

    const options: echarts.EChartsOption = {
        toolbox: {
            show: true,
            top: "20px",
            feature: {
                magicType: { type: ["line", "bar"] },
                saveAsImage: {},
                dataView: {},
            },
        },
        title: {
            text: opts.title,
            top: "20px",
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
                ...(opts.mark ? markOptions : {}),
                z: 10,
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

export function createPieOptions(opts: {
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
                    color: "#FFFFFF",
                    show: true,
                    // formatter: "{b}: {d}%", // 显示名称和百分比
                    formatter(data) {
                        if (data?.data?.name == "未达") return "";
                        return `已达：${data.percent!}%`;
                    },
                },
            },
        ],
    };
    return options;
}

export function createYearCostOptions(data: YearsData[], opts: {
    title: string;
}) {
    const markOptions = {
        markPoint: {
            data: [
                { type: "max", name: "Max" },
                { type: "min", name: "Min" },
            ],
        },
        markLine: {
            data: [{ type: "average", name: "Avg" }],
        },
    };

    const options: echarts.EChartsOption = {
        toolbox: {
            show: true,
            top: "20px",
            feature: {
                magicType: { type: ["line", "bar"] },
                saveAsImage: {},
                dataView: {},
            },
        },
        title: {
            text: opts.title,
            top: "20px",
        },
        tooltip: {
            trigger: "axis",
        },
        legend: {
            data: ["费用"],
        },
        grid: {
            left: "3%",
            right: "4%",
            bottom: "3%",
            containLabel: true,
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
                name: "费用",
                type: "line",
                // stack: "Total",
                data: data.map((d) => d.cost),
                z: 10,
                ...markOptions
            },
        ],
    };

    return options;
}

export function createYearDaystOptions(data: YearsData[], opts: {
    title: string;
}) {
    const markOptions = {
        markPoint: {
            data: [
                { type: "max", name: "Max" },
                { type: "min", name: "Min" },
            ],
        },
        markLine: {
            data: [{ type: "average", name: "Avg" }],
        },
    };

    const options: echarts.EChartsOption = {
        toolbox: {
            show: true,
            top: "20px",
            feature: {
                magicType: { type: ["line", "bar"] },
                saveAsImage: {},
                dataView: {},
            },
        },
        title: {
            text: opts.title,
            top: "20px",
        },
        tooltip: {
            trigger: "axis",
        },
        legend: {
            data: ["天数"],
        },
        grid: {
            left: "3%",
            right: "4%",
            bottom: "3%",
            containLabel: true,
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
                name: "费用",
                type: "line",
                // stack: "Total",
                data: data.map((d) => d.days),
                z: 10,
                ...markOptions
            },
        ],
    };

    return options;
}
