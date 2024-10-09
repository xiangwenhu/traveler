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
            zoom: options.zoom || 1 ,
            //图形上的文本标签，可用于说明图形的一些数据信息
            label: {
                normal: {
                    show: true,
                    fontSize: 14,
                    color: "rgba(0,0,0)",
                    fontFamily: "Arial",
                },
            },
            //地图区域的多边形 图形样式，有 normal 和 emphasis 两个状态
            itemStyle: {
                //normal 是图形在默认状态下的样式；
                normal: {
                    borderColor: "rgba(0, 0, 0, 0.2)",
                },
                //emphasis 是图形在高亮状态下的样式，比如在鼠标悬浮或者图例联动高亮时。
                emphasis: {
                    areaColor: "#F3B329",
                    shadowOffsetX: 0,
                    shadowOffsetY: 0,
                    shadowBlur: 20,
                    borderWidth: 0,
                    shadowColor: "rgba(0, 0, 0, 0.5)",
                },
            },
        },
        series: [
            {
                name: "设备数量",
                type: "map",
                mapType: `${map}`,
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
                    "#FCDAD5",
                    "#FDE2CA",
                    "#FEEBD0",
                    "#FFFAB3",
                    "#C8E2B1",
                    "#C9E4D6",
                    "#CAE5E8",
                    "#BFCAE6",
                    "#A095C4",
                    "#C9B5D4",
                    "#ECECEC",
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