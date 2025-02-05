import {
    transMediaList,
    objectKeyPascalCaseToCamelCase,
    pageData,
} from ".";
import { get, lowerFirst } from "lodash";
import { ElMessage } from "element-plus";
import { requestGet, requestPost } from "@/api/ice";

export const transVoiceGroups = (data = []) => {
    return data.map(({ Type: type, VoiceList = [] }) => {
        return {
            type,
            voiceList: VoiceList.map((item: any) => {
                const obj: Record<string, any> = {};
                Object.keys(item).forEach((key: any) => {
                    obj[lowerFirst(key)] = item[key];
                });
                return obj;
            }),
        };
    });
};

let CUSTOM_VOICE_GROUPS: any[] = [];

export async function createCustomVoiceGroups() {
    if (CUSTOM_VOICE_GROUPS.length > 0) {
        return CUSTOM_VOICE_GROUPS;
    }
    CUSTOM_VOICE_GROUPS = await requestGet("ListSmartVoiceGroups").then(
        (res) => {
            const commonItems: any[] = transVoiceGroups(
                get(res, "data.VoiceGroups", [])
            );
            const customItems = commonItems.concat([
                {
                    type: "基础",
                    category: "专属人声",
                    emptyContent: {
                        description: "暂无人声 可通过",
                        link: "",
                        linkText: "创建专属人声",
                    },
                    getVoiceList: async (page: number, pageSize: number) => {
                        const custRes = await requestGet(
                            "ListCustomizedVoices",
                            {
                                PageNo: page,
                                PageSize: pageSize,
                            }
                        );
                        const items = get(
                            custRes,
                            "data.Data.CustomizedVoiceList"
                        );
                        const total = get(custRes, "data.Data.Total");
                        const kv: Record<string, string> = {
                            story: "故事",
                            interaction: "交互",
                            navigation: "导航",
                        };
                        return {
                            items: items.map((it: any) => {
                                return {
                                    desc:
                                        it.VoiceDesc ||
                                        kv[it.Scenario] ||
                                        it.Scenario,
                                    voiceType:
                                        it.Gender === "male"
                                            ? "Male"
                                            : "Female",
                                    voiceUrl: it.VoiceUrl || "",
                                    tag: it.VoiceDesc || it.Scenario,
                                    voice: it.VoiceId,
                                    name: it.VoiceName || it.VoiceId,
                                    remark: it.Scenario,
                                    demoMediaId: it.DemoAudioMediaId,
                                    custom: true,
                                };
                            }),
                            total,
                        };
                    },
                    getVoice: async (voiceId: number) => {
                        const custRes = await requestGet("GetCustomizedVoice", {
                            VoiceId: voiceId,
                        });
                        const item = get(custRes, "data.Data.CustomizedVoice");
                        const kv: Record<string, any> = {
                            story: "故事",
                            interaction: "交互",
                            navigation: "导航",
                        };

                        return {
                            desc:
                                item.VoiceDesc ||
                                kv[item.Scenario] ||
                                item.Scenario,
                            voiceType:
                                item.Gender === "male" ? "Male" : "Female",
                            voiceUrl: item.VoiceUrl || "",
                            tag: item.VoiceDesc || item.Scenario,
                            voice: item.VoiceId,
                            name: item.VoiceName || item.VoiceId,
                            remark: item.Scenario,
                            demoMediaId: item.DemoAudioMediaId,
                            custom: true,
                        };
                    },
                    getDemo: async (mediaId: number) => {
                        const mediaInfo = await requestGet("GetMediaInfo", {
                            MediaId: mediaId,
                        });
                        const src = get(
                            mediaInfo,
                            "data.MediaInfo.FileInfoList[0].FileBasicInfo.FileUrl"
                        );
                        return {
                            src: src,
                        };
                    },
                },
                {
                    type: "大众",
                    category: "专属人声",
                    emptyContent: {
                        description: "暂无人声 可通过",
                        link: "",
                        linkText: "创建专属人声",
                    },
                    getVoiceList: async (page: number, pageSize: number) => {
                        const custRes = await requestGet(
                            "ListCustomizedVoices",
                            {
                                PageNo: page,
                                PageSize: pageSize,
                                Type: "Standard",
                            }
                        );
                        const items = get(
                            custRes,
                            "data.Data.CustomizedVoiceList"
                        );
                        const total = get(custRes, "data.Data.Total");

                        return {
                            items: items.map((it: any) => {
                                return {
                                    desc: it.VoiceDesc,
                                    voiceType:
                                        it.Gender === "male"
                                            ? "Male"
                                            : "Female",
                                    voiceUrl: it.VoiceUrl || "",
                                    tag: it.VoiceDesc,
                                    voice: it.VoiceId,
                                    name: it.VoiceName || it.VoiceId,
                                    remark: it.Scenario,
                                    demoMediaId: it.DemoAudioMediaId,
                                    custom: true,
                                };
                            }),
                            total,
                        };
                    },
                    getVoice: async (voiceId: number) => {
                        const custRes = await requestGet("GetCustomizedVoice", {
                            VoiceId: voiceId,
                        });
                        const item = get(custRes, "data.Data.CustomizedVoice");
                        const kv: Record<string, string> = {
                            story: "故事",
                            interaction: "交互",
                            navigation: "导航",
                        };

                        return {
                            desc:
                                item.VoiceDesc ||
                                kv[item.Scenario] ||
                                item.Scenario,
                            voiceType:
                                item.Gender === "male" ? "Male" : "Female",
                            voiceUrl: item.VoiceUrl || "",
                            tag: item.VoiceDesc || item.Scenario,
                            voice: item.VoiceId,
                            name: item.VoiceName || item.VoiceId,
                            remark: item.Scenario,
                            demoMediaId: item.DemoAudioMediaId,
                            custom: true,
                        };
                    },
                    getDemo: async (mediaId: number) => {
                        const mediaInfo = await requestGet("GetMediaInfo", {
                            MediaId: mediaId,
                        });
                        const src = get(
                            mediaInfo,
                            "data.MediaInfo.FileInfoList[0].FileBasicInfo.FileUrl"
                        );
                        return {
                            src: src,
                        };
                    },
                },
            ]);
            return customItems;
        }
    );
    return CUSTOM_VOICE_GROUPS;
}

export function createCustomFontList(customFontList = []) {
    return [
        () => {
            return true;
        },
        ...customFontList,
    ];
}

export function createTemplateFetcher(
    templateId: string,
    message: typeof ElMessage
) {
    const getTemplate = async () => {
        const getTemplateReq = requestPost("GetTemplate", {
            // https://help.aliyun.com/zh/ims/developer-reference/api-ice-2020-11-09-gettemplate?spm=a2c4g.11186623.0.0.52155ac3Mtiw0l
            TemplateId: templateId,
            RelatedMediaidFlag: 1,
        });

        const res: any = await getTemplateReq;
        return res;
    };
    function parseRelatedMap(RelatedMediaids: string) {
        let RelatedMediaMap = {};
        try {
            RelatedMediaMap = JSON.parse(RelatedMediaids);
        } catch (ex) {}
        return RelatedMediaMap;
    }
    return {
        deleteTemplateMaterials: async (mediaId: string, mediaType: string) => {
            const res: any = await getTemplate();
            const { RelatedMediaids } = res.data.Template;
            const MediaIdsMap: Record<string, any> =
                parseRelatedMap(RelatedMediaids);
            if (
                MediaIdsMap[mediaType] &&
                MediaIdsMap[mediaType].includes(mediaId)
            ) {
                MediaIdsMap[mediaType].splice(
                    MediaIdsMap[mediaType].indexOf(mediaId),
                    1
                );

                const newRelatedMediaids = JSON.stringify(MediaIdsMap);
                const updateParams = {
                    TemplateId: templateId,
                    RelatedMediaids: newRelatedMediaids,
                };

                const res: any = await requestPost(
                    "UpdateTemplate",
                    updateParams
                );

                if (res.status === 200) {
                    return true;
                }
            }

            return false;
        },

        addTemplateMaterials: async (items: any[]) => {
            const res: any = await getTemplate();
            const { RelatedMediaids } = res.data.Template;
            const MediaIdsMap: Record<string, any> =
                parseRelatedMap(RelatedMediaids);
            items.forEach(({ mediaType, mediaId }) => {
                if (!MediaIdsMap[mediaType]) {
                    MediaIdsMap[mediaType] = [];
                }

                if (!MediaIdsMap[mediaType].includes(mediaId)) {
                    MediaIdsMap[mediaType].push(mediaId);
                }
            });

            // 更新模板绑定素材
            const newRelatedMediaids = JSON.stringify(MediaIdsMap);
            const updateParams = {
                TemplateId: templateId,
                RelatedMediaids: newRelatedMediaids,
            };
            await requestPost("UpdateTemplate", updateParams);
        },

        getTemplateMaterials: async () => {
            const res: any = await getTemplate();
            const { RelatedMediaids } = res.data.Template;

            const RelatedMediaMap: Record<string, any> =
                parseRelatedMap(RelatedMediaids);

            const MediaIds = Object.values(RelatedMediaMap).reduce(
                (acc, cur) => acc.concat(cur),
                []
            );

            const getTimes = Math.ceil(MediaIds.length / 20);
            const promiseGroup = [];

            for (let i = 0; i < getTimes; i++) {
                promiseGroup.push(
                    requestPost("BatchGetMediaInfos", {
                        AdditionType: "FileInfo",
                        MediaIds: MediaIds.slice(i * 20, (i + 1) * 20).join(
                            ","
                        ),
                    }).then((res) => {
                        return res.data;
                    })
                );
            }

            const result = await Promise.all(promiseGroup);
            const MediaInfoGroup = result.reduce((acc, { MediaInfos = [] }) => {
                return acc.concat(MediaInfos);
            }, []);

            // 转换资源
            return transMediaList(MediaInfoGroup);
        },
        getTemplateProject: async () => {
            const res: any = await getTemplate();
            const timelineString = res.data.Template.Config;
            const timeline = timelineString
                ? JSON.parse(timelineString)
                : undefined;
            return {
                projectId: `template_${templateId}`,
                timeline: timeline,
            };
        },
        updateTemplate: async ({
            coverUrl,
            aspectRatio,
            timeline,
            recommend,
            isAuto,
        }: any) => {
            const updateParams = {
                TemplateId: templateId,
                Config: JSON.stringify(timeline),
            };
            await requestPost("UpdateTemplate", updateParams);
            if (!isAuto) {
                message.success("保存成功");
            }
        },
    };
}

export async function getTempFileLocation() {
    const storageListReq = await requestGet("GetStorageList");
    const tempFileStorageLocation = storageListReq.data.StorageInfoList.find(
        (item: any) => {
            return item.EditingTempFileStorage;
        }
    );
    return tempFileStorageLocation;
}

export function createEditor({
    container,
    locale,
    mode = "project",
    projectId,
    templateId,
    onSearchMedia,
    onProduceEditingProjectVideo,
    message,
}: any) {
    const initConfig = (customVoiceGroups: any[]) => {
        const templateFetcher = createTemplateFetcher(templateId, message);
        const customFontList: any[] = createCustomFontList([
            {
                // key: '阿朱泡泡体', // 需要是唯一的key，不能与与其他字体相同，中英文均可
                // name: '阿朱泡泡体', // 展示在页面的名称
                // urlType:'static',// static 静态地址,dynamic 动态地址，会走getDynamicSrc回调
                // url: 'https://test-shanghai.oss-cn-shanghai.aliyuncs.com/xxxxx/阿朱泡泡体.ttf',
            },
        ]);
        return {
            licenseConfig: {
                rootDomain: "", // license使用的根域名，例如abc.com
                licenseKey: "", // 申请的licenseKey，没有配置licenseKey，在预览时会出现水印,没有配置license的情况下，只能在localhost的域名下预览
            },
            // 模板模式 参考模板模式接入相关文档：https://help.aliyun.com/document_detail/453481.html?spm=a2c4g.453478.0.0.610148d1ikCUxq
            mode: mode,
            // 默认字幕文案
            defaultSubtitleText: "默认文案",

            // 自定义画布比例
            // defaultAspectRatio: '9:16',
            // 自定义画布比例列表
            customAspectRatioList: [
                "1:1",
                "2:1",
                "4:3",
                "3:4",
                "9:16",
                "16:9",
                "21:9",
                "16:10",
            ],
            // 自定义按钮文案
            customTexts: {
                importButton: "自定义导入",
                updateButton: "自定义保存",
                produceButton: "自定义生成",
                // logoUrl: 'https://www.example.com/assets/example-logo-url.png' 自定义logo
            },
            // 自定义人声
            customVoiceGroups,
            // 自定义字体
            customFontList: customFontList,
            // 页面容器
            container: container,
            // 多语言
            locale,
            // 获取在getEditingProjectMaterials不存在，但在timeline中存在的素材信息
            getTimelineMaterials: async (params: any[]) => {
                const jobs: any[] = [];

                params.forEach((item: any) => {
                    if (item.mediaIdType === "mediaURL") {
                        if (item.mediaId.includes("ice-pub")) {
                            jobs.push({
                                Action: "GetPublicMediaInfo",
                                params: { InputURL: item.mediaId },
                                item,
                            });
                        } else {
                            jobs.push({
                                Action: "GetMediaInfo",
                                params: { InputURL: item.mediaId },
                                item,
                            });
                        }
                    } else if (item.mediaId.indexOf("public") >= 0) {
                        jobs.push({
                            Action: "GetPublicMediaInfo",
                            params: { MediaId: item.mediaId },
                            item,
                        });
                    } else {
                        jobs.push({
                            Action: "GetMediaInfo",
                            params: { MediaId: item.mediaId },
                            item,
                        });
                    }
                });
                const jobPage = pageData(jobs, 5);
                let results: any[] = [];
                const extraLibs: any[] = [];
                for (let i = 0; i < jobPage.pageCount; i++) {
                    const items = jobPage.getData(i + 1);
                    const promises = items.map(async (item: any) => {
                        try {
                            const res: any = await requestPost(
                                item.Action,
                                item.params
                            );
                            return get(res, "data.MediaInfo");
                        } catch (ex) {
                            // 外链地址兜底逻辑
                            extraLibs.push({
                                mediaId: item.item.mediaId,
                                mediaIdType: item.item.mediaIdType,
                                mediaType: item.item.mediaType,
                                [`${item.item.mediaType}`]: {
                                    title: `${item.item.mediaType}_${item.item.mediaId}`, //标题，视频标题
                                    duration: undefined, // 需要填写真实的视频或音频时长
                                    coverUrl:
                                        item.item.mediaType === "image"
                                            ? item.item.mediaId
                                            : undefined, ///封面图，图片时必填
                                },
                            });
                        }
                    });
                    // eslint-disable-next-line no-await-in-loop
                    const data = await Promise.all(promises);
                    results = results.concat(
                        data.filter((item: any) => item !== undefined)
                    );
                }

                const mediaLibs = transMediaList(results);

                return [...mediaLibs, ...extraLibs];
            },
            // 媒资库默认情况下播放地址会过期，所以需要动态获取
            useDynamicSrc: true,
            getDynamicSrc: (
                mediaId: string,
                mediaType: string,
                mediaOrigin: string,
                InputURL: string
            ) => {
                const params: Record<string, any> = {
                    MediaId: mediaId,
                    OutputType: "cdn",
                };
                // 从媒资库动态获取字体地址的例子，使用 InputURL 查询
                if (mediaType === "font") {
                    params.InputURL = InputURL;
                    delete params.MediaId;
                }
                if (mediaOrigin === "mediaURL") {
                    params.InputURL = mediaId;
                    delete params.MediaId;
                }

                const apiName =
                    mediaOrigin === "public"
                        ? "GetPublicMediaInfo"
                        : "GetMediaInfo";
                return requestPost(apiName, {
                    // https://help.aliyun.com/document_detail/197842.html
                    MediaId: mediaId,
                })
                    .then((res) => {
                        // 注意，这里仅作为示例，实际中建议做好错误处理，避免如 FileInfoList 为空数组时报错等异常情况
                        const fileInfoList = get(
                            res,
                            "data.MediaInfo.FileInfoList",
                            []
                        );
                        let mediaUrl, maskUrl;
                        let sourceFile = fileInfoList.find((item: any) => {
                            return (
                                item?.FileBasicInfo?.FileType === "source_file"
                            );
                        });
                        if (!sourceFile) {
                            sourceFile = fileInfoList[0];
                        }
                        const maskFile = fileInfoList.find((item: any) => {
                            return (
                                item.FileBasicInfo &&
                                item.FileBasicInfo.FileUrl &&
                                item.FileBasicInfo.FileUrl.indexOf("_mask") > 0
                            );
                        });
                        if (maskFile) {
                            maskUrl = get(maskFile, "FileBasicInfo.FileUrl");
                        }
                        mediaUrl = get(sourceFile, "FileBasicInfo.FileUrl");
                        const codec = get(
                            sourceFile,
                            "VideoStreamInfoList[0].CodecName"
                        );

                        return {
                            url: mediaUrl,
                            codec,
                            maskUrl,
                        };
                    })
                    .catch((ex) => {
                        // 外链地址兜底逻辑
                        if (mediaOrigin === "mediaURL") {
                            return mediaId;
                        }
                    });
            },
            exportTemplate: async ({ coverUrl, duration, timeline }: any) => {
                const res: any = await requestPost(
                    "GetEditingProjectMaterials",
                    {
                        ProjectId: projectId,
                    }
                );
                const MediaInfos = get(res, "data.MediaInfos");
                const addTemplateParams: Record<string, any> = {
                    Name: `模板:${projectId}:${Date.now()}`,
                    Source: "WebSDK",
                    Type: "Timeline",
                    Config: JSON.stringify(timeline),
                };
                if (coverUrl) {
                    addTemplateParams.CoverUrl = coverUrl;
                }
                if (MediaInfos) {
                    const materials: any[] = MediaInfos;
                    const videoIds = materials
                        .filter((m) => m.MediaBasicInfo.MediaType === "video")
                        .map((m) => m.MediaId);
                    const audioIds = materials
                        .filter((m) => m.MediaBasicInfo.MediaType === "audio")
                        .map((m) => m.MediaId);
                    const imageIds = materials
                        .filter((m) => m.MediaBasicInfo.MediaType === "image")
                        .map((m) => m.MediaId);
                    const maps = {
                        video: videoIds,
                        audio: audioIds,
                        image: imageIds,
                    };
                    addTemplateParams.RelatedMediaids = JSON.stringify(maps);
                }
                try {
                    const data = await requestPost(
                        "AddTemplate",
                        addTemplateParams
                    );
                    if (data.status === 200) {
                        message.success("导出成功");
                    } else {
                        message.error("导出失败");
                    }
                } catch (ex) {
                    message.error("导出失败");
                }
            },
            // 获取剪辑工程关联素材
            getEditingProjectMaterials: async () => {
                if (mode === "template") {
                    return templateFetcher.getTemplateMaterials();
                } else {
                    return requestPost("GetEditingProjectMaterials", {
                        // https://help.aliyun.com/document_detail/209068.html
                        ProjectId: projectId,
                    }).then((res) => {
                        const data = res.data.MediaInfos;
                        return transMediaList(data); // 需要做一些数据变换
                    });
                }
            },
            // 资源库导入素材
            searchMedia: async () => {
                const result: any[] = await onSearchMedia();
                if (mode === "template") {
                    await templateFetcher.addTemplateMaterials(result);
                } else {
                    const valueObj = {};
                    result.reduce((acc, curr) => {
                        if (!acc[curr.mediaType]) {
                            acc[curr.mediaType] = curr.mediaId;
                        } else {
                            acc[curr.mediaType] = `${acc[curr.mediaType]},${
                                curr.mediaId
                            }`;
                        }
                        return acc;
                    }, valueObj);

                    await requestPost("AddEditingProjectMaterials", {
                        // https://help.aliyun.com/document_detail/209069.html
                        ProjectId: projectId,
                        MaterialMaps: JSON.stringify(valueObj),
                    });
                }
                return result;
            },
            deleteEditingProjectMaterials: async (
                mediaId: string,
                mediaType: string
            ) => {
                if (mode === "template") {
                    return templateFetcher.deleteTemplateMaterials(
                        mediaId,
                        mediaType
                    );
                } else {
                    return requestPost("DeleteEditingProjectMaterials", {
                        // https://help.aliyun.com/document_detail/209067.html
                        ProjectId: projectId,
                        MaterialType: mediaType,
                        MaterialIds: mediaId,
                    });
                }
            },
            getStickerCategories: async () => {
                const res: any = await requestPost("ListAllPublicMediaTags", {
                    // https://help.aliyun.com/document_detail/207796.html
                    BusinessType: "sticker",
                    WebSdkVersion: window.AliyunVideoEditor.version,
                });

                const stickerCategories = res.data.MediaTagList.map(
                    (item: any) => ({
                        id: item.MediaTagId,
                        name:
                            locale === "zh-CN"
                                ? item.MediaTagNameChinese
                                : item.MediaTagNameEnglish, // myLocale 是您期望的语言
                    })
                );
                return stickerCategories;
            },
            getStickers: async ({ categoryId, page, size }: any) => {
                const params = {
                    PageNo: page,
                    PageSize: size,
                    IncludeFileBasicInfo: true,
                    MediaTagId: categoryId,
                };

                const res: any = await requestPost(
                    "ListPublicMediaBasicInfos",
                    params
                ); // https://help.aliyun.com/document_detail/207797.html

                const fileList = res.data.MediaInfos.map((item: any) => ({
                    mediaId: item.MediaId,
                    src: item.FileInfoList[0].FileBasicInfo.FileUrl,
                }));

                return {
                    total: res.data.TotalCount,
                    stickers: fileList,
                };
            },
            getEditingProject: async () => {
                if (mode === "template") {
                    return await templateFetcher.getTemplateProject();
                } else {
                    const res: any = await requestPost("GetEditingProject", {
                        // https://help.aliyun.com/document_detail/197837.html
                        ProjectId: projectId,
                        RequestSource: "WebSDK",
                    });

                    const timelineString = res.data.Project.Timeline;
                    const timeline = timelineString
                        ? JSON.parse(timelineString)
                        : undefined;

                    return {
                        projectId,
                        timeline: timeline,
                        title: res.data.Project.Title,
                        modifiedTime: res.data.Project.ModifiedTime,
                        timelineConvertStatus: res.data.TimelineConvertStatus,
                    };
                }
            },
            updateEditingProject: ({
                coverUrl,
                duration,
                timeline,
                isAuto,
            }: any) => {
                return requestPost("UpdateEditingProject", {
                    // https://help.aliyun.com/document_detail/197835.html
                    ProjectId: projectId,
                    CoverURL: coverUrl,
                    Duration: duration,
                    Timeline: JSON.stringify(timeline),
                }).then(() => {
                    // WebSDK 本身会进行自动保存，isAuto 则是告诉调用方这次保存是否自动保存，调用方可以控制只在手动保存时才展示保存成功的提示
                    !isAuto && message.success("保存成功");
                });
            },
            updateTemplate: async (params: any) => {
                await templateFetcher.updateTemplate(params);
            },
            produceEditingProjectVideo: onProduceEditingProjectVideo,
            // 各片段合成导出
            exportVideoClipsMerge: async (data: any) => {
                //  以下参数可复用导出视频的弹框对参数进行处理，生成合成任务请求参数
                const storageListReq = await requestGet("GetStorageList");
                // 示例这里采用临时文件路径，业务实现可以自己根据需要进行改动
                const tempFileStorageLocation =
                    storageListReq.data.StorageInfoList.find((item: any) => {
                        return item.EditingTempFileStorage;
                    });
                const { StorageLocation, Path } = tempFileStorageLocation;
                const filename = `${projectId}`;
                const outputUrl = `https://${StorageLocation}/${Path}${filename}_clips_merge.mp4`;
                const reqParam = {
                    ProjectId: "", //填空字符串，会自动创建新项目，不为空可能覆盖当前项目timeline
                    Timeline: JSON.stringify(data.timeline),
                    OutputMediaTarget: "oss-object",
                    OutputMediaConfig: JSON.stringify({
                        //设置业务文件名
                        MediaURL: `${outputUrl}`,
                        // 使用推荐分辨率码率
                        Bitrate: data.recommend.bitrate
                            ? parseInt(data.recommend.bitrate, 10)
                            : 1500,
                        Width: data.recommend.width,
                        Height: data.recommend.height,
                    }),
                };
                //业务方自定义请求提交合成的API
                const res: any = await requestPost(
                    "SubmitMediaProducingJob",
                    reqParam
                );
                const success = res.status === 200;
                if (success) {
                    message.success("导出成功");
                } else {
                    message.error("导出失败");
                }
            },
            // 各片段独立导出
            exportVideoClipsSplit: async (data: any) => {
                //  以下参数可复用导出视频的弹框对参数进行处理，生成合成任务请求参数
                const storageListReq = await requestGet("GetStorageList");
                // 示例这里采用临时文件路径，业务实现可以自己根据需要进行改动
                const tempFileStorageLocation =
                    storageListReq.data.StorageInfoList.find((item: any) => {
                        return item.EditingTempFileStorage;
                    });
                const { StorageLocation, Path } = tempFileStorageLocation;
                const filename = `${projectId}`;
                const outputUrl = `https://${StorageLocation}/${Path}${filename}_`;
                const reqParams = data.map((item: any, index: number) => {
                    return {
                        ProjectId: "", //填空字符串，会自动创建新项目，不为空可能覆盖当前项目timeline
                        Timeline: JSON.stringify(item.timeline),
                        OutputMediaTarget: "oss-object",
                        OutputMediaConfig: JSON.stringify({
                            //设置业务文件名，导出多个可根据序号设置
                            MediaURL: `${outputUrl}_${index}.mp4`,
                            // 使用推荐分辨率码率
                            Bitrate: item.recommend.bitrate
                                ? parseInt(item.recommend.bitrate, 10)
                                : 1500,
                            Width: item.recommend.width,
                            Height: item.recommend.height,
                        }),
                    };
                });
                let success = true;
                //提交多个合成任务
                await Promise.all(
                    reqParams.map(async (params: any) => {
                        //业务方自定义请求提交合成的API
                        const res: any = await requestPost(
                            "SubmitMediaProducingJob",
                            params
                        );
                        success = success && res.status === 200;
                    })
                );

                if (success) {
                    message.success("导出成功");
                } else {
                    message.error("导出失败");
                }
            },
            // 标记片段独立导出
            exportFromMediaMarks: async (data: any) => {
                //  以下参数可复用导出视频的弹框对参数进行处理，生成合成任务请求参数
                const storageListReq = await requestGet("GetStorageList");
                // 示例这里采用临时文件路径，业务实现可以自己根据需要进行改动
                const tempFileStorageLocation =
                    storageListReq.data.StorageInfoList.find((item: any) => {
                        return item.EditingTempFileStorage;
                    });
                const { StorageLocation, Path } = tempFileStorageLocation;
                const filename = `${projectId}`;
                const outputUrl = `https://${StorageLocation}/${Path}${filename}_`;
                const reqParams = data.map((item: any, index: number) => {
                    return {
                        ProjectId: "", //填空字符串，会自动创建新项目，不为空可能覆盖当前项目timeline
                        Timeline: JSON.stringify(item.timeline),
                        OutputMediaTarget: "oss-object",
                        OutputMediaConfig: JSON.stringify({
                            //设置业务文件名，导出多个可根据序号设置
                            MediaURL: `${outputUrl}_${index}.mp4`,
                            // 使用推荐分辨率码率
                            Bitrate: item.recommend.bitrate
                                ? parseInt(item.recommend.bitrate, 10)
                                : 1500,
                            Width: item.recommend.width,
                            Height: item.recommend.height,
                        }),
                    };
                });
                let success = true;
                //提交多个合成任务
                await Promise.all(
                    reqParams.map(async (params: any) => {
                        //业务方自定义请求提交合成的API
                        const res: any = await requestPost(
                            "SubmitMediaProducingJob",
                            params
                        );
                        success = success && res.status === 200;
                    })
                );
                if (success) {
                    message.success("导出成功");
                } else {
                    message.error("导出失败");
                }
            },
            subtitleConfig: {
                customTextures: {
                    list: async () => {
                        return [
                            {
                                key: "t0",
                                url: "https://ice-pub-media.myalicdn.com/public-bgImage/bgi-pic/10-CS0004-000008.png",
                            },
                        ];
                    },
                    onAddTexture: async () => {
                        /// 添加纹理
                        return {
                            key: "t1",
                            url: "https://ice-pub-media.myalicdn.com/public-bgImage/bgi-pic/5-CS0003-000006.png",
                        };
                    },
                    onDeleteTexture: async (key: any) => {
                        /// 删除纹理
                    },
                },
            },
            publicMaterials: {
                getLists: async () => {
                    const resultPromise = [
                        {
                            bType: "bgm",
                            mediaType: "audio",
                            name: "音乐",
                        },
                        {
                            bType: "bgi",
                            mediaType: "image",
                            styleType: "background",
                            name: "背景",
                        },
                    ].map(async (item: any) => {
                        const res: any = await requestPost(
                            "ListAllPublicMediaTags",
                            {
                                BusinessType: item.bType,
                            }
                        );
                        const tagList = get(res, "data.MediaTagList");
                        return tagList.map((tag: any) => {
                            const tagName =
                                locale === "zh-CN"
                                    ? tag.MediaTagNameChinese
                                    : tag.MediaTagNameEnglish;
                            return {
                                name: item.name,
                                key: item.bType,
                                mediaType: item.mediaType,
                                styleType: item.styleType,
                                tag: tagName,
                                getItems: async (
                                    pageNo: number,
                                    pageSize: number
                                ) => {
                                    const itemRes = await requestPost(
                                        "ListPublicMediaBasicInfos",
                                        {
                                            BusinessType: item.bType,
                                            MediaTagId: tag.MediaTagId,
                                            PageNo: pageNo,
                                            PageSize: pageSize,
                                            IncludeFileBasicInfo: true,
                                        }
                                    );
                                    const total = get(
                                        itemRes,
                                        "data.TotalCount"
                                    );
                                    const items = get(
                                        itemRes,
                                        "data.MediaInfos",
                                        []
                                    );
                                    const transItems = transMediaList(items);
                                    return {
                                        items: transItems,
                                        end: pageNo * pageSize >= total,
                                    };
                                },
                            };
                        });
                    });

                    const resultList = await Promise.all(resultPromise);
                    const result = resultList.flat();
                    return result;
                },
            },
            // 智能生成字幕
            asrConfig: {
                interval: 5000,
                submitASRJob: async (
                    mediaId: string,
                    startTime: number,
                    duration: number
                ) => {
                    const res: any = await requestPost("SubmitASRJob", {
                        InputFile: mediaId,
                        StartTime: startTime,
                        Duration: duration,
                    });
                    const jobId = get(res, "data.JobId");
                    return { jobId: jobId, jobDone: false };
                },
                getASRJobResult: async (jobId: string) => {
                    const res: any = await requestPost("GetSmartHandleJob", {
                        JobId: jobId,
                    });
                    const isDone = get(res, "data.State") === "Finished";
                    const isError = get(res, "data.State") === "Failed";
                    let result;
                    if (res.data && res.data?.Output) {
                        result = JSON.parse(res.data?.Output);
                    }
                    return {
                        jobId,
                        jobDone: isDone,
                        result,
                        jobError: isError ? "智能任务失败" : undefined,
                    };
                },
            },
            // 智能生成配音
            // submitAudioProduceJob: async (text, voice, voiceConfig = {}) => {
            //   const storageListReq = await requestGet("GetStorageList");
            //   const tempFileStorageLocation =
            //     storageListReq.data.StorageInfoList.find((item:any) => {
            //       return item.EditingTempFileStorage;
            //     });
            //   if (!tempFileStorageLocation) {
            //     throw new Error("未设置临时存储路径");
            //   }

            //   const { StorageLocation, Path } = tempFileStorageLocation;
            //   // 智能生成配音会生成一个音频文件存放到接入方的 OSS 上，这里 bucket, path 和 filename 是一种命名的示例，接入方可以自定义
            //   const bucket = StorageLocation.split(".")[0];
            //   const path = Path;
            //   const filename = `${text.slice(0, 10)}${Date.now()}`;
            //   const editingConfig = voiceConfig.custom
            //     ? {
            //         customizedVoice: voice,
            //         format: "mp3",
            //         ...voiceConfig,
            //       }
            //     : {
            //         voice,
            //         format: "mp3",
            //         ...voiceConfig,
            //       };
            //   // 1-提交智能配音任务
            //   const res1 = await request("SubmitAudioProduceJob", {
            //     // https://help.aliyun.com/document_detail/212273.html
            //     EditingConfig: JSON.stringify(editingConfig),
            //     InputConfig: text,
            //     OutputConfig: JSON.stringify({
            //       bucket,
            //       object: `${path}${filename}`,
            //     }),
            //   });

            //   if (res1.status !== 200) {
            //     throw new Error("暂未识别当前文字内容");
            //   }

            //   // 2-智能配音任务是否完成【轮询】
            //   const getJobStatus = () => {
            //     return requestGet("GetSmartHandleJob", {
            //       // https://help.aliyun.com/document_detail/203429.html
            //       JobId: res1.data.JobId,
            //     });
            //   };
            //   const shouldContinueGetJobStatus = (res) => {
            //     if (res.status !== 200 || res.data.State === "Finished") return false;
            //     return true;
            //   };
            //   const { result: res2 } = await poll(
            //     getJobStatus,
            //     shouldContinueGetJobStatus,
            //     2000,
            //     20000
            //   );

            //   // 3-智能配音任务完成则拉取生成的音频【轮询】
            //   if (res2.status === 200 && res2.data.State === "Finished") {
            //     const mediaId = res2.data.Output;

            //     const getProducedAudioInfo = () => {
            //       return request("GetMediaInfo", {
            //         MediaId: mediaId,
            //       });
            //     };
            //     const shouldContinueGetProducedAudioInfo = (res) => {
            //       if (res.status !== 200) return false;
            //       if (res.data?.MediaInfo?.MediaBasicInfo?.Status === "Normal")
            //         return false;
            //       return true;
            //     };
            //     const res3 = await poll(
            //       getProducedAudioInfo,
            //       shouldContinueGetProducedAudioInfo,
            //       5000,
            //       15000
            //     );

            //     if (res3.timeout) {
            //       throw new Error("智能配音任务超时，请重新发起");
            //     } else {
            //       const result = transMediaList([res3.result.data.MediaInfo]); // transMediaList 同前文中的定义
            //       const newAudio = result[0];
            //       // 4-将新的音频素材与工程进行绑定
            //       await request("AddEditingProjectMaterials", {
            //         ProjectId: projectId,
            //         MaterialMaps: JSON.stringify({
            //           audio: newAudio.mediaId,
            //         }),
            //       });
            //       return newAudio;
            //     }
            //   } else {
            //     throw new Error(res2.data.ErrorMsg || "抱歉，暂未识别当前文字内容");
            //   }
            // },
            // 智能生成配音
            ttsConfig: {
                interval: 3000,
                submitAudioProduceJob: async (
                    text: string,
                    voice: any,
                    voiceConfig = {}
                ) => {
                    const storageListReq = await requestGet("GetStorageList");
                    const tempFileStorageLocation =
                        storageListReq.data.StorageInfoList.find(
                            (item: any) => {
                                return item.EditingTempFileStorage;
                            }
                        );
                    if (!tempFileStorageLocation) {
                        throw new Error("未设置临时存储路径");
                    }

                    const { StorageLocation, Path } = tempFileStorageLocation;
                    // 智能生成配音会生成一个音频文件存放到接入方的 OSS 上，这里 bucket, path 和 filename 是一种命名的示例，接入方可以自定义
                    const bucket = StorageLocation.split(".")[0];
                    const path = Path;
                    const filename = `${text.slice(0, 10)}${Date.now()}`;
                    const editingConfig = voiceConfig.custom
                        ? {
                              customizedVoice: voice,
                              format: "mp3",
                              ...voiceConfig,
                          }
                        : {
                              voice,
                              format: "mp3",
                              ...voiceConfig,
                          };
                    // 1-提交智能配音任务
                    const res1 = await requestPost("SubmitAudioProduceJob", {
                        // https://help.aliyun.com/document_detail/212273.html
                        EditingConfig: JSON.stringify(editingConfig),
                        InputConfig: text,
                        OutputConfig: JSON.stringify({
                            bucket,
                            object: `${path}${filename}`,
                        }),
                    });

                    if (res1.status !== 200) {
                        return {
                            jobDone: false,
                            jobError: "暂未识别当前文字内容",
                        };
                    } else {
                        const jobId = get(res1, "data.JobId");
                        return { jobId: jobId, jobDone: false };
                    }
                },
                getAudioJobResult: async (jobId: string) => {
                    const res: any = await requestGet("GetSmartHandleJob", {
                        JobId: jobId,
                    });

                    const isJobDone = get(res, "data.State") === "Finished";
                    let isMediaReady = false;
                    let isError = get(res, "data.State") === "Failed";
                    let result;
                    let audioMedia;
                    let mediaId;
                    let asr = [];
                    if (res.data && res.data?.JobResult) {
                        try {
                            result = res.data.JobResult;
                            mediaId = result.MediaId;
                            if (result.AiResult) {
                                asr = JSON.parse(result.AiResult);
                            }
                        } catch (ex) {
                            console.error(ex);
                        }
                    }
                    if (!mediaId && res.data && res.data.Output) {
                        mediaId = res.data.Output;
                    }
                    const defaultErrorText = "抱歉，暂未识别当前文字内容";
                    if (mediaId) {
                        const mediaRes = await requestPost("GetMediaInfo", {
                            MediaId: mediaId,
                        });

                        if (mediaRes.status !== 200) {
                            isError = true;
                        }
                        const mediaStatus = get(
                            mediaRes,
                            "data.MediaInfo.MediaBasicInfo.Status"
                        );
                        if (mediaStatus === "Normal") {
                            isMediaReady = true;
                            const transAudios = transMediaList([
                                get(mediaRes, "data.MediaInfo"),
                            ]);
                            audioMedia = transAudios[0];
                            if (!audioMedia) {
                                isError = true;
                            }
                        } else if (
                            mediaStatus &&
                            mediaStatus.indexOf("Fail") >= 0
                        ) {
                            isError = true;
                        }
                    } else if (isJobDone) {
                        isError = true;
                    }

                    return {
                        jobId,
                        jobDone: isJobDone && isMediaReady,
                        result: audioMedia,
                        asr,
                        jobError: isError ? defaultErrorText : undefined,
                    };
                },
            },

            avatarConfig: {
                // 视频输出分辨率码率

                filterOutputConfig: (item: any, configs: any) => {
                    if (item.outputMask === false) {
                        return [
                            { width: 1920, height: 1080, bitrates: [4000] },
                            { width: 1080, height: 1920, bitrates: [4000] },
                        ];
                    }
                    return configs;
                },
                // 任务轮询时间（单位毫秒）
                refreshInterval: 2000,
                // 获取官方数字人列表
                getAvatarList: () => {
                    return [
                        {
                            id: "default",
                            default: true,
                            name: "官方数字人",
                            getItems: async (
                                pageNo: number,
                                pageSize: number
                            ) => {
                                const res: any = await requestGet(
                                    "ListSmartSysAvatarModels",
                                    {
                                        PageNo: pageNo,
                                        PageSize: pageSize,
                                        SdkVersion:
                                            window.AliyunVideoEditor.version,
                                    }
                                );
                                if (res && res.status === 200) {
                                    return {
                                        total: get(res, "data.TotalCount"),
                                        items: get(
                                            res,
                                            "data.SmartSysAvatarModelList",
                                            []
                                        ).map((item: any) => {
                                            return {
                                                avatarName: item.AvatarName,
                                                avatarId: item.AvatarId,
                                                coverUrl: item.CoverUrl,
                                                videoUrl: item.VideoUrl,
                                                outputMask: item.OutputMask,
                                            };
                                        }),
                                    };
                                }
                                return {
                                    total: 0,
                                    items: [],
                                };
                            },
                        },
                        {
                            id: "custom",
                            default: false,
                            name: "我的数字人",
                            getItems: async (
                                pageNo: number,
                                pageSize: number
                            ) => {
                                const res: any = await requestGet(
                                    "ListAvatars",
                                    {
                                        PageNo: pageNo,
                                        PageSize: pageSize,
                                        SdkVersion:
                                            window.AliyunVideoEditor.version,
                                    }
                                );
                                if (res && res.status === "200") {
                                    const avatarList = get(
                                        res,
                                        "data.Data.AvatarList",
                                        []
                                    );
                                    const coverMediaIds = avatarList.map(
                                        (aitem: any) => {
                                            return aitem.Portrait;
                                        }
                                    );

                                    const coverListRes = await requestGet(
                                        "BatchGetMediaInfos",
                                        {
                                            MediaIds: coverMediaIds.join(","),
                                            AdditionType: "FileInfo",
                                        }
                                    );
                                    const mediaInfos = get(
                                        coverListRes,
                                        "data.MediaInfos"
                                    );

                                    const idCoverMapper = mediaInfos.reduce(
                                        (result: any, m: any) => {
                                            result[m.MediaId] = get(
                                                m,
                                                "FileInfoList[0].FileBasicInfo.FileUrl"
                                            );
                                            return result;
                                        },
                                        {}
                                    );

                                    return {
                                        total: get(res, "data.TotalCount"),
                                        items: avatarList.map((item: any) => {
                                            return {
                                                avatarName:
                                                    item.AvatarName || "",
                                                avatarId: item.AvatarId,
                                                coverUrl:
                                                    idCoverMapper[
                                                        item.Portrait
                                                    ],
                                                videoUrl: undefined,
                                                outputMask: false,
                                                transparent: item.Transparent,
                                            };
                                        }),
                                    };
                                }
                                return {
                                    total: 0,
                                    items: [],
                                };
                            },
                        },
                    ];
                },
                // 提交数字人任务
                submitAvatarVideoJob: async (job: any) => {
                    const storageListReq = await requestGet("GetStorageList");
                    const tempFileStorageLocation =
                        storageListReq.data.StorageInfoList.find(
                            (item: any) => {
                                return item.EditingTempFileStorage;
                            }
                        );
                    if (tempFileStorageLocation) {
                        const { StorageLocation, Path } =
                            tempFileStorageLocation;
                        /**
                         * 判断数字人是否输出背景透明等格式
                         * outputMask：boolean,需要输出遮罩视频，此时输出的视频格式需要是mp4，会生成一个遮罩视频和纯色背景mp4视频
                         * transparent: boolean,是否透明视频，如果transparent为false，则表示该数字人是带背景的，不能生成透明背景的webm视频
                         * */
                        const { outputMask, transparent } = job.avatar;
                        const filename =
                            outputMask || transparent === false
                                ? `${encodeURIComponent(
                                      job.title
                                  )}-${Date.now()}.mp4`
                                : `${encodeURIComponent(
                                      job.title
                                  )}-${Date.now()}.webm`;

                        const outputUrl = `https://${StorageLocation}/${Path}${filename}`;
                        const params: Record<string, any> = {
                            UserData: JSON.stringify(job),
                        };
                        if (job.type === "text") {
                            params.InputConfig = JSON.stringify({
                                Text: job.data.text,
                            });
                            params.EditingConfig = JSON.stringify({
                                AvatarId: job.avatar.avatarId,
                                Voice: job.data.params.voice, // 发音人，仅输入为Text有效，必填
                                SpeechRate: job.data.params.speechRate, // 语速，仅输入为Text有效，取值范围：-500～500，默认值：0
                                PitchRate: job.data.params.pitchRate, // 音调，仅输入为Text有效，取值范围：-500～500，默认值：0
                                Volume: job.data.params.volume,
                            });
                            params.OutputConfig = JSON.stringify({
                                MediaURL: outputUrl,
                                Bitrate: job.data.output.bitrate,
                                Width: job.data.output.width,
                                Height: job.data.output.height,
                            });
                        } else {
                            params.InputConfig = JSON.stringify({
                                MediaId: job.data.mediaId,
                            });
                            params.EditingConfig = JSON.stringify({
                                AvatarId: job.avatar.avatarId,
                            });
                            params.OutputConfig = JSON.stringify({
                                MediaURL: outputUrl,
                                Bitrate: job.data.output.bitrate,
                                Width: job.data.output.width,
                                Height: job.data.output.height,
                            });
                        }
                        const res: any = await requestPost(
                            "SubmitAvatarVideoJob",
                            params
                        );
                        if (res.status === 200) {
                            return {
                                jobId: res.data.JobId,
                                mediaId: res.data.MediaId,
                            };
                        } else {
                            throw new Error("提交任务失败");
                        }
                    } else {
                        throw new Error("无法获取临时路径");
                    }
                },
                // 获取数字人任务状态，定时轮询调用
                getAvatarVideoJob: async (jobId: string) => {
                    try {
                        const res: any = await requestGet("GetSmartHandleJob", {
                            JobId: jobId,
                        });
                        if (res.status !== 200) {
                            throw new Error(
                                `response error:${
                                    res.data && res.data.ErrorMsg
                                }`
                            );
                        }

                        let job;
                        if (res.data.UserData) {
                            job = JSON.parse(res.data.UserData);
                        }
                        let video;
                        let done = false;
                        let subtitleClips;
                        // 解析生成的字幕
                        if (res.data.JobResult && res.data.JobResult.AiResult) {
                            const apiResult = JSON.parse(
                                res.data.JobResult.AiResult
                            );
                            if (
                                apiResult &&
                                apiResult.subtitleClips &&
                                typeof apiResult.subtitleClips === "string"
                            ) {
                                subtitleClips = JSON.parse(
                                    apiResult.subtitleClips
                                );
                            }
                        }
                        const mediaId = res.data.JobResult.MediaId;
                        if (res.data.State === "Finished") {
                            // 获取生成的媒资状态
                            const res2 = await requestPost("GetMediaInfo", {
                                MediaId: mediaId,
                            });
                            if (res2.status !== 200) {
                                throw new Error(
                                    `response error:${
                                        res2.data && res2.data.ErrorMsg
                                    }`
                                );
                            }
                            // 判断生成的视频及透明遮罩视频是否成功
                            const fileLength = get(
                                res2,
                                "data.MediaInfo.FileInfoList",
                                []
                            ).length;
                            const { avatar } = job;
                            const statusOk =
                                get(
                                    res2,
                                    "data.MediaInfo.MediaBasicInfo.Status"
                                ) === "Normal" &&
                                (avatar.outputMask
                                    ? fileLength >= 2
                                    : fileLength > 0);

                            const result = statusOk
                                ? transMediaList([get(res2, "data.MediaInfo")])
                                : [];
                            video = result[0];
                            done = !!video && statusOk;

                            if (done) {
                                // 将新的数字人素材与工程进行绑定
                                await requestPost(
                                    "AddEditingProjectMaterials",
                                    {
                                        ProjectId: projectId,
                                        MaterialMaps: JSON.stringify({
                                            video: mediaId,
                                        }),
                                    }
                                );
                            }
                        } else if (res.data.State === "Failed") {
                            return {
                                done: false,
                                jobId,
                                mediaId,
                                job,
                                errorMessage: `job status fail,status:${res.data.State}`,
                            };
                        }
                        // 返回任务状态，done后不再轮询
                        return {
                            done,
                            jobId: res.data.JobId,
                            mediaId,
                            job,
                            video,
                            subtitleClips,
                        };
                    } catch (ex: any) {
                        return {
                            done: false,
                            jobId,
                            errorMessage: ex.message,
                        };
                    }
                },
                getAvatar: async (id: string) => {
                    const listRes = await requestGet(
                        "ListSmartSysAvatarModels",
                        {
                            SdkVersion: window.AliyunVideoEditor.version,
                            PageNo: 1,
                            PageSize: 100,
                        }
                    );
                    const sysAvatar = get(
                        listRes,
                        "data.SmartSysAvatarModelList",
                        []
                    ).find((item: any) => {
                        return item.AvatarId === id;
                    });

                    if (sysAvatar) {
                        return {
                            ...objectKeyPascalCaseToCamelCase(sysAvatar),
                        };
                    }
                    const res: any = await requestGet("GetAvatar", {
                        AvatarId: id,
                    });
                    const item = get(res, "data.Data.Avatar");
                    const coverListRes = await requestPost(
                        "BatchGetMediaInfos",
                        {
                            MediaIds: item.Portrait,
                            AdditionType: "FileInfo",
                        }
                    );
                    const mediaInfos = get(coverListRes, "data.MediaInfos");

                    const idCoverMapper = mediaInfos.reduce(
                        (result: any, m: any) => {
                            result[m.MediaId] = get(
                                m,
                                "FileInfoList[0].FileBasicInfo.FileUrl"
                            );
                            return result;
                        },
                        {}
                    );
                    return {
                        avatarName: item.AvatarName || "test",
                        avatarId: item.AvatarId,
                        coverUrl: idCoverMapper[item.Portrait],
                        videoUrl: undefined,
                        outputMask: false,
                        transparent: item.Transparent,
                    };
                },
            },

            videoTranslation: {
                translation: {
                    submitVideoTranslationJob: async (params: any) => {
                        const tempFileStorageLocation =
                            await getTempFileLocation();

                        if (!tempFileStorageLocation) {
                            return {
                                jobDone: false,
                                jobError: "请设置临时存储地址",
                            };
                        }
                        const item = tempFileStorageLocation;
                        const path = item.Path;
                        if (params.editingConfig.SourceLanguage !== "zh") {
                            return {
                                jobDone: false,
                                jobError: "当前仅支持对中文的翻译",
                            };
                        }
                        if (params.type === "Video") {
                            const storageType = item.StorageType;

                            let outputConfig: Record<string, any> = {
                                MediaURL: `https://${item.StorageLocation}/${path}videoTranslation-${params.mediaId}.mp4`,
                            };

                            if (storageType === "vod_oss_bucket") {
                                outputConfig = {
                                    OutputTarget: "vod",
                                    StorageLocation: get(
                                        item,
                                        "StorageLocation"
                                    ),
                                    FileName: `videoTranslation-${params.mediaId}.mp4`,
                                    TemplateGroupId: "VOD_NO_TRANSCODE",
                                };
                            }

                            const res: any = await requestPost(
                                "SubmitVideoTranslationJob",
                                {
                                    InputConfig: JSON.stringify({
                                        Type: params.type,
                                        Media: params.mediaId,
                                    }),
                                    OutputConfig: JSON.stringify(outputConfig),
                                    EditingConfig: JSON.stringify(
                                        params.editingConfig
                                    ),
                                }
                            );

                            return {
                                jobDone: false,
                                jobId: res.data.Data.JobId,
                            };
                        }
                        if (params.type === "Text") {
                            const res: any = await requestPost(
                                "SubmitVideoTranslationJob",
                                {
                                    InputConfig: JSON.stringify({
                                        Type: params.type,
                                        Text: params.text,
                                    }),
                                    EditingConfig: JSON.stringify(
                                        params.editingConfig
                                    ),
                                }
                            );
                            return {
                                jobDone: false,
                                jobId: res.data.Data.JobId,
                            };
                        }
                        if (params.type === "TextArray") {
                            const res: any = await requestPost(
                                "SubmitVideoTranslationJob",
                                {
                                    InputConfig: JSON.stringify({
                                        Type: params.type,
                                        TextArray: JSON.stringify(
                                            params.textArray
                                        ),
                                    }),
                                    EditingConfig: JSON.stringify(
                                        params.editingConfig
                                    ),
                                }
                            );
                            return {
                                jobDone: false,
                                jobId: res.data.Data.JobId,
                            };
                        }
                        return {
                            jobDone: false,
                            jobError: "not match type",
                        };
                    },
                    getVideoTranslationJob: async (jobId: string) => {
                        const resp = await requestPost("GetSmartHandleJob", {
                            JobId: jobId,
                        });

                        const res: any = resp.data;

                        if (
                            res.State === "Executing" ||
                            res.State === "Created"
                        ) {
                            return {
                                jobDone: false,
                                jobId,
                            };
                        }

                        if (res.State === "Failed") {
                            return {
                                jobDone: true,
                                jobId,
                                jobError: "任务执行失败",
                            };
                        }

                        let isJobDone = true;
                        let text;
                        let textArray;
                        let timeline;
                        let jobError;

                        if (res.JobResult.AiResult) {
                            const aiResult = JSON.parse(res.JobResult.AiResult);
                            const projectId1 = aiResult.EditingProjectId;
                            if (projectId1) {
                                const projectRes = await requestPost(
                                    "GetEditingProject",
                                    {
                                        ProjectId: projectId1,
                                        RequestSource: "WebSDK",
                                    }
                                );
                                const timelineConvertStatus = get(
                                    projectRes,
                                    "data.Project.TimelineConvertStatus"
                                );
                                if (timelineConvertStatus === "ConvertFailed") {
                                    jobError = "任务执行失败";
                                } else if (
                                    timelineConvertStatus === "Converted"
                                ) {
                                    isJobDone = true;
                                } else {
                                    isJobDone = false;
                                }
                                timeline = projectRes.data.Project.Timeline;
                            }
                            text = JSON.parse(
                                res.JobResult.AiResult
                            ).TranslatedText;
                            textArray = JSON.parse(
                                res.JobResult.AiResult
                            ).TranslatedTextArray;
                        }

                        return {
                            jobDone: isJobDone,
                            jobError,
                            jobId,
                            result: {
                                text,
                                textArray,
                                timeline,
                            },
                        };
                    },
                },
                detext: {
                    submitDetextJob: async ({
                        mediaId,
                        mediaIdType,
                        box,
                    }: any) => {
                        const tempFileStorageLocation =
                            await getTempFileLocation();

                        if (!tempFileStorageLocation) {
                            return {
                                jobDone: false,
                                jobError: "请设置临时存储地址",
                            };
                        }
                        const item = tempFileStorageLocation;
                        const path = item.Path;
                        const res: any = await requestPost(
                            "SubmitIProductionJob",
                            {
                                FunctionName: "VideoDetext",
                                Input: JSON.stringify({
                                    Type:
                                        mediaIdType === "mediaURL"
                                            ? "OSS"
                                            : "Media",
                                    Media: mediaId,
                                }),
                                Output: JSON.stringify({
                                    Type: "OSS",
                                    Media: `https://${item.StorageLocation}/${path}VideoDetext-${mediaId}.mp4`,
                                }),
                                JobParams:
                                    box && box !== "auto"
                                        ? JSON.stringify({
                                              Boxes: JSON.stringify(box),
                                          })
                                        : undefined,
                            }
                        );
                        return {
                            jobDone: false,
                            jobId: res.data.JobId,
                        };
                    },
                    getDetextJob: async (jobId: string) => {
                        const resp: any = await requestPost(
                            "QueryIProductionJob",
                            { JobId: jobId }
                        );
                        const res: any = resp.data;
                        if (
                            res.Status === "Queuing" ||
                            res.Status === "Analysing"
                        ) {
                            return {
                                jobDone: false,
                                jobId,
                            };
                        }

                        if (res.Status === "Fail") {
                            return {
                                jobDone: true,
                                jobId,
                                jobError: "任务执行失败", // intl.get('job_error').d('任务执行失败'),
                            };
                        }
                        const mediaUrl = resp.data.Output.Media;
                        const mediaInfoRes: any = await requestPost(
                            "GetMediaInfo",
                            { InputURL: mediaUrl }
                        );
                        if (mediaInfoRes.code !== "200") {
                            await requestPost("RegisterMediaInfo", {
                                InputURL: mediaUrl,
                            });
                            return {
                                jobDone: false,
                                jobId,
                            };
                        }

                        const mediaStatus = get(
                            mediaInfoRes,
                            "data.MediaInfo.MediaBasicInfo.Status"
                        );
                        let isError = false;
                        let isMediaReady = false;
                        let inputVideo;
                        if (mediaStatus === "Normal") {
                            const transVideo = transMediaList([
                                get(mediaInfoRes, "data.MediaInfo"),
                            ]);
                            inputVideo = transVideo[0];
                            isMediaReady = true;
                            if (!inputVideo) {
                                isError = true;
                            }
                        } else if (
                            mediaStatus &&
                            mediaStatus.indexOf("Fail") >= 0
                        ) {
                            isError = true;
                        }

                        return {
                            jobDone: isMediaReady,
                            jobError: isError ? "任务执行失败" : undefined,
                            jobId: res.JobId,
                            result: {
                                video: inputVideo,
                            },
                        };
                    },
                },
                captionExtraction: {
                    submitCaptionExtractionJob: async ({
                        mediaId,
                        mediaIdType,
                        box,
                    }: any) => {
                        const tempFileStorageLocation =
                            await getTempFileLocation();
                        if (!tempFileStorageLocation) {
                            return {
                                jobDone: false,
                                jobError: "请选择临时存储地址",
                            };
                        }
                        const item = tempFileStorageLocation;
                        const path = item.Path;
                        let roi;
                        if (
                            Array.isArray(box) &&
                            box.length > 0 &&
                            box[0] &&
                            box[0].length === 4
                        ) {
                            const [x, y, width, height] = box[0];
                            roi = [
                                [y, y + height],
                                [x, x + width],
                            ];
                        }
                        const res: any = await requestPost(
                            "SubmitIProductionJob",
                            {
                                FunctionName: "CaptionExtraction",
                                Input: JSON.stringify({
                                    Type:
                                        mediaIdType === "mediaURL"
                                            ? "OSS"
                                            : "Media",
                                    Media: mediaId,
                                }),
                                Output: JSON.stringify({
                                    Type: "OSS",
                                    Media: `https://${item.StorageLocation}/${path}CaptionExtraction-${mediaId}.srt`,
                                }),
                                JobParams:
                                    box && box !== "auto"
                                        ? JSON.stringify({
                                              roi: roi,
                                          })
                                        : undefined,
                            }
                        );

                        return {
                            jobDone: false,
                            jobId: res.data.JobId,
                        };
                    },
                    getCaptionExtractionJob: async (jobId: string) => {
                        const resp = await requestPost("QueryIProductionJob", {
                            JobId: jobId,
                        });
                        const res: any = resp.data;
                        if (
                            res.Status === "Queuing" ||
                            res.Status === "Analysing"
                        ) {
                            return {
                                jobDone: false,
                                jobId,
                            };
                        }

                        if (res.Status === "Fail") {
                            return {
                                jobDone: true,
                                jobId,
                                jobError: "任务执行失败",
                            };
                        }
                        const mediaUrl = resp.data.OutputUrls[0];
                        const srtRes = await fetch(
                            mediaUrl.replace("http:", "")
                        );
                        const srtText = await srtRes.text();

                        return {
                            jobDone: true,
                            jobId: res.JobId,
                            result: {
                                srtContent: srtText,
                            },
                        };
                    },
                },
            },
        };
    };

    const init = async () => {
        // const customVoiceGroups = await createCustomVoiceGroups();
        const config = initConfig([]);
        window.AliyunVideoEditor.init(config);
    };

    // 打印所有事件
    // window.AliyunVideoEditor.getEvents().subscribe((ev)=>{
    //    console.log('ev>>>',ev)
    // });
    return {
        init,
        initConfig,
        destroy() {
            window.AliyunVideoEditor.destroy();
        },
    };
}
