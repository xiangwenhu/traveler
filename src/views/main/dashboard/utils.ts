import { TravelItem } from "@/types/service";
import { divide, groupBy } from "lodash";

export function getMinMaxYear(items: TravelItem[]) {
    const its = items.map((it) => new Date(it.date).getTime()).sort();
    return {
        min: new Date(its[0]).getFullYear(),
        max: new Date(its[its.length - 1]).getFullYear(),
    };
}

export function groupByYear(items: TravelItem[]) {
    const dict = groupBy(items, (it) => new Date(it.date).getFullYear());
    const years = Object.keys(dict).sort((y1, y2) => (+y1 > +y2 ? 1 : -1));

    return years.map(year => ({year, items: dict[year]}));
}
