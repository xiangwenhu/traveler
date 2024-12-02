import { getGeoJSON } from "@/api/geo";
import { AreaInfoItem, GeoJSONFeature, LevelStringMap } from "@/types";

export function zoomAndCenter(map: AMap.Map, targetZoom: number, center: AMap.LngLat | [number, number], duration: number = 3000) {
    const cZoom = map.getZoom();
    let tZoom = targetZoom;
    if (tZoom == cZoom) tZoom = tZoom + 0.01;
    return new Promise((resolve, reject) => {
        map.setZoomAndCenter(tZoom, center, false, duration);
        map.on("zoomend", () => {
            resolve(true);
        }, {}, true);
    });
}



// 获取当前视窗范围内的 Marker
export function getVisibleOverlays(map: AMap.Map, type: string | undefined) {
    var bounds = map.getBounds(); // 获取当前地图的视窗范围
    var markers = map.getAllOverlays(type);
    var visibleMarkers = markers.filter(marker => bounds.contains(marker.getPosition()));
    return visibleMarkers;
}


export async function colorRegionByAdcode(map: AMap.Map, adcode: number) {
    const geoJSON = await getGeoJSON(`${adcode}.json`);
    const mapGeojson = new AMap.GeoJSON({
        geoJSON: geoJSON,
        // 还可以自定义getMarker和getPolyline
        getPolygon: function (geoFeatrue: GeoJSONFeature, lnglats: any[]) {
            // 计算面积
            // var area = AMap.GeometryUtil.ringArea(lnglats[0])

            // @ts-ignore
            const p = new AMap.Polygon({
                path: lnglats,
                strokeWeight: 3,
                fillOpacity: 0.4,
                fillColor: "transparent",
                strokeColor: "green",
                bubble: true,
            });

            return p;

        },
    });
    map.add(mapGeojson);
    return mapGeojson.getOverlays();
}




function getBoundariesByAreaInfo(areaInfo: AreaInfoItem): Promise<AMap.LngLatLike[][][][]> {
    return new Promise((resolve, reject) => {
        const level = LevelStringMap[areaInfo.level];

        var district = new AMap.DistrictSearch({
            // 返回行政区边界坐标等具体信息
            extensions: 'all',
            // 设置查询行政区级别为 区 
            level
        })

        // https://lbs.amap.com/api/javascript-api/reference/search#DistrictSearchOptions
        district.search(areaInfo.name, function (status: "complete" | "error" | "no_data", result: any) {
            if (status !== "complete") reject(reject)
            // 获取朝阳区的边界信息
            const boundaries = result.districtList[0].boundaries;
            resolve(boundaries);
        })
    })

}



// 获取在多边形内的 Marker
export async function getMarkersInPolygonByAreaInfo(map: AMap.Map, areaInfo: AreaInfoItem) {

    const boundaries = await getBoundariesByAreaInfo(areaInfo);

    const markers = map.getAllOverlays("marker");

    const visibleMarkers: AMap.Marker[] = markers.filter(marker => {
        var point = marker.getPosition();
        return AMap.GeometryUtil.isPointInPolygons(point, boundaries);
    });

    return visibleMarkers;
}

export function setOverlayersVisible(map: AMap.Map, type: string | undefined, visible: boolean) {
    // 隐藏其他的
    const allMarkers: AMap.Marker[] = map.getAllOverlays(type);
    allMarkers.forEach((marker) => {
        visible ? marker.show() : marker.hide();
    });
}


export function createPolyline(points: AMap.LngLat[], options: Partial<AMap.PolylineOptions> = {}) {
    const arr = points.map(p => new AMap.LngLat(p.lng, p.lat, true));

    const polyline = new AMap.Polyline({
        path: arr,
        geodesic: true,
        lineJoin: "round",
        showDir: true,
        dirColor: 'white',
        strokeColor: 'red',
        outlineColor: 'white',
        isOutline: true,
        strokeWeight: 4.0,
        ...options
    });

    return polyline;
}