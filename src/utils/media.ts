import { COMMON_IMAGE_SUFFIX, COMMON_VIDEO_SUFFIX, COMMON_AUDIO_SUFFIX } from "@/const/index";


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
}