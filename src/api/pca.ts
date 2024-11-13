import { ADCODE_CHINA } from "@/const";
import { RegionItem, ResListData } from "@/types/service";
import request from "@/utils/system/request";

export function getPCAData(parentCode: number = ADCODE_CHINA) {
    return request({
        url: "/region/getItems",
        params: {
            parentCode
        }
    }) as unknown as Promise<ResListData<RegionItem>>;
}
