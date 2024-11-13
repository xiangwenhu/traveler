import axios from "axios";
import request from '@/utils/system/request'
import { GeoJSON } from "@/types";

export function getGeoJSONFrom(filename: string): Promise<any> {
    return request(`/proxy/geo/areas_v3/bound/${filename}`).then((res) => res.data);
}

export function getGeoJSONLocal(filename: string) {
    return axios.get(`/data/geo/${filename}`).then((res) => res.data);
}

export function getGeoJSON(filename: string): Promise<GeoJSON> {
    return getGeoJSONFrom(filename)
}
