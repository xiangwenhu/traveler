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

export interface GeoJSON {
    type: "FeatureCollection";
    features: {
        type: "Feature";
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
    }[];
}

export namespace TerminalMsgData {
    export interface TerminalMsgData {
        id: number;
        terminalId: number;
        clientId: number;
        dataDate: string;
        createTime: string;
        msg1Data: TerminalMsgDataItem;
        msg2Data: TerminalMsgDataItem;
        msg10Data: TerminalMsgDataItem;
    }

    export interface TerminalMsgDataItem {
        channel: number;
        data: Record<string, DataItem>;
    }

    export interface DataItem {
        count: number;
        max: number;
        min: number;
        total: number;
        avg: number;
    }
}
