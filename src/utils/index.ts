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