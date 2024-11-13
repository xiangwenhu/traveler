import { getPCAData } from "@/api/pca";
import { AreaInfoItem } from "@/types";
import { arrayToRecord } from "@/utils";

const LevelTwoOnlyProvince = [
    {
        name: "北京市",
        adcode: 110000,
    },
    {
        name: "上海市",
        adcode: 310000,
    },
    {
        name: "天津市",
        adcode: 120000,
    },
    {
        name: "重庆市",
        adcode: 500000,
    },
    {
        adcode: 810000,
        name: "香港特别行政区",
    },
    {
        adcode: 820000,
        name: "澳门特别行政区",
    },
];

const LevelTwoOnlyProvinceMap = arrayToRecord(LevelTwoOnlyProvince, "adcode");

class PCAManager {
    private pcaData!: AreaInfoItem;

    async getPcaData() {
        if (this.pcaData == undefined) {
            const res = await getPCAData();
            this.pcaData = res;
        }
        return this.pcaData;
    }

    async init() {
        if (this.pcaData != undefined) return;
        await this.getPcaData();
    }

    get initialized() {
        return this.pcaData != undefined;
    }

    /**
     * 不包含省
     * @param areas
     * @returns
     */
    getMapQuery(areas: AreaInfoItem[]) {

        return {
            province: areas[0]?.adcode,
            city: areas[1]?.adcode,
            county: areas[2]?.adcode,
        };

        //     if (!Array.isArray(areas) || areas.length == 0) {
        //         return {
        //             province: "",
        //             city: "",
        //             county: "",
        //         };
        //     }

        //     // 北京市/东城区  => 北京市/北京市/东城区
        //     if (areas.length == 2) {
        //         const p = this.pcaData.children!.find(
        //             (p) => p.adcode == areas[0].adcode
        //         );
        //         const c = p!.children!.find((c) => c.adcode == areas[1].adcode);

        //         if (c!.childrenNum == 0) {
        //             return {
        //                 province: areas[0].adcode,
        //                 city: areas[0].adcode,
        //                 county: areas[1].adcode,
        //             };
        //         }
        //         return {
        //             province: areas[0].adcode,
        //             city: areas[1].adcode,
        //             county: "",
        //         };
        //     }

        //     switch (areas.length) {
        //         case 1:
        //             const l2Only = LevelTwoOnlyProvinceMap[areas[0].adcode];
        //             if (l2Only) {
        //                 return {
        //                     province: areas[0].adcode,
        //                     city: areas[0].adcode,
        //                     county: "",
        //                 };
        //             }
        //             return {
        //                 province: areas[0].adcode,
        //                 city: "",
        //                 county: "",
        //             };
        //         default:
        //             return {
        //                 province: areas[0].adcode,
        //                 city: areas[1].adcode,
        //                 county: areas[2].adcode,
        //             };
        //     }
        // }
    }
}

export const pcaManager = new PCAManager();
