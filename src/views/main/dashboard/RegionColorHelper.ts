import { getGeoJSON } from "@/api/geo";
import { ADCODE_CHINA } from "@/const";
import { EnumColorRegionLevel } from "@/store/modules/map";
import { GeoJSONFeature } from "@/types";



export async function addColorRegionsL1(map: AMap.Map, provinceCodes: number[], options = {}) {
    console.log("addColorRegionsL1");

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


            const polygon = new AMap.Polygon({
                path: lnglats,
                strokeWeight: 1,
                fillOpacity: 0.2,
                fillColor: "rgba(0, 255, 0)",
                strokeColor: "#2b8cbe",
                bubble: true,
                ...options
            });
            polygon.setExtData({
                code: geoFeatrue.properties.adcode,
                isColorRegion: true,
                options,
                isNew: true
            })
            return polygon;

        },
    });

    map.add(mapGeojson);
}

export async function addColorRegionsL2(map: AMap.Map, cityCodes: number[], options = {}) {
    // 标记二级区域，而不是一级区域，当然只有一级的除外

    console.log("addColorRegionsL2");
    for (let i = 0; i < cityCodes.length; i++) {
        const code = cityCodes[i];

        const geoJSON = await getGeoJSON(`${code}.json`);
        var mapGeojson = new AMap.GeoJSON({
            geoJSON: geoJSON,
            // 还可以自定义getMarker和getPolyline
            getPolygon: function (geoFeatrue: GeoJSONFeature, lnglats: any[]) {
                const polygon = new AMap.Polygon({
                    path: lnglats,
                    strokeWeight: 1,
                    fillOpacity: 0.2,
                    fillColor: "rgba(0, 255, 0)",
                    strokeColor: "#2b8cbe",
                    bubble: true,
                    ...options
                });

                polygon.setExtData({
                    code,
                    isColorRegion: true,
                    options,
                    isNew: true
                })

                return polygon;

            },
        });
        // debugger;
        map.add(mapGeojson);
    }
}


interface Options {
    type: EnumColorRegionLevel;
    map: AMap.Map;
    isHighlightNew?: boolean;
    newOptions: Record<string, any>;
    oldOptions?: Record<string, any>
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

    private setOldRegions() {

        const { newOptions, oldOptions } = this.options;

        const layerOptions = Object.assign({}, newOptions, oldOptions)

        const overLayers: AMap.Polygon[] = this.options.map.getAllOverlays("polygon").filter(layer => {
            const extData = layer.getExtData();
            return extData && extData.isColorRegion && extData.isNew
        });
        if (overLayers.length > 0) {
            overLayers.forEach(layer => {
                layer.setOptions({
                    strokeWeight: layerOptions.strokeWeight,
                    fillOpacity: layerOptions.fillOpacity,
                    fillColor: layerOptions.fillColor,
                    strokeColor: layerOptions.strokeColor,
                })
            })
        }
    }

    colorRegions(codes: number[]) {
        const { map, type, isHighlightNew, newOptions, oldOptions } = this.options;
        const fCodes = codes.filter(code => !this.codes.includes(code));

        if (fCodes.length === 0) return;

        this.codes.push(...fCodes);

        if (isHighlightNew) {
            this.setOldRegions()
        }

        if (type == EnumColorRegionLevel.Province) return addColorRegionsL1(map, fCodes, newOptions)
        return addColorRegionsL2(map, fCodes, newOptions);
    }


    end() {
        this.codes = []
    }
}

