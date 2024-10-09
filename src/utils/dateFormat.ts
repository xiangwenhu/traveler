import { ONE_DAY_TICKET, ONE_HOUR_TICKET } from "@/const";

/** 补0 */
export function addZero(num: number) {
    return num < 10 ? `0${num}` : num;
}

/**
 * 周几配置
 */
const WeekDayNumConfig: { [key: number]: string } = {
    0: "日",
    1: "一",
    2: "二",
    3: "三",
    4: "四",
    5: "五",
    6: "六",
};

/**
 * 获取当前日期时间相关信息
 */
export function getDateTime(value?: number | string) {
    const Obj = value ? new Date(value) : new Date();
    const year = Obj.getFullYear();
    const month = addZero(Obj.getMonth() + 1);
    const date = addZero(Obj.getDate());
    const hour = addZero(Obj.getHours());
    const minute = addZero(Obj.getMinutes());
    const second = addZero(Obj.getSeconds());
    const monthNoZero = Obj.getMonth() + 1;
    const dateNoZero = Obj.getDate();
    const hourNoZero = Obj.getHours();
    const minuteNoZero = Obj.getMinutes();
    const secondNoZero = Obj.getSeconds();
    const weekDay = WeekDayNumConfig[Obj.getDay()];
    const result = {
        year,
        month,
        date,
        hour,
        minute,
        second,
        monthNoZero,
        dateNoZero,
        hourNoZero,
        minuteNoZero,
        secondNoZero,
        weekDay,
    };
    return result;
}

export function getDateFormat(value: number | string) {
    const obj = getDateTime(value);
    return (
        obj.year +
        "-" +
        obj.month +
        "-" +
        obj.date +
        " " +
        obj.hour +
        ":" +
        obj.minute +
        ":" +
        obj.second
    );
}
/**
 * 获取年月日
 */
export function getYMD(value?: number | string) {
    if (!value) {
        return "";
    }
    const obj = getDateTime(value);
    return obj.year + "-" + obj.month + "-" + obj.date;
}

/** autoDecimal不足1w 自动化为小数 place小数点位置*/
export function formatW(
    num: number | string,
    autoDecimal = false,
    place: number = 2
): string {
    // check is num
    const number = Number(num);
    if (Number.isNaN(number)) {
        // console.error('num 必须是一个数字'+ number);
        return "NaN";
    }
    const divide = Math.pow(10, place);
    if (number >= 10000) {
        return `${Math.round((number / 10000) * divide) / divide}w`;
    } else {
        return autoDecimal
            ? `${Math.round((number / 10000) * divide) / divide}w`
            : `${Math.round(number * divide) / divide}`;
    }
}

/** 标准时间转时间戳 Fri Oct 21 2022 00:00:00 GMT+0800 (中国标准时间) {} */
export function standardDateStrToTimeStamp(dateStr: string) {
    return new Date(dateStr).getTime();
}
/** 取月份和日 */
export function getMonthDay(value: string | number) {
    const date = new Date(value);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${addZero(month)}-${addZero(day)}`;
}
/** 取小时和分 */
export function getHourMin(value: string | number) {
    const date = new Date(value);
    const hour = date.getHours();
    const minutes = date.getMinutes();
    return `${addZero(hour)}:${addZero(minutes)}`;
}
/** hh：mm：ss */
export function secondFormat(seconds: number, hiddenHour: boolean = false) {
    const hour = Math.trunc(seconds / 3600);
    const minute = Math.trunc((seconds % 3600) / 60);
    const second = Math.trunc(seconds % 60);

    return `${hiddenHour && !hour ? "" : `${addZero(hour)}:`}${addZero(
        minute
    )}:${addZero(second)}`;
}
/** 获取指定一天的开始 */
export function getStartOfDay(date: string | number | Date) {
    return new Date(date).setHours(0, 0, 0, 0);
}

/** 获取指定一天的开始 */
export function getEndOfDay(date: string | number | Date) {
    return new Date(date).setHours(23, 59, 59, 999);
}

/** 获取指定时间对应当月的开始 */
export function getMonthStart(time: string | number) {
    const timeStamp = getStartOfDay(time);
    return new Date(timeStamp).setDate(1);
}

export function getPeriod(endDate: Date | string | number, days: number) {
    const eD = getEndOfDay(endDate);
    const startD = eD - days * ONE_DAY_TICKET;
    const sD = getEndOfDay(startD);
    return [sD, eD];
}

export function getPeriodByHours(endDate: Date | string | number, hours: number) {
    const eD = new Date(endDate).getTime();
    const startD = eD - hours * ONE_HOUR_TICKET;
    return [startD, eD];
}
