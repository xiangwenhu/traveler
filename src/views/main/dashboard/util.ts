import { ADCODE_CHINA } from "@/const";
import { AreaInfoItem } from "@/types";
import * as echarts from "echarts";
export function getOptions(
    map: string | number,
    options: {
        data: { name: string; value: string | number }[];
        series?: echarts.SeriesOption[];
        center?: (number | string)[];
        zoom?: number;
    }
) {

    let mOptions: echarts.EChartsOption = {
        tooltip: {

        },
        geo: {
            map: `${map}`,
            roam: true,
            scaleLimit: {
                min: 0.6,
                max: 5,
            },
            zoom: options.zoom || 1,
            //图形上的文本标签，可用于说明图形的一些数据信息
            label: {
                show: true,
                fontSize: 14,
                color: "rgba(0,0,0)",
                fontFamily: "Arial",

            },
            //地图区域的多边形 图形样式，有 normal 和 emphasis 两个状态
            itemStyle: {
                //normal 是图形在默认状态下的样式；
                borderColor: "rgba(0, 0, 0, 0.2)",
                areaColor: '#e7e8ea'
            },
            emphasis: {
                itemStyle: {
                    areaColor: "#F3B329",
                    shadowOffsetX: 0,
                    shadowOffsetY: 0,
                    shadowBlur: 20,
                    borderWidth: 0,
                    shadowColor: "rgba(0, 0, 0, 0.5)",
                }
            },
        },
        series: [
            {
                name: "旅行次数",
                type: "map",
                map: `${map}`,
                geoIndex: 0,
                data: options.data,
            },
            ...(options.series || []),
        ],
        visualMap: {
            show: false,
            left: "right",
            min: 1,
            max: 10,
            inRange: {
                color: [
                    "#FFFFFF", // 纯白色
                    "#E6FFE6",
                    "#CCFFCC",
                    "#B3FFB3",
                    "#99FF99",
                    "#80FF80",
                    "#66FF66",
                    "#4CFF4C",
                    "#32FF32",
                    "#19FF19",
                    "#00FF00" // 纯绿色
                ],
            },
            text: ["High", "Low"],
            calculable: true,
        },
    };
    if (options.center) {
        // @ts-ignore
        mOptions.geo!.center = options.center;
    }
    return mOptions;
}

export function getFilename({
    adcode,
    name,
    level,
    childrenNum,
}: AreaInfoItem) {
    if (adcode === ADCODE_CHINA) return `${adcode}_full.json`;
    if (childrenNum == 0) return `${adcode}.json`;
    return level == "district" ? `${adcode}.json` : `${adcode}_full.json`;
}