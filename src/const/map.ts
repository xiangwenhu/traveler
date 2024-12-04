import { AreaInfoItem, EnumLevel } from "@/types";
import { ADCODE_CHINA } from ".";

export const CHINA_BOUNDS = [
    [72.152682,19.510248], // 左下角（大致）
    [135.661319,53.507449], // 右上角（大致）
];

export const CHINA_CENTER: [number, number] = [(CHINA_BOUNDS[0][0] + CHINA_BOUNDS[1][0]) / 2, (CHINA_BOUNDS[0][1] + CHINA_BOUNDS[1][1]) / 2];



export const CHINA_AREA_INFO: AreaInfoItem = {
    adcode: ADCODE_CHINA,
    name: "中国",
    level:  EnumLevel.country,
    childrenNum: 34,
  };