import axios from "axios";

export function getPCAData() {
    return axios.get("/data/pca/pca-code.json").then((res) => res.data);
}
