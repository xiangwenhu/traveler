import axios from "axios";
import { getResultByUrl } from "./proxy";

export function getGeoJSONFrom(filename: string): Promise<any> {
    return axios.get(`/geo/areas_v3/bound/${filename}`).then((res) => res.data);
}

export function getGeoJSONLocal(filename: string) {
    return axios.get(`/data/geo/${filename}`).then((res) => res.data);
}

export function getGeoJSON(filename: string): Promise<any> {
    const url = `https://geo.datav.aliyun.com/areas_v3/bound/${filename}`;
    return getResultByUrl({ url }).then((res) => JSON.parse(res.data));
}
