export interface ResData<D = any> {
    code: number;
    message?: string;
    data?: D,
    details?: any
}


interface CommonFileds {
    id?: number;
    createdAt: number;
    updatedAt: number;
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
    county: number;
    address: string;
    longtitude: number;
    latitude: number;
    date: number;
    tags?: number[]
}


export enum EnumResouceType {
    Image = 1,
    Video = 2,
    Audio = 3,
    Text = 4
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
    status: EnumCommonStatus;
}


export interface RegionItem extends CommonFileds {
    name: string;
    code: number;
    childrenNum: number;
}