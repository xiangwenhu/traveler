import { ResData } from '@/types/request'
import { PagerParams, ResListData, ResourceItem, ResPagedData } from '@/types/service'
import request from '@/utils/system/request'

export function getItems(params: {
  travelId: number
} & PagerParams): Promise<ResPagedData<ResourceItem>> {
  return request({
    url: '/resource/getItems',
    method: 'get',
    params
  }) as any
}


// 新增
export function addItem(data: ResourceItem): Promise<ResData> {
  return request({
    method: "post",
    url: '/resource/create',
    data: data
  }) as any
}

// 编辑
export function updateItem(data: ResourceItem): Promise<ResData> {
  return request({
    url: '/resource/update',
    data: data,
    method: "put"
  }) as any
}

// 删除
export function deleteItem(id: number): Promise<ResData> {
  return request({
    method: "post",
    url: '/resource/delete',
    data: {
      id
    }
  }) as any
}


export function getItemById(
  id: number,
): Promise<ResData<ResourceItem>> {
  return request({
    url: '/resource/getItemById',
    method: 'get',
    params: {
      id
    }
  }) as any
}