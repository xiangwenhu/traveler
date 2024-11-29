import { ResData } from '@/types/request'
import { SchoolItem, ResListData, ResPagedData, TravelRegionStatistics } from '@/types/service'
import request from '@/utils/system/request'

export function getItems(params: {
  pageSize: number;
  pageNum: number;
  province?: number;
  city?: number | null;
  county?: number | null;
}): Promise<ResPagedData<SchoolItem>> {
  return request({
    url: '/school/getItems',
    method: 'get',
    params
  }) as any
}


// 新增
export function addItem(data: Partial<SchoolItem>): Promise<ResData> {
  return request({
    method: "post",
    url: '/school/create',
    data: data
  }) as any
}

// 编辑
export function updateItem(data: Partial<SchoolItem>): Promise<ResData> {
  return request({
    url: '/school/update',
    data: data,
    method: "put"
  }) as any
}

// 删除
export function deleteItem(id: number): Promise<ResData> {
  return request({
    method: "post",
    url: '/school/delete',
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
    url: '/school/statistics',
    params
  }) as any
}

export function getItemById(
  id: number,
): Promise<ResData<SchoolItem>> {
  return request({
    url: '/school/getItemById',
    method: 'get',
    params: {
      id
    }
  }) as any
}