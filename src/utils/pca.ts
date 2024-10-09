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
    if(pcaData.province == pcaData.city){
        return [pcaData.province, pcaData.county]
    }    
    return [pcaData.province, pcaData.city, pcaData.county]
}
