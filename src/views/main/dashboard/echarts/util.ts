import { ADCODE_CHINA } from "@/const";
import { AreaInfoItem } from "@/types";
import * as echarts from "echarts";
import { copyUnEmptyProperty } from "@/utils/arrHandle";

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
                max: 20,
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
                    areaColor: "silver",
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
            min: 0,
            max: 10,
            inRange: {
                color: [
                    '#FFFFFF',
                    "#B3FFB3",
                    "#99FF99",
                    "#4DFF4D",
                    "#33FF33",
                    "#19FF19",
                    "#00FF00",
                    '#006600'
                ],
            },
            text: ["High", "Low"],
            calculable: true,
        }
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



function buildTravelScatters(stacks: AreaInfoItem[]) {

}



export function getRegionParams(areas: AreaInfoItem[]) {
    const params = copyUnEmptyProperty({
        province: areas[0]?.adcode,
        city: areas[1]?.adcode,
        county: areas[2]?.adcode,
    })
    return params;
}
