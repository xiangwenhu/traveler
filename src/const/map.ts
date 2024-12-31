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
];


export const PROVINCE_CENTER = [
    {
        "adcode": 110000,
        "center": [116.407396, 39.9042],
        "name": "北京市"
    },
    {
        "adcode": 120000,
        "center": [117.200983, 39.084158],
        "name": "天津市"
    },
    {
        "adcode": 130000,
        "center": [114.539736, 38.035099],
        "name": "河北省"
    },
    {
        "adcode": 140000,
        "center": [112.549248, 37.857014],
        "name": "山西省"
    },
    {
        "adcode": 150000,
        "center": [111.650523, 40.817614],
        "name": "内蒙古自治区"
    },
    {
        "adcode": 210000,
        "center": [123.429096, 41.796768],
        "name": "辽宁省"
    },
    {
        "adcode": 220000,
        "center": [125.3245, 43.886841],
        "name": "吉林省"
    },
    {
        "adcode": 230000,
        "center": [126.642464, 45.756967],
        "name": "黑龙江省"
    },
    {
        "adcode": 310000,
        "center": [121.473701, 31.230416],
        "name": "上海市"
    },
    {
        "adcode": 320000,
        "center": [118.773942, 32.05863],
        "name": "江苏省"
    },
    {
        "adcode": 330000,
        "center": [120.153576, 30.267153],
        "name": "浙江省"
    },
    {
        "adcode": 340000,
        "center": [117.283042, 31.86119],
        "name": "安徽省"
    },
    {
        "adcode": 350000,
        "center": [119.306236, 26.075301],
        "name": "福建省"
    },
    {
        "adcode": 360000,
        "center": [115.892151, 28.676493],
        "name": "江西省"
    },
    {
        "adcode": 370000,
        "center": [117.000923, 36.675807],
        "name": "山东省"
    },
    {
        "adcode": 410000,
        "center": [113.649634, 34.757982],
        "name": "河南省"
    },
    {
        "adcode": 420000,
        "center": [114.311764, 30.593066],
        "name": "湖北省"
    },
    {
        "adcode": 430000,
        "center": [112.982289, 28.195681],
        "name": "湖南省"
    },
    {
        "adcode": 440000,
        "center": [113.280637, 23.125178],
        "name": "广东省"
    },
    {
        "adcode": 450000,
        "center": [108.32194, 22.828427],
        "name": "广西壮族自治区"
    },
    {
        "adcode": 460000,
        "center": [110.33119, 20.031924],
        "name": "海南省"
    },
    {
        "adcode": 500000,
        "center": [106.551556, 29.563009],
        "name": "重庆市"
    },
    {
        "adcode": 510000,
        "center": [104.065735, 30.651632],
        "name": "四川省"
    },
    {
        "adcode": 520000,
        "center": [106.730811, 26.587793],
        "name": "贵州省"
    },
    {
        "adcode": 530000,
        "center": [102.712251, 25.040609],
        "name": "云南省"
    },
    {
        "adcode": 540000,
        "center": [91.132211, 29.665036],
        "name": "西藏自治区"
    },
    {
        "adcode": 610000,
        "center": [108.948024, 34.263163],
        "name": "陕西省"
    },
    {
        "adcode": 620000,
        "center": [103.823557, 35.751892],
        "name": "甘肃省"
    },
    {
        "adcode": 630000,
        "center": [91.717516, 35.137898],
        "name": "青海省"
    },
    {
        "adcode": 640000,
        "center": [106.270439, 38.474818],
        "name": "宁夏回族自治区"
    },
    {
        "adcode": 650000,
        "center": [87.61681, 43.792818],
        "name": "新疆维吾尔自治区"
    }
]