import { TravelItem } from "@/types/service";
import { ref } from "vue";
import { createPolyline } from "../../map";
import { getMapFitZoom } from "@/store/quick";
import { delay, isMobile } from "@/utils";
import { EnumTransport } from "@/const";


const transportImageConfig: Record<EnumTransport, Pick<AMap.MarkerOptions, "offset" | "icon">> = {
    [EnumTransport.Car]: {
        icon: "https://a.amap.com/jsapi_demos/static/demo-center-v2/car.png",
        offset: new AMap.Pixel(-13, -26),
    },
    [EnumTransport.HSROrCRH]: {
        icon: new AMap.Icon({
            image: "https://traveler-traveler.oss-cn-beijing.aliyuncs.com/static/icons/HSR.png",
            // size: [20, 20],
            imageSize: new AMap.Size(32, 82)

        }),
        offset: new AMap.Pixel(-16, -40),
    },
    [EnumTransport.Train]: {
        icon: new AMap.Icon({
            image: "https://traveler-traveler.oss-cn-beijing.aliyuncs.com/static/icons/train.png",
            // size: [20, 20],
            imageSize: new AMap.Size(32, 81)

        }),
        offset: new AMap.Pixel(-16, -40),
    },
    [EnumTransport.Plane]: {
        icon: new AMap.Icon({
            image: "https://traveler-traveler.oss-cn-beijing.aliyuncs.com/static/icons/plane.png",
            // size: [20, 20],
            imageSize: new AMap.Size(80, 80),


        }),
        offset: new AMap.Pixel(-40, -40),
    },
    [EnumTransport.Bus]: {
        icon: new AMap.Icon({
            image: "https://traveler-traveler.oss-cn-beijing.aliyuncs.com/static/icons/bus.png",
            // size: [20, 20],
            imageSize: new AMap.Size(32, 65)

        }),
        offset: new AMap.Pixel(-16, -32),
    },
    [EnumTransport.Bike]: {
        icon: new AMap.Icon({
            image: "https://traveler-traveler.oss-cn-beijing.aliyuncs.com/static/icons/bike02.png",
            // size: [20, 20],
            imageSize: new AMap.Size(64, 64)

        }),
        offset: new AMap.Pixel(0, -32),
    },
    [EnumTransport.Walk]: {
        icon: new AMap.Icon({
            image: "https://traveler-traveler.oss-cn-beijing.aliyuncs.com/static/icons/walk02.png",
            // size: [20, 20],
            imageSize: new AMap.Size(64, 64)

        }),
        offset: new AMap.Pixel(-32, -32),
    },
    [EnumTransport.Ship]: {
        icon: new AMap.Icon({
            image: "https://traveler-traveler.oss-cn-beijing.aliyuncs.com/static/icons/ship2.png",
            // size: [20, 20],
            imageSize: new AMap.Size(64, 64)

        }),
        offset: new AMap.Pixel(-32, -32),
    }
}


const AnimationTimeConfig = {
    min: 2.5 * 1000,
    max: 5 * 1000
}

function getAnimationTime(path: AMap.LngLat[]) {
    const sourcePos = path[0];
    const targetPos = path[path.length - 1];
    const dis = AMap.GeometryUtil.distance(sourcePos, targetPos);

    const val = Math.min(Math.max(Math.floor(dis / 1000) * 10, AnimationTimeConfig.min), AnimationTimeConfig.max)
    return Math.max(5000, val);
}

function getFitZoomByDis(point1: AMap.LngLat, point2: AMap.LngLat, fitZoom: number) {
    const dis = AMap.GeometryUtil.distance(point1, point2);

    const km = Math.ceil(dis / 1000);

    const adFitZoom = isMobile() ? fitZoom + 2 : fitZoom;

    if (km <= 10) {
        return 14
    } else if (km <= 50) {
        return 12
    } else if (km <= 100) {
        return 9
    } else if (km <= 200) {
        return 8
    } else if (km <= 500) {
        return 7
    } else if (km <= 1000) {
        return adFitZoom
    }
    return adFitZoom;

}


function useMoveAnimation(map: AMap.Map, path: AMap.LngLat[], transport: EnumTransport) {

    return new Promise((resolve, reject) => {
        const sourcePos = path[0];
        const targetPos = path[path.length - 1];


        const carMarker = new AMap.Marker({
            map: map,
            position: sourcePos,
            zIndex: 9,
            ...(transportImageConfig[transport] || transportImageConfig[1]),
        } as any);


        // 绘制轨迹
        var polyline = new AMap.Polyline({
            map,
            path,
            showDir: true,
            geodesic: true,
            lineJoin: 'round',
            strokeColor: "#28F",  //线颜色
            // strokeOpacity: 1,     //线透明度
            strokeWeight: 6,      //线宽
            // strokeStyle: "solid"  //线样式

        });

        var passedPolyline = new AMap.Polyline({
            map,
            geodesic: true,
            lineJoin: 'round',
            strokeColor: "#AF5",  //线颜色
            strokeWeight: 6,      //线宽
            showDir: true,
        });


        const duration = getAnimationTime(path)
        // @ts-ignore
        carMarker.moveAlong(path, {
            // 每一段的时长
            duration,//可根据实际采集时间间隔设置
            // JSAPI2.0 是否延道路自动设置角度在 moveAlong 里设置
            // autoRotation: true,
        });



        function onMoving(e: any) {
            passedPolyline.setPath(e.passedPath);

            const pos: AMap.LngLat = e.target.getPosition();
            map.setCenter(pos);

            if (pos.getLat() == targetPos.getLat() && pos.getLng() == targetPos.getLng()) {
                carMarker.off("moving", onMoving);
                map.remove(polyline);
                map.remove(passedPolyline);
                map.remove(carMarker);
                resolve(true)
            }
        }

        carMarker.on('moving', onMoving);
    })
}


export default function useAutoPlay(
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
    const refMap = ref<AMap.Map | undefined>(map);
    const refLine = ref<AMap.Polyline>();

    var infoWindow = new AMap.InfoWindow({
        offset: new AMap.Pixel(0, -30),
        closeWhenClickMap: true
    });


    function setMap(map: AMap.Map) {
        refMap.value = map;
        prepare();
    }

    async function showInfoWindow(marker: AMap.Marker) {
        await delay(100);
        const map = refMap.value!;
        var data: TravelItem = marker.getExtData(); // 获取额外数据
        infoWindow.setContent(`<div class="marker-label c-marker-label">
            <div>${data.title}</div>
            <div> ${data.date.split(" ")[0]
            }                   
            <div class='img-wrapper'><img class='label-img' src="${data.cover}"></img></div>
          </div>`);
        infoWindow.setExtData(data)
        infoWindow.open(map, marker.getPosition()!);

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
        const markers = refMap.value!.getAllOverlays("elasticmarker").sort((a, b) => {
            const da: TravelItem = a.getExtData();
            const db: TravelItem = b.getExtData();
            return new Date(db.date).getTime() - new Date(da.date).getTime() ? - 1 : 1

        });
        refMarkers.value = markers;
    }

    function enableAutoPlay() {
        return refCanPlay.value && canAutoPlay()
    }

    function clearLine() {
        if (refMap.value && refLine.value) {
            refMap.value.remove(refLine.value);
        }
    }


    let prePoint: AMap.LngLat;
    let nextPoint: AMap.LngLat;
    function playItem() {
        const map = refMap.value!;
        closeInfoWindow();
        if (!enableAutoPlay()) return Promise.resolve(true);
        let marker: AMap.Marker;

        const preIndex = refIndex.value;
        refIndex.value = (refIndex.value + 1) % refMarkers.value.length;
        const nextIndex = refIndex.value;

        // 计算距离，添加线条
        if (preIndex >= 0) {
            prePoint = refMarkers.value[preIndex].getPosition()!;
        }

        nextPoint = refMarkers.value[nextIndex].getPosition()!;

        return new Promise((resolve) => {
            const fitZoom = getMapFitZoom();

            marker = refMarkers.value[nextIndex];


            const tZoom = preIndex >= 0 ? getFitZoomByDis(prePoint, nextPoint, fitZoom) : fitZoom;

            const fZoom = map.getZoom() == tZoom ? tZoom + 0.05 : tZoom;

            map.setZoomAndCenter(fZoom, preIndex >= 0 ? prePoint : nextPoint);

            map.on("zoomend", async () => {
                if (!enableAutoPlay()) {
                    clearLine();
                    return resolve(true);
                }

                if (preIndex >= 0) {
                    await useMoveAnimation(map, [prePoint!, nextPoint!], marker.getExtData().transport)
                }


                if (!enableAutoPlay()) {
                    clearLine();
                    return resolve(true);
                }
                clearLine();
                showInfoWindow(marker);
                resolve(true);

            }, undefined, true)

        })

    }



    return {
        startAutoPlay,
        stopAutoPlay,
        setMap
    }


}

function useAutoPlayOld(
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

    async function showInfoWindow(marker: AMap.Marker) {
        await delay(100);
        const map = refMap.value!;
        var data: TravelItem = marker.getExtData(); // 获取额外数据
        infoWindow.setContent(`<div class="marker-label c-marker-label">
          <div>${data.title}</div>
          <div>${data.date.split(" ")[0]}</div>
          <div><img src="${data.cover}" style="height:200px"></img></div>
        </div>`);
        infoWindow.setExtData(data)
        infoWindow.open(map, marker.getPosition()!);

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
        const markers = refMap.value!.getAllOverlays("elasticmarker").sort((a, b) => {
            const da: TravelItem = a.getExtData();
            const db: TravelItem = b.getExtData();
            return new Date(db.date).getTime() - new Date(db.date).getTime() ? - 1 : 1

        });
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
            const fitZoom = getMapFitZoom();

            marker = refMarkers.value[nextIndex];

            map.setZoom(fitZoom, false, 2000);

            map.on("zoomend", () => {
                if (!enbaleAutoPlay()) {
                    clearLine();
                    return resolve(true);
                }

                map.setZoomAndCenter(fitZoom + 2.1, marker.getPosition()!, false, 3000);
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