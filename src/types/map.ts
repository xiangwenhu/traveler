export interface  TerminalMapData {
    total: number;
    pictureTotal: number;
    videoTotal: number;
    audioTotal: number;
    details: {
        province: string;
        city: string;
        county: string;
        adress: string;
        name: string;
    }[];
}
