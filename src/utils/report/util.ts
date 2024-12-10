import _ from "lodash";
import { arrayToRecord } from "..";

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

