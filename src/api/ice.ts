
import { BatchGetMediaInfosResData, CreateEditingProjectResData, GetEditingProjectMaterialsRes, MediaProducingOptions, SubmitICEMediaProducingJobRes, SubmitMediaProducingJobResponse } from '@/types/ice'
import { ResData } from '@/types/request'
import request from '@/utils/system/request'



export function submitICEMediaProducingJob(data: any) {
  return requestPost('SubmitMediaProducingJob', data)
}

export function submitMediaProducing(data: MediaProducingOptions): Promise<ResData<SubmitMediaProducingJobResponse>> {
  return request({
    url: '/ice/submitMediaProducing',
    method: 'post',
    data
  }) as any
}


export interface TravelMediaProducingOptions extends MediaProducingOptions {
  travelId: number;
}

export function submitTravelMediaProducing(data: TravelMediaProducingOptions): Promise<ResData<SubmitMediaProducingJobResponse>> {
  return request({
    url: '/ice/submitTravelMediaProducing',
    method: 'post',
    data
  }) as any
}



export function requestPost<D = Record<string, any>, R = any>(action: string, data: D): Promise<ResData<R>> {
  return request("/ice/proxy/post", {
    method: "POST",
    data: {
      ...data,
      Action: action,
    },
  }) as any;
}

export function requestGet<P = Record<string, any>, R = any>(action: string, params: P = {}  as P): Promise<ResData<R>> {
  return request("/ice/proxy/get", {
    method: "GET",
    params: {
      ...params,
      Action: action,
    },
  }) as any;
}


export function createEditingProject(data: {
  Title: string;
  Description?: string;
  CoverURL?: string;
}): Promise<ResData<CreateEditingProjectResData>> {
  return requestPost("CreateEditingProject", data) as any
}





/**
 * 素材 ID，多个素材以逗号（,）分隔；每种类型最多支持 10 个素材 ID
 */
export interface AddEditingProjectMaterialMaps {
  video?: string;
  audio?: string;
  image?: string;
}

/**
 * 素材 ID，多个素材以逗号（,）分隔；每种类型最多支持 10 个素材 ID
 * @param data 
 * @returns 
 */
export function addEditingProjectMaterials(data: { ProjectId: string, MaterialMaps: string }): Promise<ResData<GetEditingProjectMaterialsRes.Res>> {
  return requestPost("AddEditingProjectMaterials", data) as any
}


export type RegisterMediaType  = "image" | "video" | "audio"

export interface RegisterMediaInfo {
  InputURL: string;
  MediaType?: RegisterMediaType;
  Title?: string;
  Description?: string;
  Overwrite?: boolean;
}

interface RegisterMediaInfoResData {
  RequestId: string;
  MediaId: string;
}

export function registerMediaInfo(data: RegisterMediaInfo): Promise<ResData<RegisterMediaInfoResData>> {
  return requestPost("RegisterMediaInfo", data) as any
}


export function getEditingProjectMaterials(data: { ProjectId: string }): Promise<ResData<GetEditingProjectMaterialsRes.Res>> {
  return requestPost("GetEditingProjectMaterials ", data) as any
}


export function getEditingProject(data: { ProjectId: string }): Promise<ResData<{
  RequestId: string;
  Project: any
}>> {
  return requestPost("GetEditingProject ", data) as any
}




interface BatchGetMediaInfosReqData{
  /**
   * 所有待查询的媒资 ID，以逗号分隔。
   */
  MediaIds: string;
  /**
   *    额外文件信息内容包括：FileInfo,DynamicMetaData
   */
  AdditionType?: string;
}

export function batchGetMediaInfos(data: BatchGetMediaInfosReqData) :Promise<ResData<BatchGetMediaInfosResData>>{
  return requestPost("BatchGetMediaInfos", data) as any
}