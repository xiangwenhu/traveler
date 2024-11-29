export interface IOption {
    label: string;
    value: string;
}

export interface AreaItem {
    code: number;
    name: string;
    children?: AreaItem[];
}

export type LevelValue = "country" | "province" | "city" | "district";


export enum EnumLevel {
    country = 0,
    province = 1,
    city = 2,
    district = 3,
}


export const levelMap = {
    [EnumLevel.country]: EnumLevel.country,
    [EnumLevel.province]: EnumLevel.province,
    [EnumLevel.city]: EnumLevel.city,
    [EnumLevel.district]: EnumLevel.district,
}

export const LevalStringMap: Record<EnumLevel, LevelValue> = {
    [EnumLevel.country]: "country",
    [EnumLevel.province]: "province",
    [EnumLevel.city]: "city",
    [EnumLevel.district]: "district"
}



export interface AreaInfoItem {
    adcode: number;
    name: string;
    level: EnumLevel;
    childrenNum: number;
    children?: AreaInfoItem[];
}


export interface GeoJSONFeature {
    type: "Feature";
    geometry: {
        type: "MultiPolygon",
        coordinates: [number, number][][][]
    },
    properties: {
        adcode: number;
        name: string;
        childrenNum: number;
        level: LevelValue;
        parent: {
            adcode: number;
        };
        subFeatureIndex: number;
    };

}

export interface GeoJSON {
    type: "FeatureCollection";
    features: GeoJSONFeature[];
}


export interface WebSite {
    title: string;
    url: string;
}