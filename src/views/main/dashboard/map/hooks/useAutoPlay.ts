import { TravelItem } from "@/types/service";
import { ref } from "vue";
import { createPolyline } from "../../map";




export default function userAutoPlay(
    map: AMap.Map | undefined,
    options: {
        intervalTime: number;
        canAutoPlay: () => boolean;
    }
) {

    const { canAutoPlay, intervalTime } = options;

    const refTicket = ref<number>();
    const refCanPlay = ref<boolean>();
    const refIndex = ref<number>(-1);
    const refMarkers = ref<AMap.Marker[]>([]);
    const refMap = ref<AMap.Map | undefined>();
    const refLine = ref<AMap.Polyline>();

    var infoWindow = new AMap.InfoWindow({
        offset: new AMap.Pixel(0, -30),
        closeWhenClickMap: true
    });


    function setMap(map: AMap.Map) {
        refMap.value = map;
        prepare();
    }

    function showInfoWindow(marker: AMap.Marker) {
        const map = refMap.value!;
        var data: TravelItem = marker.getExtData(); // 获取额外数据
        infoWindow.setContent(`<div class="marker-label c-marker-label">
          <div>${data.title}</div>
          <div>${data.date.split(" ")[0]}</div>
          <div><img src="${data.cover}" style="height:200px"></img></div>
        </div>`);
        infoWindow.open(map, marker.getPosition()!);
        infoWindow.setExtData(data)
    }

    function closeInfoWindow() {
        infoWindow.close();
    }

    async function planJobs(callback: Function) {
        clearTimeout(refTicket.value);
        await callback();
        refTicket.value = setTimeout(async () => {
            planJobs(callback);
        }, intervalTime);
    }


    function startAutoPlay() {
        if (!refMap.value) return;
        if (refCanPlay.value == true) return;
        refCanPlay.value = true;

        planJobs(() => playItem())
    }

    function stopAutoPlay() {
        if (refCanPlay.value == false) return;
        refCanPlay.value = false;

        const map = refMap.value;
        if (map) {
            if (refLine.value) {
                map.remove(refLine.value)
            }
            map.stop();
            map.start();
        }
    }

    function prepare() {
        const markers = refMap.value!.getAllOverlays("elasticmarker");
        refMarkers.value = markers;
    }

    function enbaleAutoPlay() {
        return refCanPlay.value && canAutoPlay()
    }

    function clearLine() {
        if (refMap.value && refLine.value) {
            refMap.value.remove(refLine.value);
        }
    }


    function playItem() {
        const map = refMap.value!;
        closeInfoWindow();
        if (!enbaleAutoPlay()) return Promise.resolve(true);
        let marker: AMap.Marker;

        const preIndex = refIndex.value;
        refIndex.value = (refIndex.value + 1) % refMarkers.value.length;
        const nextIndex = refIndex.value;

        // 计算距离，添加线条
        if (preIndex >= 0) {
            const prePoint = refMarkers.value[preIndex].getPosition()!;
            const nextPoint = refMarkers.value[nextIndex].getPosition()!;
            const dis = AMap.GeometryUtil.distance(prePoint, nextPoint);
            if (dis > 100 * 1000) {
                const p = createPolyline([prePoint, nextPoint]);
                refLine.value = p;
                map.add(p);
            }
        }

        return new Promise((resolve) => {

            marker = refMarkers.value[nextIndex];

            map.setZoom(4.9, false, 2000);

            map.on("zoomend", () => {
                if (!enbaleAutoPlay()) {
                    clearLine();
                    return resolve(true);
                }

                map.setZoomAndCenter(7, marker.getPosition()!, false, 3000);
                map.on("moveend", () => {
                    if (!enbaleAutoPlay()) {
                        clearLine();
                        return resolve(true);
                    }
                    clearLine();
                    showInfoWindow(marker);
                    resolve(true);
                }, undefined, true)
            }, undefined, true)

        })

    }



    return {
        startAutoPlay,
        stopAutoPlay,
        setMap
    }


}