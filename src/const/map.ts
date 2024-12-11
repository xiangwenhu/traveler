import { AreaInfoItem, EnumLevel } from "@/types";
import { ADCODE_CHINA } from ".";
import { MapStyle } from "@/types/map";

export const CHINA_BOUNDS = [
    [72.152682, 19.510248], // 左下角（大致）
    [135.661319, 53.507449], // 右上角（大致）
];

export const CHINA_CENTER: [number, number] = [(CHINA_BOUNDS[0][0] + CHINA_BOUNDS[1][0]) / 2, (CHINA_BOUNDS[0][1] + CHINA_BOUNDS[1][1]) / 2];



export const CHINA_AREA_INFO: AreaInfoItem = {
    adcode: ADCODE_CHINA,
    name: "中国",
    level: EnumLevel.country,
    childrenNum: 34,
};



export const MAP_STYLE_LIST = [
    {
        label: '靛青蓝',
        value: MapStyle.blue
    }, 
    {
        label: '幻影黑',
        value: MapStyle.dark
    },
    {
        label: '极夜蓝',
        value: MapStyle.darkblue
    },
    {
        label: '草色青',
        value: MapStyle.fresh
    },
    {
        label: '涂鸦',
        value: MapStyle.graffiti
    },
    {
        label: '雅士灰',
        value: MapStyle.grey
    },
    {
        label: '月光银',
        value: MapStyle.light
    },
    {
        label: '马卡龙',
        value: MapStyle.macaron
    },
    {
        label: '远山黛',
        value: MapStyle.whitesmoke
    },
    {
        label: '酱籽',
        value: MapStyle.wine
    }
]