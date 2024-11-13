import { ADCODE_CHINA } from "@/const";
import { ResData } from "@/types/service";
import request from "@/utils/system/request";
import oss from "ali-oss";

export function getSTSToken() {
    return request({
        url: "/ali/getSTSToken",
        method: "post"
    }) as unknown as Promise<ResData<oss.Credentials>>;
}
