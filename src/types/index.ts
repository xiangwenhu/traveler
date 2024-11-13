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

export interface AreaInfoItem {
    adcode: number;
    name: string;
    level: LevelValue;
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
