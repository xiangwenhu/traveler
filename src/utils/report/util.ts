import _ from "lodash";
import { arrayToRecord } from "..";
import { TravelItem } from "@/types/service";
import { ONE_DAY_TICKET } from "@/const";

export function idsToItems<T>(ids: number[], list: T[]): T[] {
    const map = arrayToRecord(list as any, "id");
    return ids.map(id => map[id]).filter(Boolean) as T[];
}

export function count<T>(list: T[], key: keyof T) {
    const set = new Set();

    list.forEach(t => {
        const val = _.get(t, key);
        if (val != undefined && val != "") {
            set.add(_.get(t, key));
        }
    })

    return list.length;
}


export function uniqueueKeyValues<T>(list: T[], key: keyof T) {
    const set = new Set();

    list.forEach(t => {
        const val = _.get(t, key);
        if (val != undefined && val != "") {
            set.add(_.get(t, key));
        }
    })

    return [...set];
}

export function uniqueueItems<T>(list: T[], key: keyof T) {
    const map = new Map<PropertyKey, T>();

    list.forEach(t => {
        const val = _.get(t, key);
        map.set(val, t);
    })

    return [...map.values()];
}

export function getDays(item: TravelItem) {


    const et = new Date(item.endDate).getTime();
    const st = new Date(item.date).getTime();

    if (Number.isNaN(st) || Number.isNaN(et)) return 0;
    const t = et - st;
    return Math.ceil(t / ONE_DAY_TICKET) + 1
}
