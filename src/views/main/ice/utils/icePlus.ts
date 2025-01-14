import { AddEditingProjectMaterialMaps, addEditingProjectMaterials, batchGetMediaInfos, createEditingProject, getEditingProject, getEditingProjectMaterials, registerMediaInfo, RegisterMediaInfo, RegisterMediaType } from "@/api/ice";
import { getItems } from "@/api/resource";
import { getItemById, updateItem } from "@/api/travel";
import { EnumMediaBasicInfoStatus, GetEditingProjectMaterialsRes, MediaBasicInfo, MediaInfo } from "@/types/ice";
import { ResourceItem } from "@/types/service";
import { delay } from "@/utils";
import { getMediaType, isImage } from "@/utils/media";


function log(...messages: any[]){
    console.log(`${new Date().toLocaleTimeString()}:`, ...messages);
}


async function ensureProject(travelId: number) {
    const resTravel = await getItemById(travelId);
    if (!resTravel || resTravel.code != 0) throw new Error(`travelId为${travelId}的旅行不存在`);
    if (!resTravel.data) throw new Error(`travelId为${travelId}的旅行不存在`);

    const item = resTravel.data;
    let projectId: string | undefined = item.iceProjectId;


    if (projectId) {
        const resProject = await getEditingProject({ ProjectId: projectId })
        if (!resProject || resProject.code != 0) throw new Error(`查询云剪辑项目失败`);
        // if (!resProject.data?.Project) throw new Error(`阿里云剪辑的ID为${iceProjectId}项目不存在`);
        // 旧项目不存在
        if (!resProject.data?.Project) {
            projectId = undefined;
        }
    }

    if (!projectId) {
        const res = await createEditingProject({
            Title: item.title,
            Description: item.description,
            CoverURL: item.cover,
        });
        if (!res || res.code != 0) return;
        projectId = res.data?.Project.ProjectId;
        if (!projectId) return;
        const resUpdate = await updateItem({
            id: item.id!,
            iceProjectId: projectId,
        } as any);

        if (!res || res.code != 0) throw new Error("同步云剪辑信息到旅行信息失败")
    }

    return {
        travel: item,
        projectId
    };
}

export async function syncResourcesToICEProject(travelId: number) {
    // 获取旅行
    // const resTravel = await getItemById(travelId);
    // if (!resTravel || resTravel.code != 0) return;

    const p = await ensureProject(travelId);
    if (!p) throw new Error("获取云剪辑项目信息失败");

    const { travel, projectId } = p;

    // 获取关联的资源
    const resResources = await getItems({ travelId, pageNum: 1, pageSize: 1000 });
    if (!resResources || resResources.code != 0) throw new Error("查询旅行的资源失败");


    const resources = resResources.data!.list;
    log("ice 资源数量：", resources.length);

    if (resources.length == 0) return p;

    // 查询项目已有的媒体资源
    const resPMaterials = await getEditingProjectMaterials({ ProjectId: projectId })
    if (!resPMaterials || resPMaterials.code != 0) throw new Error("获取云剪辑项目媒体资源失败");;
    const urls = (resPMaterials.data?.MediaInfos || []).map(m => m.MediaBasicInfo.InputURL) || [];

    // 过滤出未添加的媒体资源
    const unRegisterResources = resources.filter(r => !urls.includes(r.url));
    log("ice 未注册的媒体资源数量：", unRegisterResources.length);
    if (unRegisterResources.length == 0) return p;

    // 注册媒体资源

    const infos = unRegisterResources.map(r => ({
        InputURL: r.url,
        MediaType: getMediaType(r.url) as RegisterMediaType,
        Title: r.title,
        Overwrite: true
    }));
    // const medias = await batchRegisterMediaInfo(infos || []);
    // // 添加到云剪辑项目
    // const gList = getMaterialMapsList(medias);

    // await toAddEditingProjectMaterials(projectId, gList)

    if (infos.length > 0) {
        await batchRegisterMediasAddToProject(infos, projectId);
    }

    return p;
}


type SimpleMediaInfo = Pick<MediaBasicInfo, "MediaId" | "MediaType">

function getMaterialMapsList(medias: SimpleMediaInfo[]) {

    const map: {
        "audio": string[];
        "image": string[];
        "video": string[]
    } = {
        "audio": [],
        "image": [],
        "video": []
    }

    medias.forEach(m => {
        const type = m.MediaType;
        // @ts-ignore
        if (type && map[type] && m.MediaId) {
            // @ts-ignore
            map[type].push(m.MediaId)
        }
    });

    const maxLength = Math.max(map.audio.length, map.video.length, map.image.length);
    // 单次某种媒体最多10个；
    const times = Math.ceil(maxLength / 10);
    const S_MAX = 10;

    const list: AddEditingProjectMaterialMaps[] = [];
    for (let i = 0; i < times; i++) {
        const g: AddEditingProjectMaterialMaps = {};
        const start = i * S_MAX;
        const end = (i + 1) * S_MAX - 1;

        if (map.audio.length >= start + 1) {
            g.audio = (g.audio || "") + map.audio.slice(start, end).join(",")
        }

        if (map.video.length >= start + 1) {
            g.video = (g.video || "") + map.video.slice(start, end).join(",")
        }


        if (map.image.length >= start + 1) {
            g.image = (g.image || "") + map.image.slice(start, end).join(",")
        }

        list.push(g);

    }
    return list;
}

/**
 * 注册媒体
 * @param resources 
 */
async function batchRegisterMediaInfo(infos: RegisterMediaInfo[]) {
    const mediaInfos: (RegisterMediaInfo & {
        MediaId?: string;
    })[] = infos.map(r => ({
        ...r
    }));

    for (let i = 0; i < mediaInfos.length; i++) {
        try {
            const m = mediaInfos[i];
            const res = await registerMediaInfo(m);
            m.MediaId = res.data?.MediaId || '';
        } catch (err: any) {
            log("ice registerMediaInfo error:", err);
        }
    }
    return mediaInfos.filter(m => m.MediaId).map(m => ({
        MediaId: m.MediaId,
        MediaType: m.MediaType
    }) as SimpleMediaInfo);
}


async function toAddEditingProjectMaterials(projectId: string, list: AddEditingProjectMaterialMaps[]) {

    const results: MediaInfo[] = [];
    for (let i = 0; i < list.length; i++) {
        try {
            const map = list[i];
            const res = await addEditingProjectMaterials({
                ProjectId: projectId,
                MaterialMaps: JSON.stringify(map)
            });
            if (!res || res.code !== 0) log("ice addEditingProjectMaterials error:", res.msg);

            if (res.data?.MediaInfos) {
                results.push(...res.data?.MediaInfos)
            }
        } catch (err) {
            log("ice addEditingProjectMaterials error:", err);
        }
    }

    return results;
}



const completedStatusList = [
    EnumMediaBasicInfoStatus.Blocked,
    EnumMediaBasicInfoStatus.Normal,
    EnumMediaBasicInfoStatus.PrepareFail,
    EnumMediaBasicInfoStatus.TranscodeFail,
    EnumMediaBasicInfoStatus.UploadFail
]
function isCompleteStatus(status: EnumMediaBasicInfoStatus) {
    return completedStatusList.includes(status)
}


function mediaInfoListToSimgleList(medias: MediaInfo[]) {
    return medias.map(m => ({
        MediaId: m.MediaId,
        MediaType: m.MediaBasicInfo.MediaType
    }))
}

function getOkList(medias: MediaInfo[]) {
    return mediaInfoListToSimgleList(medias.filter(m => isCompleteStatus(m.MediaBasicInfo.Status)))
}

function getNotOkList(medias: MediaInfo[]) {
    return mediaInfoListToSimgleList(medias.filter(m => !isCompleteStatus(m.MediaBasicInfo.Status)))
}

async function checkMediaInfos(medias: SimpleMediaInfo[], timetout: number = 10 * 1000): Promise<SimpleMediaInfo[]> {


    const okMedias: SimpleMediaInfo[] = [];
    let notOkMedias: SimpleMediaInfo[] = medias;
    return new Promise(async (resolve, reject) => {
        const ticket = setTimeout(() => {
            notOkMedias.length !== 0
            resolve(okMedias);
        }, timetout)


        while (notOkMedias.length !== 0) {

            const mediaIds = notOkMedias.map(m => m.MediaId).join(",")
            const res = await batchGetMediaInfos({ MediaIds: mediaIds });

            if (!res || res.code != 0) {
                await delay(1000);
                continue;
            }

            const resMedias: MediaInfo[] = res.data!.MediaInfos || [];

            const okItems = resMedias.filter(m => isCompleteStatus(m.MediaBasicInfo.Status)).map(m => ({
                MediaId: m.MediaId,
                MediaType: m.MediaBasicInfo.MediaType
            }));

            okMedias.push(...okItems)
            notOkMedias = resMedias.filter((m => !isCompleteStatus(m.MediaBasicInfo.Status))).map(m => ({
                MediaId: m.MediaId,
                MediaType: m.MediaBasicInfo.MediaType
            }));

            // 还有未完成状态的媒体
            if (notOkMedias.length !== 0) {
                await delay(1000);
                continue;
            }

            break;

        }
        clearTimeout(ticket);
        resolve(okMedias);
    })
}

export async function batchRegisterMediasAddToProject(infos: RegisterMediaInfo[], projectId: string) {

    // 批量注册
    log("ice 批量注册:开始，注册数量：", infos.length);
    const medias = await batchRegisterMediaInfo(infos || []);
    log("ice 批量注册:完毕，注册成功数量：", medias.length);

    // 检查注册状态
    log("ice 检查媒体注册：开始，需检查数量:", medias.length);
    const rMedias: SimpleMediaInfo[] = await checkMediaInfos(medias);
    log("ice 检查媒体注册：开始，检查成功数量:", rMedias.length);

    // 因为单次某种最大10个，分组
    const gList = getMaterialMapsList(rMedias);

    // 批量注册到项目
    log("ice 批量添加到项目：开始，需添加数量:", rMedias.length);
    const results = await toAddEditingProjectMaterials(projectId, gList)
    log("ice 批量添加到项目：完毕，实际添加数量:", results.length);

    return results;
}