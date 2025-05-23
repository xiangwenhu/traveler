import { ResData } from '@/types/request'
import { ResPagedData, UserItem } from '@/types/service'
import request from '@/utils/system/request'

// 获取数据api
export function getItems(data: object): Promise<ResPagedData<UserItem>> {
  return request({
    url: '/admin/getItems',
    method: 'get',    
    data
  }) as any
}


// 新增
export function addItem(data: object): Promise<ResData>  {
  return request({
    method: "post",
    url: '/user/create',   
    data: data
  }) as any
}

// 编辑
// 新增
export function updateItem(data: object): Promise<ResData>  {
  return request({
    url: '/user/update',    
    data: data,
    method: "put"
  }) as any
}

// 删除
export function deleteItem(data: object): Promise<ResData>  {
  return request({
    method: "post",
    url: '/user/delete',    
    data
  }) as any
}

export function getItemByAccount(params: {
  account: string;
}): Promise<ResData>  {
  return request({
    method: "get",
    url: '/user/getItemByAccount',    
    params
  }) as any
}