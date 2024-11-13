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
