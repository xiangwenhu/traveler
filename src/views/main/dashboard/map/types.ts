import { AAAAAItem, SchoolItem } from "@/types/service";

export interface ProvideMapHelper {
    refresh: Function,
    addMarkers: (items: AAAAAItem[] | SchoolItem[], options: {
        showLabel?: boolean
    }) => void;
}