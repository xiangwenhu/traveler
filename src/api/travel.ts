import { ResData } from '@/types/request'
import { TravelItem } from '@/types/service'
import request from '@/utils/system/request'

export function getItems(params: {
  pageSize: number,
  pageNum: number
}): Promise<ResData> {
  return request({
    url: '/travel/getItems',
    method: 'get',    
    params
  }) as any
}


// 新增
export function addItem(data: TravelItem): Promise<ResData>  {
  return request({
    method: "post",
    url: '/travel/create',   
    data: data
  }) as any
}

// 编辑
export function updateItem(data: TravelItem): Promise<ResData>  {
  return request({
    url: '/travel/update',    
    data: data,
    method: "put"
  }) as any
}

// 删除
export function deleteItem(id: number): Promise<ResData>  {
  return request({
    method: "post",
    url: '/travel/delete',    
    data: {
        id
    }
  }) as any
}