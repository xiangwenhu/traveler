
import { CreateEditingProjectResData, MediaProducingOptions, SubmitMediaProducingJobResponse } from '@/types/ice'
import { ResData } from '@/types/request'
import request from '@/utils/system/request'

export function submitMediaProducing(data: MediaProducingOptions): Promise<ResData<SubmitMediaProducingJobResponse>> {
  return request({
    url: '/ice/submitMediaProducing',
    method: 'post',
    data
  }) as any
}


export interface TravelMediaProducingOptions extends MediaProducingOptions{
  travelId: number;
}

export function submitTravelMediaProducing(data: TravelMediaProducingOptions): Promise<ResData<SubmitMediaProducingJobResponse>> {
  return request({
    url: '/ice/submitTravelMediaProducing',
    method: 'post',
    data
  }) as any
}



export function requestPost(action: string, data: Record<string, any> = {}) {
  return request("/ice/proxy/post", {
      method: "POST",
      data: {
          ...data,
          Action: action,
      },
  });
}

export function requestGet(action: string, params: Record<string, any> = {}) {
  return request("/ice/proxy/get", {
      method: "GET",
      params: {
          ...params,
          Action: action,
      },
  });
}


export function createEditingProject(data: {
  Title: string;
  Description?: string;
  CoverURL?: string;
}): Promise<ResData<CreateEditingProjectResData>> {
  return requestPost("CreateEditingProject", data) as any
} 