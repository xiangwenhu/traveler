import { ResData } from '@/types/request'
import { EnumTravelStatus, ResListData, ResPagedData, TravelItem, TravelRegionStatistics } from '@/types/service'
import request from '@/utils/system/request'


export interface GetTravelItemsParams {
  pageSize: number;
  pageNum: number;
  province?: number | string;
  city?: number | null;
  county?: number | null;
  title?: string;
  date?: string;
  endDate?: string;
  status?: EnumTravelStatus
}

export function getItems(params: GetTravelItemsParams): Promise<ResPagedData<TravelItem>> {
  return request({
    url: '/travel/getItems',
    method: 'get',
    params
  }) as any
}


// 新增
export function addItem(data: TravelItem): Promise<ResData> {
  return request({
    method: "post",
    url: '/travel/create',
    data: data
  }) as any
}

// 编辑
export function updateItem(data: TravelItem): Promise<ResData> {
  return request({
    url: '/travel/update',
    data: data,
    method: "put"
  }) as any
}

// 删除
export function deleteItem(id: number): Promise<ResData> {
  return request({
    method: "post",
    url: '/travel/delete',
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
    url: '/travel/statistics',
    params
  }) as any
}

export function getItemById(
  id: number,
): Promise<ResData<TravelItem>> {
  return request({
    url: '/travel/getItemById',
    method: 'get',
    params: {
      id
    }
  }) as any
}

// 编辑
export function setCover(data: Pick<TravelItem, "id" | "cover">): Promise<ResData> {
  return request({
    url: '/travel/setCover',
    data: data,
    method: "put"
  }) as any
}