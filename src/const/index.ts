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
