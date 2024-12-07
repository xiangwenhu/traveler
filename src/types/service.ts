export interface ResData<D = any> {
    code: number;
    message?: string;
    data?: D,
    details?: any
}


interface CommonFileds {
    id?: number;
    createdAt?: number;
    updatedAt?: number;
}


export type ResPagedData<D> = ResData<{
    list: D[],
    total: number
}>;


export type ResListData<D> = ResData<D[]>


export enum EnumCommonStatus {
    Enable = 1,
    DisAble = 2
}


export interface TravelItem extends CommonFileds {
    title: string;
    description: string;
    cover: string;
    province: number;
    city: number;
    county?: number | null;
    provinceName: string;
    cityName: string;
    countyName?: string | null;
    address: string;
    longitude: number;
    latitude: number;
    date: string;
    tags?: number[];
    scenicSpots?: number[];
    schools?: number[];
    works?: {
        title: string;
        url: string
    }[]
}


export enum EnumResouceType {
    Image = 'image',
    Video = 'video',
    Audio = 'audio',
    Text = 'text'
}

export interface ResourceItem extends CommonFileds {
    travelId: number;
    type: EnumResouceType;
    url: string;
    duration: number;
    title: string;
    size: number;
    width: number;
    height: number;
    content?: string;
}



export interface TagItem {
    id: number;
    parentId: number;
    name: string;
}




export interface UserItem extends CommonFileds {
    id?: number;
    name: string;
    account: string;
    password: string;
    email: string;
    phone: string;
    isAdmin: boolean;
    status: EnumCommonStatus;
    associateUsers: number[];
}


export interface RegionItem extends CommonFileds {
    name: string;
    code: number;
    childrenNum: number;
}


export interface TravelRegionStatistics {
    code: number;
    name: string;
    count: number;
}


export interface PagerParams {
    pageNum: number;
    pageSize: number;
}


export interface TagItem {
    id: number;
    name: string;
    parent_id: number;
}


export interface AAAAAItem {
    id: number;
    name: string;
    description: string;
    year: number;
    latitude: number;
    longitude: number;
    province: number;
    city: number;
    county?: null;
    provinceName: string;
    cityName: string;
    countyName?: null;
    createdAt: string;
    updatedAt: string;
    tags: any[];
    photos: PhotoItem[];
    address: string;
    isfree: boolean;
    website: { title: string, url: string }[]
}

export type Res5A = ResPagedData<AAAAAItem>;


interface PhotoItem {
    url: string;
    title: string;
}


export interface SchoolItem {
    id: number;
    name: string;
    description: string;
    latitude: number;
    longitude: number;
    province: number;
    city: number;
    county?: null;
    provinceName: string;
    cityName: string;
    countyName?: null;
    address: string;
    createdAt: string;
    updatedAt: string;
    tags: any[];
    photos: PhotoItem[];
    website: string;
    type: number;
    rank: number;
    is985: boolean;
    is211: boolean;
}

export type ResSchools = ResPagedData<SchoolItem>;