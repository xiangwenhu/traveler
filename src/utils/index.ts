import { ElMessage } from "element-plus";
import _ from "lodash";

export function delay(duration: number = 1000) {
    return new Promise((resolve) => {
        setTimeout(resolve, duration);
    });
}

export function arrayToRecord<T extends Record<string, any>>(
    arr: T[] = [],
    key: keyof T | string
): Record<string, T> {
    return arr.reduce((obj: Record<string, T>, cur) => {
        obj[_.get(cur, key)] = cur;
        return obj;
    }, {} as Record<string, T>);
}

export function copyData(content: any) {
    let input = document.createElement("input");
    input.value = `${content}`
    document.body.appendChild(input);
    input.select();
    document.execCommand("Copy");
    document.body.removeChild(input);
    ElMessage({
        type: "success",
        message: "复制成功",
    });
}


export function getLatitudeAndLongitude(coordinates: string) {
    const arr = coordinates.split(",").map(v => +v.trim());
    return {
        longitude: arr[0],
        latitude: arr[1]
    }
}

export function isMobile(): boolean {
    // 获取用户代理信息
    // @ts-ignore
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;

    // 检测常见的移动设备标识符
    const mobileKeywords = ['Mobi', 'Android', 'iPhone', 'iPad', 'Windows Phone', 'iPod'];

    // 遍历关键字数组，如果用户代理包含任何一个关键字，则认为是移动设备
    for (let keyword of mobileKeywords) {
        if (userAgent.indexOf(keyword) !== -1) {
            return true;
        }
    }

    // 如果没有匹配到任何关键字，则认为不是移动设备
    return false;
}