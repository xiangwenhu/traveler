import { EnumCommonStatus, EnumTravelStatus } from "@/types/service";
import { arrayToRecord } from "@/utils";


export const EnableStatusList = [
    {
        label: "启用",
        value: 1,
    },
    {
        label: "禁用",
        value: 0,
    },
];

export const EnableStatusMap = arrayToRecord(EnableStatusList, "value");




export const ONE_HOUR_TICKET = 1 * 60 * 60 * 1000;

export const ONE_DAY_TICKET = 24 * ONE_HOUR_TICKET;

export const ADCODE_CHINA = 100000;


export const Video_Suffix = [".mp4", ".mpeg", ".3pg", ".avi", ".mov"];
export const Image_Suffix = [".png", ".jpg", ".gif", ".jpeg"];


export const COMMON_IMAGE_SUFFIX = [
    '.jpg',
    '.jpeg',
    '.gif',
    '.bmp',
    '.png',
    '.wmf',
    '.emf',
    '.svg',
    '.tga',
    '.tif',
];

export const COMMON_VIDEO_SUFFIX = ['.mp4', '.avi', '.mov', '.mkv', '.flv', '.wmv'];

export const COMMON_AUDIO_SUFFIX = ['.mp3', '.wav', '.ogg', '.flac', '.aac'];


export const TravelStatusList = [
    {
        label: "未启动",
        value: EnumTravelStatus.Unkonwn
    },
    {
        label: "计划中",
        value: EnumTravelStatus.Planing
    },
    {
        label: "已计划",
        value: EnumTravelStatus.Planed
    },
    {
        label: "旅行中",
        value: EnumTravelStatus.Traveling
    },
    {
        label: "已旅行",
        value: EnumTravelStatus.Completed
    },
];

export const TransportList = [
    {
        label: "小轿车",
        value: 1
    },
    {
        label: "动车",
        value: 2
    },
    {
        label: "飞机",
        value: 3
    }, {
        label: "公交车",
        value: 4
    }, {
        label: "自行车",
        value: 5
    }, {
        label: "步行",
        value: 6
    }, {
        label: "轮船",
        value: 7
    }, {
        label: "其他",
        value: 99
    }
]
