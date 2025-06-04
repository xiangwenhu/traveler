import { COMMON_IMAGE_SUFFIX, COMMON_VIDEO_SUFFIX, COMMON_AUDIO_SUFFIX } from "@/const/index";
import { EnumResourceType } from "@/types/service";


export function isMediaType(baseTypes: string[]) {
    return function (filename: string, extraTypes: string[] = []) {
        const extList = baseTypes.concat(extraTypes);
        const ext = filename.slice(filename.lastIndexOf('.')).toLowerCase();
        return extList.includes(ext);
    }
}

export const isImage = isMediaType(COMMON_IMAGE_SUFFIX);
export const isAudio = isMediaType(COMMON_AUDIO_SUFFIX);
export const isVideo = isMediaType(COMMON_VIDEO_SUFFIX);
export const isVideoOrAudio = function (filename: string, extraTypes: string[] = []) {
    return isAudio(filename, extraTypes) || isVideo(filename, extraTypes);
}


export function getMediaType(url: string) {
    if (isImage(url)) return  EnumResourceType.Image;
    if (isVideo(url)) return  EnumResourceType.Video;
    if (isAudio(url)) return  EnumResourceType.Audio;
    return EnumResourceType.Unknown;
}


interface RectSize {
    width: number;
    height: number
}

export function getImageSizeByUrl(url: string): Promise<RectSize> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = url; // 替换为实际的图片路径
        img.onload = function () {
            const width = img.naturalWidth;
            const height = img.naturalHeight;
            resolve({
                width,
                height
            })
        };
        img.onerror = reject
    })
}



export async function calcImageWithFromUrl(url: string, { width: tWith, height: tHeight }: Partial<RectSize>) {

    try {
        const { height, width } = await getImageSizeByUrl(url);

        // 未定义目标尺寸宽高, 返回图片本身尺寸
        if (tWith == undefined && tHeight == undefined) return { height, width }

        // 定了目标尺寸的宽高，返回目标尺寸
        if (tWith != undefined && tHeight != undefined) return { height: tHeight, width: tWith };


        // 定义了目标高
        if (tWith != undefined) {
            const ttHeight = Math.ceil(tWith * height / width);
            return {
                width: tWith,
                height: ttHeight
            }
        }
        if (tHeight != undefined) {
            const ttWidth = Math.ceil(width * tHeight / height);
            return {
                width: ttWidth,
                height: tHeight
            }
        }

        return {
            height,
            width
        }
    } catch (err: any) {
        console.error(`calcImageWithFromUrl error: ${err && err.message}`);
        return { width: 100, height: 100 }
    }

}

export function getFilenameWithoutExtension(url: string): string {
    // 创建一个URL对象，以解析传入的url字符串
    const urlObj = new URL(url);
    // 获取路径部分
    const path = urlObj.pathname;
    // 分割路径获取最后一个元素（即可能是文件名的部分）
    const parts = path.split('/');
    const filenameWithExtension = parts[parts.length - 1];
    // 查找最后一个点的位置，用于区分文件名和扩展名
    const lastDotIndex = filenameWithExtension.lastIndexOf('.');
    // 如果存在点，则认为有点之后的部分是扩展名
    if (lastDotIndex !== -1) {
        return filenameWithExtension.substring(0, lastDotIndex);
    } else {
        // 没有找到点，返回原始文件名（没有扩展名）
        return filenameWithExtension;
    }
}