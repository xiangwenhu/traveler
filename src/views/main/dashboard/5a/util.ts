import { AAAAAItem, TravelItem } from "@/types/service";
import { arrayToRecord, baseArrayToRecord, isMobile } from "@/utils";
import { calcImageWithFromUrl } from "@/utils/media";
import _, { debounce, throttle } from "lodash"
import { visibleMarkersByType } from "../map";


const iconGot = 'https://traveler-traveler.oss-cn-beijing.aliyuncs.com/web-ui/marker-green.webp';


const icons = {
    common: "https://webapi.amap.com/theme/v1.3/markers/b/mark_bs.png",
    red: "https://a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-red.png"
}


function getTravelAAAAAMap(tItems: TravelItem[]) {
    const tMap: Record<number, Pick<TravelItem, "title" | "id" | "date">[]> = {};
    for (let i = 0; i < tItems.length; i++) {
        const item = tItems[i];
        if (!Array.isArray(item.scenicSpots) || item.scenicSpots.length === 0) {
            continue;
        }

        const tsItem = {
            title: item.title,
            id: item.id,
            date: item.date
        }

        item.scenicSpots.forEach(s => {
            if (!tMap[s]) {
                tMap[s] = []
            }
            tMap[s].push(tsItem)
        })

    }
    return tMap;
}

function buildTravelContent(id: number, map: Record<number, Pick<TravelItem, "title" | "id" | "date">[]>) {
    const tItems = map[id];
    if (!tItems) return ""
    const html = tItems.map(t => `<a href="javascript:void(0)" onclick="__5a__.onPreviewTravel(${t.id})">${t.title}(${new Date(t.date).getFullYear()})</a>`).join("");

    return `<div>相关旅行：${html}</div>`
}

function buildSitesContent(item: AAAAAItem){
    const websites = item.website;
    if(!Array.isArray(websites) || websites.length === 0) return "";
    return websites.map(w=> `<a  class="website" href='${w.url}' target='_blank'>${w.title}</a>`)
}


export async function addMarkers(
    map: AMap.Map,
    items: AAAAAItem[],
    tItems: TravelItem[],
    options: {
        showLabel?: boolean;
        onPreview(travelId: number): void
    }
) {

    console.log("5A: addMarkers");

    const win = window as any;
    win.__5a__ = {
        onPreviewTravel(travelId: number) {
            console.log("onPreviewTravel:", travelId)
            options.onPreview(travelId)
        },
        infoWindows: []
    }


    const scenicSpots = tItems
        .filter((t) => Array.isArray(t.scenicSpots) && t.scenicSpots.length > 0)
        .map((t) => t.scenicSpots);
    const ids: number[] = Array.prototype.flat.call(scenicSpots) as number[];
    const arrMap = baseArrayToRecord(ids || [])

    const list = items;

    const aTravelMap = getTravelAAAAAMap(tItems);

    // 创建一个用于显示标记标签的InfoWindow
    const infoWindow = new AMap.InfoWindow({
        offset: new AMap.Pixel(0, -20),
        closeWhenClickMap: true,
        autoMove: false
    });

    win.__5a__.infoWindows.push(infoWindow);

    infoWindow.on("click", (e) => {
        const target = e.originEvent.target;
        const isCloseButton = target.classList.contains("amap-info-close");
        if (isCloseButton) return;

        const isEditButton = target.classList.contains("c-edit-link");
        if (isEditButton) return

    });

    const checkFun = _.throttle(() => {
        const zoom = map.getZoom();
        if (zoom > 8) {
            infoWindow.close();
        }

    }, 500, {
        leading: false
    })

    map.on("zoomend", checkFun);

    map.on("moveend", checkFun)

    var labelsLayer = new AMap.LabelsLayer({
        zooms: [2, 20],
        zIndex: 999,
        collision: false,
        // allowCollision:true
    });

    map.add(labelsLayer);


    var markers: AMap.LabelMarker[] = [];
    for (let i = 0; i < list.length; i++) {
        const item = list[i];

        const arrived = arrMap[item.id];

        const img = arrived ? icons.red : icons.common;
        const size = arrived ? [25, 34] : [19, 32];

        const iconC: AMap.LabelMarker.IconOptions = {
            type: 'image',
            image: img,
            size: size,
            // size: [6, 9],
            anchor: 'bottom-center',
        };

        const marker = new AMap.LabelMarker({
            zooms: [0, 20],
            position: new AMap.LngLat(item.longitude, item.latitude), //点标记位置
            extData: item,
            icon: iconC,
            offset: new AMap.Pixel(-12, -18),
            name: item.name,
            text: {
                content: item.name,
                zooms: [8, 20],
                style: {
                    // strokeColor: "#FFF",
                    // fillColor: "#FFF",
                    backgroundColor: "#FFF",
                },
                offset: [0, 48]
            }
        });

        marker.on("click", (e: any) => {
            var data: AAAAAItem = e.target.getExtData(); // 获取额外数据
            const cover = data.photos[0]?.url || '';

            const tContent = buildTravelContent(data.id, aTravelMap);

            infoWindow.setContent(`
            <div class="marker-label c-marker-label c-marker-label-5a">
                <div>
                    ${data.name}
                </div>
                <div>
                    ${buildSitesContent(data)}
                </div>
                ${tContent}
                <div class='label-5a-img-container'><img class='label-5a-img' src="${cover}"></img></div>
            </div>
            `);
            infoWindow.open(map, e.target.getPosition());
            infoWindow.setExtData(item);
        });

        markers.push(marker);

    }

    labelsLayer.add(markers)


}