import { AAAAAItem, SchoolItem, TravelItem } from "@/types/service";
import { groupBy, unionBy, uniq } from "lodash"
import { getItems as getTravelItems } from "@/api/travel";
import { getItems as get5AItems } from "@/api/5A";
import { getItems as getShoolItems } from "@/api/school";
import * as util from "./util";
import _ from "lodash";


export interface YearsData {
    year: number;
    travels: number;
    AAAAAs: number;
    schools: number;
    travelItems: TravelItem[];
    AAAAAItems: AAAAAItem[];
    schoolItems: SchoolItem[];
    provinces: number;
    provinceNames: string[];
    cities: number;
    cityNames: string[];
    counties: number;
    countyNames: string[];
}



export interface SummaryData {
    travels: number;
    AAAAAs: number;
    schools: number;
    provinces: number;
    cities: number;
    counties: number;
}

export class TravelReport {

    public travels: TravelItem[] = [];
    public AAAAAs: AAAAAItem[] = [];
    public schools: SchoolItem[] = [];


    private cache: {
        years?: YearsData[];
        summary?: SummaryData;
        yearsTotal?: YearsData[];
    } = {}

    constructor() { }



    async prepare() {
        const resT = await getTravelItems({ pageNum: 1, pageSize: 1000 });
        this.travels = resT.data?.list || [];

        const resA = await get5AItems({ pageNum: 1, pageSize: 1000 });
        this.AAAAAs = resA.data?.list || [];

        const resS = await getShoolItems({ pageNum: 1, pageSize: 1000 });
        this.schools = resS.data?.list || [];
    }

    years() {

        if (this.cache.years) {
            return this.cache.years;
        }

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

        const groups: YearsData[] = [];

        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const gItems = gMap[key];

            const AAAAAIds = gItems.filter(t => Array.isArray(t.scenicSpots)).map(t => t.scenicSpots!).flat(1);
            const AAAAAItems = util.idsToItems(AAAAAIds, this.AAAAAs);

            const schoolIds = gItems.filter(t => Array.isArray(t.schools)).map(t => t.schools!).flat(1);
            const schoolItems = util.idsToItems(schoolIds, this.schools);

            groups.push({
                year: +key,
                travels: gItems.length,
                travelItems: gItems,
                AAAAAs: AAAAAIds.length,
                AAAAAItems,
                schools: schoolIds.length,
                schoolItems,
                provinces: util.count(gItems, "province"),
                provinceNames: util.uniqueueKeyValues(gItems, "provinceName") as string[],
                cities: util.count(gItems, "city"),
                cityNames: util.uniqueueKeyValues(gItems, "cityName") as string[],
                counties: util.count(gItems, "county"),
                countyNames: util.uniqueueKeyValues(gItems, "cityName") as string[]
            })
        }

        const results = groups.sort((g1, g2) => {
            return g1.year > g2.year ? 1 : -1
        })

        this.cache.years = results;
        return results;
    }


    yearsTotal() {
        if (!this.cache.years) {
            this.years();
        }

        const yearsData = this.cache.years!;

        if (yearsData.length == 0) return []

        const data: YearsData[] = [yearsData[0]];

        for (let i = 1; i < yearsData.length; i++) {
            const pre = data[i - 1];
            const cur = yearsData[i];

            const AAAAAItems = util.uniqueueItems(pre.AAAAAItems.concat(cur.AAAAAItems), "id");
            const schoolItems = util.uniqueueItems(pre.schoolItems.concat(cur.schoolItems), "id");
            const provinceNames = _.union(pre.provinceNames.concat(cur.provinceNames));
            const cityNames = _.union(pre.cityNames.concat(cur.cityNames));
            const countyNames = _.union(pre.countyNames.concat(cur.countyNames));

            data.push({
                year: cur.year,
                travels: pre.travels + cur.travels,
                travelItems: pre.travelItems.concat(cur.travelItems),
                AAAAAs: AAAAAItems.length,
                AAAAAItems,
                schools: schoolItems.length,
                schoolItems: schoolItems,
                provinces: provinceNames.length,
                provinceNames: provinceNames,
                cities: cityNames.length,
                cityNames,
                counties: countyNames.length,
                countyNames,
            })
        }

        this.cache.yearsTotal = data;
        return data;

    }

    summary(): SummaryData {
        if (this.cache.summary) {
            return this.cache.summary
        }

        if (!this.cache.yearsTotal) {
            this.yearsTotal();
        }


        const yearsData = this.cache.yearsTotal!;

        if (yearsData.length == 0) {
            return {
                travels: 0,
                AAAAAs: 0,
                schools: 0,
                provinces: 0,
                cities: 0,
                counties: 0,
            }
        }

        const last = yearsData.pop()!;

        const result: SummaryData = {
            travels: last.travels,
            AAAAAs: last.AAAAAs,
            schools: last.schools,
            provinces: last.provinces,
            cities: last.cities,
            counties: last.counties,
        };

        return result;
    }


}



