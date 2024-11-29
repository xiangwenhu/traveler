import { SchoolItem, TravelItem } from "@/types/service";
import { arrayToRecord, baseArrayToRecord } from "@/utils";


const iconGot = 'https://traveler-traveler.oss-cn-beijing.aliyuncs.com/web-ui/marker-green.webp';


const icons = {
    common: "//webapi.amap.com/theme/v1.3/markers/b/mark_bs.png",
    red: "//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-red.png",
    i985a: "https://traveler-traveler.oss-cn-beijing.aliyuncs.com/web-ui/icons/school-985-a.png",
    i985: "https://traveler-traveler.oss-cn-beijing.aliyuncs.com/web-ui/icons/school-985.png",
    i211: "https://traveler-traveler.oss-cn-beijing.aliyuncs.com/web-ui/icons/school-211.png",
    i211a: "https://traveler-traveler.oss-cn-beijing.aliyuncs.com/web-ui/icons/school-211-a.png"
}


function getTravelSchoolMap(tItems: TravelItem[]) {
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


function getIconConfig(item: SchoolItem, arrived: boolean) {

    // if (item.is985) {
    //     return {
    //         image: arrived ? icons.i985a : icons.i985,
    //         imageSize: new AMap.Size(30, 30),
    //     }
    // } else if (item.is211) {
    //     return {
    //         image: arrived ? icons.i211 : icons.i211,
    //         imageSize: new AMap.Size(30, 30),
    //     }
    // }

    if (arrived) {
        return {
            image: icons.red,
            imageSize: new AMap.Size(25, 34)
        }
    }

    return {
        image: icons.common,
        imageSize: new AMap.Size(19, 32),
    }
}

export async function addMarkers(
    map: AMap.Map,
    items: SchoolItem[],
    tItems: TravelItem[],
    options: {
        showLabel?: boolean;
        onPreview(travelId: number): void
    }
) {

    console.log("school: addMarkers");

    const win = window as any;
    win.__5a__ = {
        onPreviewTravel(travelId: number) {
            console.log("onPreviewTravel:", travelId)
            options.onPreview(travelId)
        },
        infoWindows: []
    }


    // const scenicSpots = tItems
    //     .filter((t) => Array.isArray(t.scenicSpots) && t.scenicSpots.length > 0)
    //     .map((t) => t.scenicSpots);
    // const ids: number[] = Array.prototype.flat.call(scenicSpots) as number[];
    // const arrMap = baseArrayToRecord(ids || [])

    const list = items;

    const aTravelMap = getTravelSchoolMap(tItems);

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

    map.on("zoomchange", () => {
        const zoom = map.getZoom();
        if (zoom > 8) {
            infoWindow.close();
        }
    });

    var markers: AMap.Marker[] = [];
    for (let i = 0; i < list.length; i++) {
        const item = list[i];

        const arrived = false;  //? arrMap[item.id];

        const imageConfig = getIconConfig(item, arrived);

        // 创建一个 Icon
        var icon = new AMap.Icon({
            // 图标尺寸
            // size: new AMap.Size(25, 34),
            // 图标的取图地址
            image: imageConfig.image,
            // 图标所用图片大小
            imageSize: imageConfig.imageSize
            // 图标取图偏移量
            // imageOffset: new AMap.Pixel(0, -35)

        });


        const marker = new AMap.Marker({
            zooms: [4, 20],
            position: [item.longitude, item.latitude], //点标记位置
            extData: item,
            icon: icon,
            offset: new AMap.Pixel(-12, -18)
            // offset: new AMap.Pixel(0, 0)
        });

        if (options.showLabel == true) {
            marker.setLabel({
                direction: 'bottom',
                offset: new AMap.Pixel(0, 0),  //设置文本标注偏移量
                content: `<div class='info'>${item.name}</div>`, //设置文本标注内容
            });
        }

        marker.on("click", (e: any) => {
            const zoom = map.getZoom();
            var data: SchoolItem = e.target.getExtData(); // 获取额外数据
            const cover = data.photos[0]?.url || '';

            const tContent = buildTravelContent(data.id, aTravelMap);

            infoWindow.setContent(`
            <div class="marker-label c-marker-label">
                <div>
                    <a target="_blank" href="https://baike.baidu.com/item/${encodeURIComponent(item.name)}">${data.name} </a>
                </div>
                <div>${data.provinceName}/${data.cityName} ${data.countyName ? '/' + data.countyName : ''} </div>
                ${tContent}
                <div><img src="${cover}" style="height:200px"></img></div>
            </div>
            `);
            infoWindow.open(map, e.target.getPosition());
            infoWindow.setExtData(item);
        });

        map.add(marker);
        markers.push(marker);

    }
}