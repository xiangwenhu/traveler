
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
