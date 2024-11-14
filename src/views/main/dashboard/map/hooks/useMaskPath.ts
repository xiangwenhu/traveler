
export default function useMaskPath() {

    function getMaskPath( keywords: string,  options: {
        subdistrict?: 0 | 1 | 2| 3| 4;
        extensions?: "all" | "base";
        level?: "country" | "province" | "city" | "district" | "biz_area"
    }): Promise<number[][]> {
        // @ts-ignore
        const opts: any = {
            subdistrict: 0,
            extensions: 'all',
            level: 'country',
            ...options
        };
        return new Promise((resolve, reject) => {
            //利用行政区查询获取边界构建mask路径
            //也可以直接通过经纬度构建mask路径
            const district = new AMap.DistrictSearch(opts);

            district.search(keywords, function (status: string, result: any) {

                if (status !== "complete") {
                    return reject(result);
                }
                const bounds = result.districtList[0].boundaries;
                const maskPath = []
                for (var i = 0; i < bounds.length; i += 1) {
                    maskPath.push([bounds[i]])
                }

                resolve(maskPath)
            });
        })

    }


    return {
        getMaskPath
    }

}