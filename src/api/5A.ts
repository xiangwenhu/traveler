import { ResData } from '@/types/request'
import { AAAAAItem, ResListData, ResPagedData, TravelRegionStatistics } from '@/types/service'
import request from '@/utils/system/request'

export function getItems(params: {
  pageSize: number;
  pageNum: number;
  province?: number;
  city?: number | null;
  county?: number | null;
}): Promise<ResPagedData<AAAAAItem>> {
  return request({
    url: '/5a/getItems',
    method: 'get',
    params
  }) as any
}


// 新增
export function addItem(data: Partial<AAAAAItem>): Promise<ResData> {
  return request({
    method: "post",
    url: '/5a/create',
    data: data
  }) as any
}

// 编辑
export function updateItem(data: Partial<AAAAAItem>): Promise<ResData> {
  return request({
    url: '/5a/update',
    data: data,
    method: "put"
  }) as any
}

// 删除
export function deleteItem(id: number): Promise<ResData> {
  return request({
    method: "post",
    url: '/5a/delete',
    data: {
      id
    }
  }) as any
}


export function statisticsByRegion(params: {
  province?: number | string;
  city?: number | string;
  county?: number | string;
}): Promise<ResListData<TravelRegionStatistics>> {
  return request({
    method: "get",
    url: '/5a/statistics',
    params
  }) as any
}

export function getItemById(
  id: number,
): Promise<ResData<AAAAAItem>> {
  return request({
    url: '/5a/getItemById',
    method: 'get',
    params: {
      id
    }
  }) as any
}