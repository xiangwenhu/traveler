import { TravelItem } from "@/types/service";
import { ref } from "vue";

export default function useMakerContextMenu(options: {
    onViewTravelDetail(item: TravelItem): void;
}) {
    const context = new AMap.ContextMenu({});

    const refMarkers = ref<AMap.Marker[]>([]);

    const refMap = ref<AMap.Map | undefined>();

    let currentMarker: AMap.Marker | undefined;

    context.addItem(
        "编辑",
        (e) => {
            if (!currentMarker) return;
            const t = currentMarker.getExtData() as TravelItem;
            options.onViewTravelDetail(t);
            context.hide();
            currentMarker = undefined;
        },
        1
    );


    function prepare(map: AMap.Map) {
        const markers = map.getAllOverlays("elasticmarker");
        refMarkers.value = markers;
    }

    function onRightClick(this: AMap.Marker, e: any) {
        const marker = this;
        currentMarker = marker;
        const map = refMap.value!;
        context.open(map, marker.getPosition());
    }

    function addMarkerContextMenu(map: AMap.Map) {
        refMap.value = map;
        prepare(map);
        const markers = refMarkers.value;

        markers.forEach((marker) => {
            marker.on("rightclick", onRightClick, marker);
        });
    }

    function removeMarkerContextMenu() {
        const markers = refMarkers.value;

        markers.forEach((marker) => {
            marker.off("rightclick", onRightClick);
        });
    }

    return {
        addMarkerContextMenu,
        removeMarkerContextMenu,
    };
}
