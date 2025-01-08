import { ResData } from "@/types/service";
import request from "@/utils/system/request";


export type NewJobItemType = {
    type: number;
    status: number;
    jobId: string;
    associationIds: number[];
    message?: string | null | undefined;
    name?: string | null | undefined;
    ext?: any;
}


export function addItem(data: NewJobItemType): Promise<ResData> {
    return request({
      method: "post",
      url: '/iceJob/create',
      data
    }) as any
  }
  