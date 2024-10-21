import { ResData } from '@/types/request'
import { TravelItem } from '@/types/service'
import request from '@/utils/system/request'

export function getItems(params: object): Promise<ResData> {
  return request({
    url: '/travel/getItems',
    method: 'post',    
    params
  }) as any
}


// 新增
export function addItem(data: TravelItem): Promise<ResData>  {
  return request({
    method: "post",
    url: '/user/add',   
    data: data
  }) as any
}

// 编辑
export function updateItem(data: TravelItem): Promise<ResData>  {
  return request({
    url: '/user/update',    
    data: data,
    method: "put"
  }) as any
}

// 删除
export function deleteItem(id: number): Promise<ResData>  {
  return request({
    method: "post",
    url: '/user/delete',    
    data: {
        id
    }
  }) as any
}