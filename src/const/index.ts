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


export enum EnumTransport {
    /**
     * 小轿车
     */
    Car = 1,
    /**
     * 高铁或者动车
     */
    HSROrCRH  = 2,
    /**
     * 火车
     */
    Train =  3,
    /**
     * 飞机
     */
    Plane = 4,
    /**
     * 公交车
     */
    Bus = 5,
    /**
     * 自行车
     */
    Bike  = 6,
    /**
     * 步行
     */
    Walk = 7,
    /**
     * 轮船
     */
    Ship = 8,

    /**
     * 其他
     */
    Other = 99

}

export const TransportList = [
    {
        label: "小轿车",
        value: EnumTransport.Car
    },
    {
        label: "高铁动车",
        value: EnumTransport.HSROrCRH
    },
    {
        label: "火车",
        value: EnumTransport.Train
    },
    {
        label: "飞机",
        value: EnumTransport.Plane
    }, {
        label: "公交车",
        value: EnumTransport.Bus
    }, {
        label: "自行车",
        value: EnumTransport.Bike
    }, {
        label: "步行",
        value: EnumTransport.Walk
    }, {
        label: "轮船",
        value: EnumTransport.Ship
    }, {
        label: "其他",
        value: EnumTransport.Other
    }
]


export const TransportMap = arrayToRecord(TransportList, "value")