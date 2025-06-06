export interface ResData<D = any> {
    code: number;
    message?: string;
    data?: D;
    details?: any;
}

interface CommonFields {
    id?: number;
    createdAt?: number;
    updatedAt?: number;
}

export type ResPagedData<D> = ResData<{
    list: D[];
    total: number;
}>;

export type ResListData<D> = ResData<D[]>;

export enum EnumCommonStatus {
    Enable = 1,
    DisAble = 2,
}

export enum EnumTravelStatus {
    Unknown = 0,
    /**
     * 计划中
     */
    Planing = 1,

    /**
     * 已计划
     */
    Planed = 2,
    /**
     * 旅行中
     */
    Traveling = 3,
    /**
     * 完成
     */
    Completed = 9,
}

export interface TravelItem extends CommonFields {
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
        url: string;
    }[];
    /**
     * 结束日期
     */
    endDate: string;
    /**
     * 费用
     */
    cost: number;
    /**
     * 状态
     */
    status: EnumTravelStatus;
    /**
     * 交通工具
     */
    transport: number;
    /**
     * ice云剪辑项目id
     */
    iceProjectId: string;
}

export enum EnumResourceType {
    Image = "image",
    Video = "video",
    Audio = "audio",
    Text = "text",
    Unknown = "unknown",
}

export interface ResourceItem extends CommonFields {
    travelId: number;
    type: EnumResourceType;
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

export interface UserItem extends CommonFields {
    id?: number;
    name: string;
    account: string;
    password: string;
    email: string;
    phone: string;
    isAdmin: boolean;
    status: EnumCommonStatus;
    associateUsers: string[];
    readonly: boolean;
}

export interface RegionItem extends CommonFields {
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
    photos: UrlItem[];
    address: string;
    isfree: boolean;
    website: UrlItem[];
    QRCodes: UrlItem[];
}

export type Res5A = ResPagedData<AAAAAItem>;

export interface UrlItem {
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
    photos: UrlItem[];
    website: string;
    type: number;
    rank: number;
    is985: boolean;
    is211: boolean;
}

export type ResSchools = ResPagedData<SchoolItem>;
