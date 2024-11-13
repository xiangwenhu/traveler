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

    context.addItem("自动播放", (e)=> {
        context.hide();
        options.onStartAutoPlay && options.onStartAutoPlay();
    }, 2)

    context.addItem("停止播放", (e)=> {
        context.hide();
        options.onStopAutoPlay && options.onStopAutoPlay();
    }, 2)


    context.addItem("按年演示", e=> {
        context.hide();
        options.onPlayByYear && options.onPlayByYear();
    },4)


    map.on("rightclick", (e) => {
        refLnglat.value = e.lnglat;
        context.open(map, e.lnglat);
    });

    return {};
}
