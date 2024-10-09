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

