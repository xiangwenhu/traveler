import { ResData } from '@/types/request'
import { PagerParams, ResListData, TagItem, ResPagedData } from '@/types/service'
import request from '@/utils/system/request'


export function getItems(params: PagerParams): Promise<ResPagedData<TagItem>> {
  return request({
    url: '/tags/getItems',
    method: 'get',
    params
  }) as any
}


// 新增
export function addItem(data: TagItem): Promise<ResData> {
  return request({
    method: "post",
    url: '/tags/create',
    data: data
  }) as any
}

// 编辑
export function updateItem(data: TagItem): Promise<ResData> {
  return request({
    url: '/tags/update',
    data: data,
    method: "put"
  }) as any
}

// 删除
export function deleteItem(id: number): Promise<ResData> {
  return request({
    method: "post",
    url: '/tags/delete',
    data: {
      id
    }
  }) as any
}
