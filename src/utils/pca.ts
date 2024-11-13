interface PCAData {
    province: string;
    city: string;
    county: string;
}

export function arrToPCAData(pcaArr: string[]): PCAData {
    if (!Array.isArray(pcaArr) || pcaArr.length === 0)
        return {
            province: "",
            city: "",
            county: "",
        };

    switch (pcaArr.length) {
        case 1:
            return {
                province: pcaArr[0],
                city: "",
                county: "",
            };
        case 2:
            return {
                province: pcaArr[0],
                city: pcaArr[0],
                county: pcaArr[1],
            };
        default:
            return {
                province: pcaArr[0],
                city: pcaArr[1],
                county: pcaArr[2],
            };
    }
}

export function pcaDataToArr(pcaData: PCAData): string[] {
    if (pcaData.province == pcaData.city) {
        return [pcaData.province, pcaData.county]
    }
    return [pcaData.province, pcaData.city, pcaData.county]
}


export function regionsToPCA(regions: number[]) {
    switch (regions.length) {
        case 1:
            return {
                province: regions[0],
                city: null,
                county: null,
            };
        case 2:
            return {
                province: regions[0],
                city: regions[1],
                county: null,
            }
        case 3:
            return {
                province: regions[0],
                city: regions[1],
                county: regions[2]
            }
        default:
            return {}
    }
}