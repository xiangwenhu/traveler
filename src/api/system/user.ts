import { ResData } from '@/types/request'
import request from '@/utils/system/request'

// 获取数据api
export function getAllUsers(data: object): Promise<ResData> {
  return request({
    url: '/admin/getItems',
    method: 'get',    
    data
  })
}


// 新增
export function addUser(data: object): Promise<ResData>  {
  return request({
    url: '/user/add',   
    params: data
  })
}

// 编辑
// 新增
export function updateUser(data: object): Promise<ResData>  {
  return request({
    url: '/operator/update',    
    params: data
  })
}

// 删除
export function deleteUser(data: object): Promise<ResData>  {
  return request({
    url: 'operator/delete',    
    params: data
  })
}