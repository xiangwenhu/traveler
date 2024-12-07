
import { MediaProducingOptions, SubmitMediaProducingJobResponse } from '@/types/ice'
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
