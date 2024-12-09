import { AAAAAItem, SchoolItem, TravelItem } from "@/types/service";
import { groupBy } from "lodash"
import { arrayToRecord } from "..";
import { getItems as getTravelItems } from "@/api/travel";
import { getItems as get5AItems } from "@/api/5A";
import { getItems as getShoolItems } from "@/api/school";

class TravelReport {

    private travels: TravelItem[] = [];
    private AAAAAs: AAAAAItem[] = [];
    private schools: SchoolItem[] = [];


    private cache: {
        years: any[] | undefined
    } = {}

    constructor() {

    }


    idsToItems<T>(ids: number[], list: T[]): T[] {
        const map = arrayToRecord(list as any, "id");
        return ids.map(id => map[id]).filter(Boolean) as T[];
    }


    async prepare() {
        const resT = await getTravelItems({ pageNum: 1, pageSize: 1000 });
        this.travels = resT.data?.list || [];

        const resA = await get5AItems({ pageNum: 1, pageSize: 1000 });
        this.AAAAAs = resA.data?.list || [];

        const resS = await getShoolItems({ pageNum: 1, pageSize: 1000 });
        this.schools = resS.data?.list || [];
    }

    years() {

        const list = this.travels.map(it => {
            const date = new Date(it.date);
            return {
                ...it,
                year: date.getFullYear(),
                month: date.getMonth() + 1
            }
        });

        const gMap = groupBy(list, item => {
            return item.year
        });

        const keys = Object.keys(gMap);

        const groups: {
            year: number;
            travel: number;
            AAAAA: number;
            school: number;
            travelItems: TravelItem[];
            AAAAAItems: AAAAAItem[];
            schoolItems: SchoolItem[];
        }[] = [];

        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const gItems = gMap[key];

            const AAAAAIds = gItems.filter(t => Array.isArray(t.scenicSpots)).map(t => t.scenicSpots!).flat(1);
            const AAAAAItems = this.idsToItems(AAAAAIds, this.AAAAAs);

            const schoolIds = gItems.filter(t => Array.isArray(t.schools)).map(t => t.schools!).flat(1);
            const schoolItems = this.idsToItems(schoolIds, this.schools);

            groups.push({
                year: +key,
                travel: gItems.length,
                travelItems: gItems,
                AAAAA: AAAAAIds.length,
                AAAAAItems,
                school: schoolIds.length,
                schoolItems
            })
        }

        const results = groups.sort((g1, g2) => {
            return g1.year > g2.year ? -1 : 1
        })

        return results;
    }

}


; (async function init() {

    setTimeout(async () => {
        const r = new TravelReport();
        await r.prepare();

        const results = await r.years();

        console.log("results:", results);

    }, 2000)


})()


