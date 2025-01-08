import { AddEditingProjectMaterialMaps, addEditingProjectMaterials, createEditingProject, getEditingProject, getEditingProjectMaterials, registerMediaInfo, RegisterMediaInfo } from "@/api/ice";
import { getItems } from "@/api/resource";
import { getItemById, updateItem } from "@/api/travel";
import { ResourceItem } from "@/types/service";
import { getMediaType, isImage } from "@/utils/media";



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

    const {travel, projectId } = p; 

    // 获取关联的资源
    const resResources = await getItems({ travelId, pageNum: 1, pageSize: 1000 });
    if (!resResources || resResources.code != 0) throw new Error("查询旅行的资源失败");
    const resources = resResources.data!.list;
    if (resources.length == 0) return p;

    // 查询项目已有的媒体资源
    const resPMaterials = await getEditingProjectMaterials({ ProjectId: projectId })
    if (!resPMaterials || resPMaterials.code != 0) throw new Error("获取云剪辑项目媒体资源失败");;
    const urls = (resPMaterials.data?.MediaInfos || []).map(m => m.MediaBasicInfo.InputURL) || [];

    // 过滤出未添加的媒体资源
    const unRegisterResources = resources.filter(r => !urls.includes(r.url));
    if (unRegisterResources.length == 0) return p;

    // 注册媒体资源
    const medias = await batchRegisterMediaInfo(unRegisterResources || []);

    // 添加到云剪辑项目
    const gList = getMaterialMapsList(medias);

    await toAddEditingProjectMaterials(projectId, gList)

    return  p;
}


function getMaterialMapsList(medias: (RegisterMediaInfo & {
    MediaId?: string;
})[]) {

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
        if (type && map[type] && m.MediaId) {
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
async function batchRegisterMediaInfo(resources: ResourceItem[]) {
    const mediaInfos: (RegisterMediaInfo & {
        MediaId?: string;
    })[] = resources.map(r => ({
        InputURL: r.url,
        MediaType: getMediaType(r.url),
        Title: r.title,
        Overwrite: true
    }));

    for (let i = 0; i < mediaInfos.length; i++) {
        const m = mediaInfos[i];
        const res = await registerMediaInfo(m);
        m.MediaId = res.data?.MediaId || '';
    }

    return mediaInfos;

}


async function toAddEditingProjectMaterials(projectId: string, list: AddEditingProjectMaterialMaps[]) {

    for (let i = 0; i < list.length; i++) {
        const map = list[i];
        const res = await addEditingProjectMaterials({
            ProjectId: projectId,
            MaterialMaps: JSON.stringify(map)
        });
        if (!res || res.code !== 0) console.error("addEditingProjectMaterials error:", res.msg);
    }

}