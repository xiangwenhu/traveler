import axios from "axios";

export function getGeoJSONFrom(filename: string): Promise<any> {
    return axios.get(`/api/proxy/geo/areas_v3/bound/${filename}`).then((res) => res.data);
}

export function getGeoJSONLocal(filename: string) {
    return axios.get(`/data/geo/${filename}`).then((res) => res.data);
}

export function getGeoJSON(filename: string): Promise<any> {
    return getGeoJSONFrom(filename)
}
