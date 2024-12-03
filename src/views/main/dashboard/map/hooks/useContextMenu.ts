import { isMobile } from "@/utils";
import { ref } from "vue";

interface OnAddData {
    province: string;
    city: string;
    county: string;
    longitude: number;
    latitude: number;
    title: string;
}

var geocoder = new AMap.Geocoder({
    city: "全国",
    // cityLimit: true
});

function getAdCodeByRegionName(regionName: string): Promise<string> {
    return new Promise((resolve, reject) => {
        geocoder.getLocation(regionName, (status: string, result: any) => {
            if (status === "complete" && result.info === "OK") {
                return resolve((result.geocodes || [])[0]?.adcode as string);
            }
            return reject(new Error(result.info));
        });
    });
}



export default function useContextMenu(
    map: AMap.Map,
    options: {
        onAdd(data: OnAddData): void;
        onStartAutoPlay(): void;
        onStopAutoPlay(): void;
        onPlayByYear(): void;
    }
) {
    const isMob = isMobile();
    if (isMob) {
        return useContextMenuMobile(map, options);
    }
    return useContextMenuPC(map, options)

}

export function useContextMenuPC(
    map: AMap.Map,
    options: {
        onAdd(data: OnAddData): void;
        onStartAutoPlay(): void;
        onStopAutoPlay(): void;
        onPlayByYear(): void;
    }
) {
    const { onAdd } = options;
    const refLnglat = ref<AMap.LngLat>();

    const context = new AMap.ContextMenu({});


    context.addItem(
        "新增旅行",
        function (e) {
            context.hide();

            geocoder.getAddress(
                refLnglat.value,
                async function (status, result) {
                    if (status === "complete" && result.info === "OK") {
                        var regeocode = result.regeocode;
                        var { province, city, district } =
                            regeocode.addressComponent;

                        const provinceCode =
                            province == ""
                                ? ""
                                : await getAdCodeByRegionName(province);
                        const cityCode =
                            city == "" ? "" : await getAdCodeByRegionName(city);
                        const countyCode =
                            district == ""
                                ? ""
                                : await getAdCodeByRegionName(district);

                        const regionInfo: OnAddData = {
                            province: provinceCode,
                            city: cityCode,
                            county: countyCode,
                            longitude: refLnglat.value!.lng,
                            latitude: refLnglat.value!.lat,
                            title: regeocode.formattedAddress,
                        };

                        onAdd(regionInfo);
                        console.log(regionInfo);
                    } else {
                        console.error("逆地理编码失败：" + result.info);
                    }
                }
            );
        },
        1
    );

    context.addItem("自动播放", (e) => {
        context.hide();
        options.onStartAutoPlay && options.onStartAutoPlay();
    }, 2)

    context.addItem("停止播放", (e) => {
        context.hide();
        options.onStopAutoPlay && options.onStopAutoPlay();
    }, 2)


    context.addItem("按年演示", e => {
        context.hide();
        options.onPlayByYear && options.onPlayByYear();
    }, 4)


    map.on("rightclick", (e) => {
        refLnglat.value = e.lnglat;
        context.open(map, e.lnglat);
    });

    return {};
}



export function useContextMenuMobile(
    map: AMap.Map,
    options: {
        onAdd(data: OnAddData): void;
        onStartAutoPlay(): void;
        onStopAutoPlay(): void;
        onPlayByYear(): void;
    }
) {
    const { onAdd } = options;
    const refLnglat = ref<AMap.LngLat>();



    //自定义菜单类
    class ContextMenu {

        private contextMenu: AMap.ContextMenu;

        constructor(private map: AMap.Map) {

            const content = [];

            content.push(`
            <div class='info map-custom-context-menu '>
                <p onclick='__contextMenu__.addTravel()'>添加旅行</p>
                <p class='split_line' onclick='__contextMenu__.autoPlay()'>自动播放</p>
                <p class='split_line' onclick='__contextMenu__.stopAutoPlay()'>停止播放</p>
                <p onclick='__contextMenu__.playByYear()'>按年演示</p>
            </div>`
            );

            //通过content自定义右键菜单内容
            this.contextMenu = new AMap.ContextMenu({ isCustom: true, content: content.join('') });

            // //地图绑定鼠标右击事件——弹出右键菜单
            // map.on("touchend", (e) => {
            //     refLnglat.value = e.lnglat;
            //     this.open(e.lnglat);
            // });

            this.registerTrigger();
        }

        registerTrigger() {
            // 定义长按事件的参数
            var longPressThreshold = 1500; // 长按时间阈值（毫秒）
            var touchStartTime = 0;
            var isLongPress = false;
            var startX, startY;


            const that = this; 

            // 监听 touchstart 事件
            map.on('touchstart', function (e) {
                touchStartTime = new Date().getTime();
                isLongPress = true;
                startX = e.originEvent.touches[0].clientX;
                startY =e.originEvent.touches[0].clientY;

                // 设置一个定时器，如果在指定时间内没有触发 touchend 或 touchmove 事件，则认为是长按
                setTimeout(function () {
                    if (isLongPress) {
                        handleLongPress(e);
                    }
                }, longPressThreshold);
            });

            // 监听 touchmove 事件
            map.on('touchmove', function (e) {
                isLongPress = false;
            });

            // 监听 touchend 事件
            map.on('touchend', function (e) {
                isLongPress = false;
            });

            // 处理长按事件
            function handleLongPress(event: any) {
                var lnglat = event.lnglat;
                console.log('长按位置：', lnglat);
                that.open(lnglat)
                
            }

            // // 辅助函数：计算两点之间的距离
            // function calculateDistance(x1, y1, x2, y2) {
            //     return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
            // }
        }

        hide() {
            this.contextMenu.hide();
        }

        open(pos: AMap.Vector2) {
            this.contextMenu.open(this.map, pos)
        }


        addTravel = (e: any) => {
            this.hide();

            geocoder.getAddress(
                refLnglat.value,
                async function (status: string, result: any) {
                    if (status === "complete" && result.info === "OK") {
                        var regeocode = result.regeocode;
                        var { province, city, district } =
                            regeocode.addressComponent;

                        const provinceCode =
                            province == ""
                                ? ""
                                : await getAdCodeByRegionName(province);
                        const cityCode =
                            city == "" ? "" : await getAdCodeByRegionName(city);
                        const countyCode =
                            district == ""
                                ? ""
                                : await getAdCodeByRegionName(district);

                        const regionInfo: OnAddData = {
                            province: provinceCode,
                            city: cityCode,
                            county: countyCode,
                            longitude: refLnglat.value!.lng,
                            latitude: refLnglat.value!.lat,
                            title: regeocode.formattedAddress,
                        };

                        onAdd(regionInfo);
                        console.log(regionInfo);
                    } else {
                        console.error("逆地理编码失败：" + result.info);
                    }
                }
            );
        }

        autoPlay = () => {
            this.hide();
            options.onStartAutoPlay && options.onStartAutoPlay();
        }

        stopAutoPlay = () => {
            this.hide();
            options.onStopAutoPlay && options.onStopAutoPlay();
        }

        playByYear = () => {
            this.hide();
            options.onPlayByYear && options.onPlayByYear();
        }

    }

    const contextMenu = new ContextMenu(map);

    // @ts-ignore
    globalThis.__contextMenu__ = contextMenu;

    return {
        contextMenu
    };
}
