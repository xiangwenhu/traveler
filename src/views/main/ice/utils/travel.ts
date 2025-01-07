import { registerMediaInfo, RegisterMediaInfo } from "@/api/ice";
import { getItems } from "@/api/resource";
import { getItemById } from "@/api/travel";
import { ResourceItem } from "@/types/service";
import { getMediaType, isImage } from "@/utils/media";


async function syncMedias(travelId: number, projectId: number) {
    // 获取旅行
    // const resTravel = await getItemById(travelId);
    // if (!resTravel || resTravel.code != 0) return;

    // 获取关联的资源
    const resResources = await getItems({ travelId, pageNum: 1, pageSize: 1000 });
    if (!resResources || resResources.code != 0) return;


    // 查询项目已有的媒体资源

    
    // 过滤出未添加的媒体资源

    // 注册媒体资源
    const medias=   await batchRegisterMediaInfo(resResources.data?.list || []);


    // 添加到云剪辑项目
}


/**
 * 注册媒体
 * @param resources 
 */
async function batchRegisterMediaInfo(resources: ResourceItem[]) {
    const mediaInfos: (RegisterMediaInfo & {
        MediaId: string;
    })[] = resources.map(r => ({
        InputURL: r.url,
        MediaType: getMediaType(r.url),
        Title: r.title,
        MediaId: ''
    }));

    for (let i = 0; i < mediaInfos.length; i++) {
        const m = mediaInfos[i];
        const res = await registerMediaInfo(m);
        m.MediaId = res.data?.MediaId || '';
    }

    return mediaInfos;

}


async function addEditingProjectMaterials() {


}