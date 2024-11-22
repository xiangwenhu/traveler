import { TravelItem, TravelRegionStatistics } from "@/types/service";
import { getRegionParams } from "../echarts/util";
import { getItems, statisticsByRegion } from "@/api/travel";
import { ElMessage } from "element-plus";
import { calcImageWithFromUrl } from "@/utils/media";
import { arrayToRecord, delay } from "@/utils";
import { getGeoJSON } from "@/api/geo";
import { ADCODE_CHINA } from "@/const";
import { GeoJSONFeature } from "@/types";
import { EnumColorRegionLevel } from "@/store/modules/map";

export function buildMarkerLabel(items: TravelItem[]) {
    return `<div>
    ${items.map((t) => `<div>${t.title}</div>`).join("")}       
    </div>`;
}

async function getStatisticsData(params: {
    province?: number | string;
    city?: number | string;
    county?: number | string;
}): Promise<TravelRegionStatistics[]> {
    try {
        const res = await statisticsByRegion(params);
        if (!res || res.code != 0) return [];

        return res.data! || [];
    } catch (err) {
        ElMessage.error("获取旅行统计信息失败");
        return [];
    }
}

export async function getTravelItems() {
    const res = await getItems({
        pageNum: 1,
        pageSize: 100,
    });
    if (!res || res.code != 0 || !res.data) return [];

    const list = res.data.list || [];
    if (list.length == 0) return [];
    return list;
}

export const zoomStyleMapping = {
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 1,
    9: 1,
    10: 1,
    11: 1,
    12: 1,
    13: 1,
    14: 1,
    15: 1,
    16: 1,
    17: 1,
    18: 1, //18-20级使用样式 1
    19: 1,
    20: 1,
};

export async function addElasticMarkers(
    map: AMap.Map,
    items: TravelItem[],
    options: {
        onPreview: (item: TravelItem) => void;
        onEdit: (item: TravelItem) => void;
        canAnimation: () => boolean;
    }
) {
    // debugger
    const list = items;

    const dUrl = "https://a.amap.com/jsapi/static/image/plugin/marker_red.png";
    const size1 = await calcImageWithFromUrl(dUrl, { width: 16 });

    // 创建一个用于显示标记标签的InfoWindow
    var infoWindow = new AMap.InfoWindow({
        offset: new AMap.Pixel(0, -30),
        closeWhenClickMap: true,
    });

    function onGotoPreview() {
        const isOpen = infoWindow.getIsOpen();
        if (!isOpen) return;
        var data = infoWindow.getExtData(); // 获取额外数据
        options.onPreview(data);
        infoWindow.close();
    }

    function onGotoEdit() {
        const isOpen = infoWindow.getIsOpen();
        if (!isOpen) return;
        var data = infoWindow.getExtData(); // 获取额外数据
        options.onEdit(data);
        infoWindow.close();
    }

    // 系统的 infoWindow.getContent() 返回的是 string
    // infoWindow.on("open", (e) => {
    //   const content = (infoWindow.getContent() as HTMLElement).querySelector("c-marker-label");
    //   if (!content) return;
    //   content.addEventListener("click", onGotoPreview)
    // });

    // infoWindow.on("close", () => {
    //   const content = (infoWindow.getContent() as HTMLElement).querySelector("c-marker-label");
    //   if (!content) return;
    //   content.removeEventListener("click", onGotoPreview)
    // })

    infoWindow.on("click", (e) => {
        const target = e.originEvent.target;
        const isCloseButton = target.classList.contains("amap-info-close");
        if (isCloseButton) return;

        const isEditButton = target.classList.contains("c-edit-link");
        if (isEditButton) return onGotoEdit();

        onGotoPreview();
    });

    map.on("zoomchange", () => {
        const zoom = map.getZoom();
        if (zoom > 8) {
            infoWindow.close();
        }
    });

    var markers: any[] = [];
    for (let i = 0; i < list.length; i++) {
        const t = list[i];

        const size2 = await calcImageWithFromUrl(t.cover, { width: 36 });
        var stylesArray = [
            {
                icon: {
                    //图标样式
                    img: "https://a.amap.com/jsapi/static/image/plugin/marker_red.png",
                    size: [size1.width, size1.height], //图标的原始大小
                    anchor: "bottom-center", //锚点位置
                    fitZoom: 6, //最合适的级别 在此级别显示为图标原始大小
                    scaleFactor: 2, //地图放大一级的缩放比例系数
                    maxScale: 2, //图片的最大放大比例，随着地图放大图标会跟着放大，最大为2
                    minScale: 1, //图片的最小缩小比例，随着地图缩小图标会跟着缩小，最小为1
                },
            },
            {
                icon: {
                    img: t.cover,
                    size: [size2.width, size2.height],
                    anchor: "bottom-center",
                    fitZoom: 9,
                    scaleFactor: 1.6,
                    maxScale: 4,
                    minScale: 1,
                },
                label: {
                    content: `<div> <div>${t.title}</div><div>${t.date.split(" ")[0]
                        }</div></div>`,
                    position: "BM",
                    minZoom: 5,
                },
            },
        ];

        const marker = new AMap.ElasticMarker({
            zooms: [4, 20],
            position: [t.longitude, t.latitude], //点标记位置
            styles: stylesArray, //指定样式列表
            zoomStyleMapping, //指定 zoom 与样式的映射
            extData: t,
        });

        marker.on("click", (e: any) => {
            var data = e.target.getExtData(); // 获取额外数据
            options.onPreview(data);
        });

        marker.on("mouseover", (e: any) => {
            const zoom = map.getZoom();
            if (zoom > 8) return;
            var data: TravelItem = e.target.getExtData(); // 获取额外数据
            infoWindow.setContent(`<div class="marker-label c-marker-label">
        <div>${data.title}</div>
        <div>${data.date.split(" ")[0]
                }  <a href="javascript:void(0)" class="c-edit-link">编辑</a></div>
        <div><img src="${t.cover}" style="height:200px"></img></div>
      </div>`);
            infoWindow.open(map, e.target.getPosition());
            infoWindow.setExtData(t);
        });

        // 添加鼠标移出事件
        marker.on("mouseout", function () {
            // infoWindow.close();
        });

        map.add(marker);
        markers.push(marker);
    }
}

export async function addColorRegions(map: AMap.Map, items: TravelItem[]) {
    const coverdProvinces = arrayToRecord(items, "province");
    const codes = Object.keys(coverdProvinces);

    for (let i = 0; i < codes.length; i++) {
        await delay(200);
        const code = codes[i];
        var ds = new AMap.DistrictSearch({
            level: "province",
            subdistrict: 0, //
            extensions: "all", //返回行政区边界坐标组等具体信息
        });

        ds.search(code, function (status: string, result: any) {
            if (status !== "complete" || result.districtList.length == 0)
                return;

            var bounds = result.districtList[0].boundaries;
            if (!bounds) return;
            //生成行政区划polygon
            for (var i = 0; i < bounds.length; i += 1) {
                //构造MultiPolygon的path
                bounds[i] = [bounds[i]];
            }
            const polygon = new AMap.Polygon({
                strokeWeight: 1,
                path: bounds,
                fillOpacity: 0.4,
                fillColor: "#ccebc5",
                strokeColor: "#2b8cbe",
            });
            map.add(polygon);
        });
    }
}

export async function addColorRegionsL1(map: AMap.Map, items: TravelItem[]) {
    const cProvinces = arrayToRecord(items, "province");

    const geoJSON = await getGeoJSON(`${ADCODE_CHINA}_full.json`);

    // 过滤出需要绘制的
    geoJSON.features = geoJSON.features.filter(
        (f) => cProvinces[f.properties.adcode]
    );

    var mapGeojson = new AMap.GeoJSON({
        geoJSON: geoJSON,
        // 还可以自定义getMarker和getPolyline
        getPolygon: function (geoFeatrue: GeoJSONFeature, lnglats: any[]) {
            // 计算面积
            // var area = AMap.GeometryUtil.ringArea(lnglats[0])

            return new AMap.Polygon({
                path: lnglats,
                strokeWeight: 1,
                fillOpacity: 0.4,
                fillColor: "#ccebc5",
                strokeColor: "#2b8cbe",
                bubble: true,
            });
        },
    });

    map.add(mapGeojson);
}

function getL2Codes(items: TravelItem[]) {
    return items.map((t) => {
        const regions = [t.province, t.city, t.county].filter(Boolean);
        if (regions.length == 1) return regions[0];
        return regions[regions.length - 2];
    });
}

export function clearAllOverlays(map: AMap.Map, type: string) {
    const overLayers = map.getAllOverlays(type);
    overLayers.forEach(layer => map.remove(layer));
}

export async function addColorRegionsL2(map: AMap.Map, items: TravelItem[]) {
    // 标记二级区域，而不是一级区域，当然只有一级的除外
    const codes = getL2Codes(items);

    for (let i = 0; i < codes.length; i++) {
        const code = codes[i];

        const geoJSON = await getGeoJSON(`${code}.json`);
        var mapGeojson = new AMap.GeoJSON({
            geoJSON: geoJSON,
            // 还可以自定义getMarker和getPolyline
            getPolygon: function (geoFeatrue: GeoJSONFeature, lnglats: any[]) {
                // 计算面积
                // var area = AMap.GeometryUtil.ringArea(lnglats[0])
                return new AMap.Polygon({
                    path: lnglats,
                    strokeWeight: 1,
                    fillOpacity: 0.4,
                    fillColor: "#ccebc5",
                    strokeColor: "#2b8cbe",
                    bubble: true,
                });
            },
        });

        map.add(mapGeojson);
    }
}

export async function colorRegionsByLevel(map: AMap.Map, items: TravelItem[], level: EnumColorRegionLevel, clear: boolean = true) {
    if (clear) {
        clearAllOverlays(map, "polygon");
    }
    if (level == EnumColorRegionLevel.Province) return addColorRegionsL1(map, items)
    return addColorRegionsL2(map, items);
}

async function addTravelMarkers(map: AMap.Map, items: TravelItem[]) {
    // Marker
    const markes = items.map(
        (t) =>
            new AMap.Marker({
                position: [t.longitude, t.latitude],
            })
    );

    // 聚合
    const gridSize = 60;
    const points = items.map((t) => ({
        lnglat: [t.longitude, t.latitude],
        data: t,
    }));

    const cluster = new AMap.MarkerClusterer(map, points as any[], {
        gridSize,
        zoomOnClick: true,
    });

    cluster.on("click", (e) => {
        // if (Array.isArray(e.clusterData) && e.clusterData.length > 1) {
        //   map.setCenter([e.lnglat.lng, e.lnglat.lat]);
        //   map.zoomIn();
        // } else {
        e.marker.setLabel({
            direction: "right",
            offset: new AMap.Pixel(20, 20), //设置文本标注偏移量
            content: buildMarkerLabel(
                (e.clusterData || []).map((d: any) => d.data)
            ),
        });
        // e.marker
        // }
    });
}

export function zoomAndCenter(map: AMap.Map, targetZoom: number) {
    const zoom = map.getZoom();
    if (targetZoom == zoom) return Promise.resolve(true);
    return new Promise((resolve, reject) => {
        let zoom = map.getZoom();
        map.setZoomAndCenter(targetZoom, [107.818204, 38.202396], false, 3000);
        map.on("zoomend", () => {
            resolve(true);
        }, undefined, true);
    });
}
