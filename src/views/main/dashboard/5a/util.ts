import { AAAAAItem } from "@/types/service";
import { calcImageWithFromUrl } from "@/utils/media";

export async function addMarkers(
    map: AMap.Map,
    items: AAAAAItem[]
) {
    const list = items;

    // 创建一个用于显示标记标签的InfoWindow
    var infoWindow = new AMap.InfoWindow({
        offset: new AMap.Pixel(0, -30),
        closeWhenClickMap: true,
        autoMove: false
    });


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

    var markers: any[] = [];
    for (let i = 0; i < list.length; i++) {
        const item = list[i];

        const cover = item.photos[0]?.url || '';
        const marker = new AMap.Marker({
            zooms: [4, 20],
            position: [item.longitude, item.latitude], //点标记位置
            extData: item,
        });

        // marker.setLabel({
        //     direction:'right',
        //     offset: new AMap.Pixel(0, 0),  //设置文本标注偏移量
        //     content: `<div class='info'>${item.name}</div>`, //设置文本标注内容

        // });

        // console.log(`${i+1}  ${item.name}`);


        marker.on("click", (e: any) => {
            const zoom = map.getZoom();
            var data: AAAAAItem = e.target.getExtData(); // 获取额外数据
            const cover = data.photos[0]?.url || '';
            infoWindow.setContent(`
            <div class="marker-label c-marker-label">
                <div>${data.name} 
                <a style="margin-left:10px" target="_blank" href="https://baike.baidu.com/item/${encodeURIComponent(item.name)}">查看详情</a>
            </div>
            <div>${data.provinceName}/${data.cityName} ${data.countyName ? '/' + data.countyName : ''} </div>
            <div><img src="${cover}" style="height:200px"></img></div>
            </div>
            `);
            infoWindow.open(map, e.target.getPosition());
            infoWindow.setExtData(item);
        });

        // 添加鼠标移出事件
        marker.on("mouseout", function () {
            // infoWindow.close();
        });

        map.add(marker);
        markers.push(marker);
    }
}