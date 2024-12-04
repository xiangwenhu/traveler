import { TravelItem } from "@/types/service";
import { ref } from "vue";
import { groupByYear } from "../../utils";
import { calcImageWithFromUrl } from "@/utils/media";
import { colorRegionsByLevel, zoomAndCenter, zoomStyleMapping } from "../util";
import { delay } from "@/utils";
import { EnumColorRegionLevel } from "@/store/modules/map";
import { useStore } from "vuex";
import { getMapFitZoom } from "@/store/quick";


async function addElasticMarkers(map: AMap.Map, items: TravelItem[]) {
    const list = items;

    const dUrl = "https://a.amap.com/jsapi/static/image/plugin/marker_red.png";
    const size1 = await calcImageWithFromUrl(dUrl, { width: 16 });

    // 创建一个用于显示标记标签的InfoWindow
    var infoWindow = new AMap.InfoWindow({
        offset: new AMap.Pixel(0, -30),
        closeWhenClickMap: true,
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
            zooms: [2, 20],
            position: [t.longitude, t.latitude], //点标记位置
            styles: stylesArray, //指定样式列表
            zoomStyleMapping, //指定 zoom 与样式的映射
            extData: t,
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

        map.add(marker);
        markers.push(marker);
    }
}


export default function useAutoMarkerByYear(options: {
    onPlayYear?(year: number, total: number): void;
    onPlayEnd?(): void;
    onPlayStart?(years: number[]): void;
}) {

    const store = useStore();


    async function startPlay(map: AMap.Map, items: TravelItem[]) {
        await startPlayByYears(map, items);
        options.onPlayEnd && options.onPlayEnd();
    }

    const level: EnumColorRegionLevel = store.getters["map/colorRegionLevel"]

    async function startPlayByYears(map: AMap.Map, items: TravelItem[]) {

        const gItems = groupByYear(items);

        options.onPlayStart && options.onPlayStart(gItems.map(g => +g.year));

        const fitZoom = getMapFitZoom();

        await zoomAndCenter(map, fitZoom);
        let total = 0;
        for (let i = 0; i < gItems.length; i++) {
            const yearItem = gItems[i];
            total += yearItem.items.length;
            if (options.onPlayYear) {
                options.onPlayYear(+yearItem.year, total)
            }
            await addElasticMarkers(map, yearItem.items);
            await colorRegionsByLevel(map, yearItem.items, level, false);
            await delay(2000);
        }
    }

    function stopPlay() { }

    return {
        startPlay,
        stopPlay,
    };
}
