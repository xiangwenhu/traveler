import { ResWeather } from "@/types/proxy";
import { ResData } from "@/types/request";
import request from "@/utils/system/request";

// 获取数据api
export function getResultByUrl(params: {
    url: string;
}): Promise<ResData> {
    return request({
        url: "/proxy/get-result-by-url",
        method: "get",
        params,
    }) as any;
}


export function getWeather(params: {
    /**
     * 城市编码
     */
    city: string;

    extensions: "base" | "all"
}): Promise<ResWeather> {
    return request({
        url: "/proxy/map/v3/weather/weatherInfo",
        method: "get",
        params
    }) as any
}



export function getCurLocation(params: {
    ip?: string;
    output: "json" | "xml"
}){
    return request({
        url: "/proxy/map/v3/ip",
        method: "get",
        params
    }) as any
}


