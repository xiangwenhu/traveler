import { getGeoJSON } from "@/api/geo";
import { GeoJSONFeature } from "@/types";

export function zoomAndCenter(map: AMap.Map, targetZoom: number, center: AMap.LngLat | [number, number], duration: number = 3000) {
    const cZoom = map.getZoom();
    if (targetZoom == cZoom) return Promise.resolve(true);
    return new Promise((resolve, reject) => {
        map.setZoomAndCenter(targetZoom, center, false, duration);
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