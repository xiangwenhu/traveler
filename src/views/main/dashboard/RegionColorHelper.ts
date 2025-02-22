import { getGeoJSON } from "@/api/geo";
import { ADCODE_CHINA } from "@/const";
import { EnumColorRegionLevel } from "@/store/modules/map";
import { GeoJSONFeature } from "@/types";



export async function addColorRegionsL1(map: AMap.Map, provinceCodes: number[]) {

    const geoJSON = await getGeoJSON(`${ADCODE_CHINA}_full.json`);

    // 过滤出需要绘制的
    geoJSON.features = geoJSON.features.filter(
        (f) => provinceCodes.includes(f.properties.adcode)
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
                fillOpacity: 0.2,
                fillColor: "rgba(0, 255, 0)",
                strokeColor: "#2b8cbe",
                bubble: true,
            });
        },
    });

    map.add(mapGeojson);
}

export async function addColorRegionsL2(map: AMap.Map, cityCodes: number[]) {
    // 标记二级区域，而不是一级区域，当然只有一级的除外

    for (let i = 0; i < cityCodes.length; i++) {
        const code = cityCodes[i];

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
                    fillOpacity: 0.2,
                    fillColor: "rgba(0, 255, 0)",
                    strokeColor: "#2b8cbe",
                    bubble: true,
                });
            },
        });

        map.add(mapGeojson);
    }
}


interface Options {
    type: EnumColorRegionLevel;
    map: AMap.Map;
}

export default class RegionColorHelper {

    private codes: number[];


    constructor(private options: Options) {
        this.codes = [];
    }

    clearAllOverlays(type: string) {
        const { map } = this.options;
        const overLayers = map.getAllOverlays(type);
        overLayers.forEach(layer => map.remove(layer));
    }

    start() {
        this.codes = [];
    }

    colorRegions(codes: number[]) {
        const { map, type } = this.options;
        const fCodes = codes.filter(code => !this.codes.includes(code));

        this.codes.push(...fCodes);
        if (type == EnumColorRegionLevel.Province) return addColorRegionsL1(map, fCodes)
        return addColorRegionsL2(map, fCodes);
    }


    end() {
        this.codes = []
    }
}

