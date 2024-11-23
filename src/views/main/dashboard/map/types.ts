import { AAAAAItem } from "@/types/service";

export interface ProvideMapHelper {
    refresh: Function,
    addMarkers: (items: AAAAAItem[], options: {
        showLabel?: boolean
    }) => void;
}