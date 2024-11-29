import { EnableStatusMap } from "@/const";
import { formatDate } from "./date";
import { formatW, getYMD } from "./dateFormat";
import { insertComma } from "./numFormat";

// 数字格式化
export function formatter(row: any, column: any, cellValue: number | string) {
    if (cellValue == null) {
        return "--";
    }
    return formatW(cellValue, false);
}

export function secondToHoursFormatter(
    row: any,
    column: any,
    cellValue: number | string
) {
    if (cellValue == null) return;
    return (+cellValue / 60 / 60).toFixed(2);
}

export function negativeFormatter(row: any, column: any, cellValue: number) {
    if (cellValue < 0) {
        return "--";
    }
    return formatW(cellValue, false);
}

export function goldFormatter(row: any, column: any, cellValue: number) {
    return insertComma(cellValue);
}

// 百分率
export function percentFormatter(row: any, column: any, cellValue: number) {
    if (!cellValue) {
        return 0;
    }
    return (Number(cellValue) * 100).toFixed(2) + "%";
}

// 年月日
export function YMDFormat(row: any, column: any, cellValue: number) {
    return getYMD(cellValue);
}

export function createDateFormat(formatter: string = "yyyy-MM-dd") {
    return function (row: any, column: any, cellValue: number | string) {
        if (cellValue == undefined) return "";
        return formatDate(cellValue, formatter);
    };
}

export const dateFormatDefault = createDateFormat();


export function enableStatusFormat(row: any, column: any, type: number) {
    if (type == undefined) return "";
    return EnableStatusMap[type]?.label || "";
}


export function createBooleanFormat(trueText: string = '是', falseText: string = '否') {
    return function (row: any, column: any, cellValue: boolean) {
        return !!cellValue ? trueText : falseText
    };
}

export const defaultBooleanFormat = createBooleanFormat();