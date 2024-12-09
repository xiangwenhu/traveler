export interface VideoTrackOptions {
    imageDuration: number;
    mainTrack?: boolean;
    useTransition?: boolean;
    transitionList?: Timeline.SubTypeTransition[];
    transitionDuration?: number;
}

export interface VideoMediaInfo {
    url: string;
    mediaId?: string;
    data?: {
        duration?: number;
        height?: number;
        width?: number;
    }
}


export type AudioTrackOptions = Pick<Timeline.AudioTrackClip, "LoopMode">


export namespace Timeline {


    interface BaseTackData {
        Id?: string | number;
    }

    export interface Timeline {
        /**
         * 视频轨列表。多个轨道的层叠顺序与数组元素顺序一致，
         * 如：数组的第一个元素图层的t在最底层，第二个元素的图层在其之上，以此类推。
         */
        VideoTracks?: VideoTrack[];
        /**
         * 音频轨列表。
         */
        AudioTracks?: AudioTrack[];
        /**
         * 字幕轨列表。
         */
        SubtitleTracks?: SubtitleTrack[];
        /**
         * 特效轨列表。
         */
        EffectTracks?: EffectTrack[];
    }

    export interface VideoTrack extends BaseTackData {
        /**
         * 默认为普通视频轨。当Type=Effect时，当前轨道可当作特效轨使用，VideoTrackClips可填入
         */
        Type?: "Effect" | "Video",
        /**
         * 用于指定当前轨道是否为主轨道。默认为 False。
         * 详细介绍及示例请参见 https://help.aliyun.com/zh/ims/use-cases/control-the-clip-duration
         */
        MainTrack?: boolean;
        /**
         * 若当前视频轨道时长比主轨道时长长时，自适应缩短当前轨道，从而实现和主轨道对齐效果，
         * 支持设置：AutoSpeed：对视频自动做加速处理。
         */
        TrackShortenMode?: "AutoSpeed";
        /**
         * 若当前视频轨道时长比主轨道时长短时，自适应扩展当前轨道，从而实现和主轨道对齐效果，
         * 支持设置：AutoSpeed：对视频自动做减速处理
         */
        TrackExpandMode?: "AutoSpeed";
        /**
         * 视频轨素材片段列表。
         */
        VideoTrackClips: VideoTrackClip[]
    }


    export interface VideoTrackClip extends BaseTackData {
        /**
         * 视频轨素材片段对应的IMS内容库媒资ID，或VOD媒资ID。
         * 注：MediaId和MediaURL有且仅有一个不为空。
         */
        MediaId?: string;
        /**
         * 视频轨素材片段对应的OSS地址  
         * 1. MediaId和MediaURL有且仅有一个不为空。
         * 2. MediaURL 支持传入「OSS 外网 Endpoint 地址」或者「其它公网可以访问的地址」
         */
        MediaURL?: string;
        /**
         * 素材片段类型，默认Video。取值：
         * Video（视频）
         * Image（图片）
         * GlobalImage（全局图片，默认按照最长视频轨时间计算该图片时长。视频轨道中使用全局图片GlobalImage）
         */
        Type?: "Video" | "Image" | "GlobalImage";
        /**
         * 表示图片或视频左上角距离输出视频左上角的横向距离。
         * 注：支持百分比和像素两种形式。当取值为[0～0.9999]时，表示相对输出视频宽的占比。当取值为>=2的整数时，表示绝对像素。
         */
        X?: number;
        /**
         * 表示图片或视频左上角距离输出视频左上角的纵向距离。
         * 注：支持百分比和像素两种形式。当取值为[0～0.9999]时，表示相对输出视频高的占比。当取值为>=2的整数时，表示绝对像素。
         */
        Y?: number;

        /**
         * 表示图片在输出视频中的宽度。
         * 注：支持百分比和像素两种形式。当取值为[0～0.9999]时，表示相对输出视频宽的占比。当取值为>=2的整数时，表示绝对像素。
         */
        Width?: number;
        /**
         * 表示图片在输出视频中的高度。
         * 注：支持百分比和像素两种形式。当取值为[0～0.9999]时，表示相对输出视频宽的占比。当取值为>=2的整数时，表示绝对像素。
         */
        Height?: number;

        /**
         * 视频尺寸自适应模式类型，默认为Fill，必须同时设置视频轨道Width和Height，该模式才会生效，此时Width和Height为目标区域宽高，视频会在目标区域内自适应缩放。
         * Contain：被替换的内容将被缩放，在填充目标区域的同时保留其长宽比。
         * Cover：被替换的内容在保持其宽高比的同时填充整个目标区域。如果对象的宽高比与内容框不相匹配，该对象将被剪裁以适应目标区域。
         * Fill：默认逻辑，被替换的内容正好填充目标内容框。整个对象将完全填充此框。如果对象的宽高比与内容框不相匹配，那么该对象将被拉伸以适应目标区域
         */
        AdaptMode?: 'Contain' | 'Cover' | 'Fill';
        /**
         * 素材片段相对于素材的入点，在素材类型是音视频时使用。
         * 单位：秒，精确到小数点后4位。如果In不填，默认为0。
         */
        In?: number;
        /**
         * 素材片段相对于素材的出点，在素材类型是音视频时使用。
         * 单位：秒，精确到小数点后4位。如果Out不填，默认为素材时长。
         */
        Out?: number;
        /**
         * 素材片段相对于素材的最大出点值。如果设置该值，素材片段相对于素材的出点将会设置为素材时长与该值中的较小者。在素材为音视频时使用。
         * 单位：秒，精确到小数点后4位。如果填入Out值，MaxOut值将失效。示例：https://help.aliyun.com/zh/ims/use-cases/video-picture-mix-cut
         */
        MaxOut?: number;

        /**
         * 素材片段的时长，一般在素材类型是图片时使用。单位：秒，精确到小数点后4位。
         */
        Duration?: number;

        /**
         * 动图的帧数，在素材类型是图片且为动图时使用。示例： https://help.aliyun.com/zh/ims/use-cases/video-picture-mix-cut
         */
        DyncFrames?: number;
        /**
         * 素材片段相对于时间线的入点。单位：秒，精确到小数点后4位。
         * 如果TimelineIn不填，则会按照素材片段顺序相接的方式自动计算TimelineIn。
         */
        TimelineIn?: number;

        /**
         * 素材片段相对于时间线的出点。单位：秒，精确到小数点后4位。
         * 如果TimelineOut不填，则会按照素材片段顺序相接的方式自动计算TimelineOut。
         */
        TimelineOut?: number;
        /**
         * 视频素材速率，取值范围0.1~100，如：Speed=2，则将视频做2倍速处理，Clip的Duration减半，并合成到成片中。
         * 参考示例: https://help.aliyun.com/document_detail/198744.html
         */
        Speed?: number;
        /**
         * 视频不透明度，取值范围0~1，如：Opacity=0，表示完全透明；Opacity=1，表示完全不透明。
         */
        Opacity?: number;

        /**
         * 遮罩视频地址。一般为带 Alpha 通道的视频，用于为原视频添加透明通道效果。
         * 支持传入「OSS 外网 Endpoint 地址」或者「其它公网可以访问的地址」
         */
        MaskVideoUrl?: string;
        /**
         * 轨道对齐参数。其他音视频轨道的素材如果设置了相同的ReferenceClipId，则其时间线入出点与当前clip对齐。
         * 参考文档:https://help.aliyun.com/zh/ims/use-cases/inter-track-material-alignment
         */
        ClipId?: string;
        /**
         * 轨道对齐参数。其他音视频轨道的素材如果设置了相同的ClipId，则当前clip的时间线入出点与其他轨道的素材对齐。
         * 参考文档:https://help.aliyun.com/zh/ims/use-cases/inter-track-material-alignment
         */
        ReferenceClipId?: string;
        /**
         * 素材片段的效果列表。
         */
        Effects?: Effect[];


        VirginDuration?: number
    }


    export enum EffectType {
        /**
         * 横幅文字：视频轨素材
         */
        Text = 'Text',
        /**
         * 模糊：视频轨素材
         */
        DeWatermark = 'DeWatermark',

        /**
         * 裁剪：视频轨素材
         */
        Crop = 'Crop',

        /**
         * 贴边：视频轨素材
         */
        Pad = 'Pad',

        /**
        * 缩放：视频轨素材
        */
        Scale = 'Scale',

        /**
         * 转场：视频轨素材
         */
        Transition = 'Transition',

        /**
        * 特效：视频轨素材
        */
        VFX = 'VFX',

        /**
        * 音量调整：视频轨素材
        */
        Volume = 'Volume',

        /**
        * 音频淡入淡出：音频轨
        */
        AFade = 'AFade',

        /**
        * 识别音频生成字幕：视频轨、音频轨素材
        */
        AI_ASR = 'AI_ASR',
    }


    export enum SubTypeTransition {
        /**
       * 对角切换
       */
        directional = 'directional',
        /**
        * 旋涡
        */
        displacement = 'displacement',
        /**
        * 栅格
        */
        windowslice = 'windowslice',
        /**
        * 垂直领结
        */
        bowTieVertical = 'bowTieVertical',
        /**
        * 水平领结
        */
        bowTieHorizontal = 'bowTieHorizontal',
        /**
        * 放大消失
        */
        simplezoom = 'simplezoom',
        /**
        * 线性模糊
        */
        linearblur = 'linearblur',
        /**
        * 水滴
        */
        waterdrop = 'waterdrop',
        /**
        * 故障
        */
        glitchmemories = 'glitchmemories',
        /**
        * 波点
        */
        polka = 'polka',
        /**
        * 蔓延
        */
        perlin = 'perlin',
        /**
        * 扭曲旋转
        */
        directionalwarp = 'directionalwarp',
        /**
        * 向上弹动
        */
        bounce_up = 'bounce_up',
        /**
        * 向下弹动
        */
        bounce_down = 'bounce_down',
        /**
        * 向右擦除
        */
        wiperight = 'wiperight',
        /**
        * 向左擦除
        */
        wipeleft = 'wipeleft',
        /**
        * 向下擦除
        */
        wipedown = 'wipedown',
        /**
        * 向上擦除
        */
        wipeup = 'wipeup',
        /**
        * 雪花消除
        */
        morph = 'morph',
        /**
        * 色彩溶解
        */
        colordistance = 'colordistance',
        /**
        * 圆形遮罩
        */
        circlecrop = 'circlecrop',
        /**
        * 中心旋转
        */
        swirl = 'swirl',
        /**
        * 轻微摇摆
        */
        dreamy = 'dreamy',
        /**
        * 多格翻转
        */
        gridflip = 'gridflip',
        /**
        * 圆形放大
        */
        zoomincircles = 'zoomincircles',
        /**
        * 圆形扫描
        */
        radial = 'radial',
        /**
        * 相册
        */
        mosaic = 'mosaic',
        /**
        * 波形放大
        */
        undulatingburnout = 'undulatingburnout',
        /**
        * 线性溶解
        */
        crosshatch = 'crosshatch',
        /**
        * 太空波纹
        */
        crazyparametricfun = 'crazyparametricfun',
        /**
        * 万花筒
        */
        kaleidoscope = 'kaleidoscope',
        /**
        * 百叶窗
        */
        windowblinds = 'windowblinds',
        /**
        * 蜂巢溶解
        */
        hexagonalize = 'hexagonalize',
        /**
        * 故障交替
        */
        glitchdisplace = 'glitchdisplace',
        /**
        * 炫境
        */
        dreamyzoom = 'dreamyzoom',
        /**
        * 齿状上升
        */
        doomscreentransition_up = 'doomscreentransition_up',
        /**
        * 齿状下落
        */
        doomscreentransition_down = 'doomscreentransition_down',
        /**
        * 波纹
        */
        ripple = 'ripple',
        /**
        * 风车
        */
        pinwheel = 'pinwheel',
        /**
        * 时钟旋转
        */
        angular = 'angular',
        /**
        * 燃烧
        */
        burn = 'burn',
        /**
        * 椭圆遮罩
        */
        circle = 'circle',
        /**
        * 椭圆溶解
        */
        circleopen = 'circleopen',
        /**
        * 色相溶解
        */
        colorphase = 'colorphase',
        /**
        * 隧道扭曲
        */
        crosswarp = 'crosswarp',
        /**
        * 立方体
        */
        cube = 'cube',
        /**
        * 渐变擦除
        */
        directionalwipe = 'directionalwipe',
        /**
        * 开幕
        */
        doorway = 'doorway',
        /**
        * 渐隐
        */
        fade = 'fade',
        /**
        * 彩色渐隐
        */
        fadecolor = 'fadecolor',
        /**
        * 灰色渐隐
        */
        fadegrayscale = 'fadegrayscale',
        /**
        * 回忆
        */
        flyeye = 'flyeye',
        /**
        * 爱心遮罩
        */
        heart = 'heart',
        /**
        * 对角开幕
        */
        luma = 'luma',
        /**
        * 多层混合
        */
        multiplyblend = 'multiplyblend',
        /**
        * 像素溶解
        */
        pixelize = 'pixelize',
        /**
        * 花瓣遮罩
        */
        polarfunction = 'polarfunction',
        /**
        * 随机方块
        */
        randomsquares = 'randomsquares',
        /**
        * 旋转
        */
        rotatescalefade = 'rotatescalefade',
        /**
        * 方块替换
        */
        squareswire = 'squareswire',
        /**
        * 向内推入
        */
        squeeze = 'squeeze',
        /**
        * 切入
        */
        swap = 'swap',
        /**
        * 线形擦除
        */
        wind = 'wind'
    }

    export interface Effect {
        Type: EffectType;
        SubType: SubTypeTransition | string;
        From?: string | number;
    }

    export interface EffectTransition extends Effect {
        Duration: number;
    }

    export interface AudioTrack {
        /**
         * 用于指定当前轨道是否为主轨道。默认为 False
         */
        MainTrack?: boolean;
        /**
         * 若当前音频轨道时长比主轨道时长长时，自适应缩短当前轨道，从而实现和主轨道对齐效果
         * 支持设置：AutoSpeed：对视频自动做加速处理。
         */
        TrackShortenMode?: "AutoSpeed";
        /**
         * 	若当前音频轨道时长比主轨道时长短时，自适应扩展当前轨道，从而实现和主轨道对齐效果
         * 支持设置：AutoSpeed：对视频自动做减速处理
         */
        TrackExpandMode?: "AutoSpeed";
        /**
         * 视频轨素材片段列表。
         */
        AudioTrackClips: AudioTrackClip[]
    }


    export interface AudioTrackClip {
        /**
         * 视频轨素材片段对应的IMS内容库媒资ID，或VOD媒资ID。
         * 注：MediaId和MediaURL有且仅有一个不为空。
         */
        MediaId?: string;
        /**
         * 视频轨素材片段对应的OSS地址  
         * 1. MediaId和MediaURL有且仅有一个不为空。
         * 2. MediaURL 支持传入「OSS 外网 Endpoint 地址」或者「其它公网可以访问的地址」
         */
        MediaURL?: string;
        /**
         * 素材片段相对于素材的入点。单位：秒，精确到小数点后4位。如果In不填，默认为0。
         */
        In?: number;
        /**
         * 素材片段相对于素材的出点。单位：秒，精确到小数点后4位。如果Out不填，默认为素材时长。
         */
        Out?: number;
        /**
         * 素材片段相对于时间线的入点。单位：秒，精确到小数点后4位。
         * 如果TimelineIn不填，则会按照素材片段顺序相接的方式自动计算TimelineIn。
         */
        TimelineIn?: number;

        /**
         * 素材片段相对于时间线的出点。单位：秒，精确到小数点后4位。
         * 如果TimelineOut不填，则会按照素材片段顺序相接的方式自动计算TimelineOut。
         */
        TimelineOut?: number;
        /**
         * 音频素材速率，取值范围0.1~100，如：Speed=2，则将音频做2倍速处理，Clip的Duration减半，并合成到成片中。
         * 参考示例: https://help.aliyun.com/document_detail/198744.html
         */
        Speed?: number;
        /**
         * 轨道对齐参数。其他音视频轨道的素材如果设置了相同的ReferenceClipId，则其时间线入出点与当前clip对齐。
         * 参考文档:https://help.aliyun.com/zh/ims/use-cases/inter-track-material-alignment
         */
        ClipId?: string;
        /**
         * 轨道对齐参数。其他音视频轨道的素材如果设置了相同的ClipId，则当前clip的时间线入出点与其他轨道的素材对齐
         * 参考文档:https://help.aliyun.com/zh/ims/use-cases/inter-track-material-alignment
         */
        ReferenceClipId?: string;
        /**
         * 素材片段的效果列表。
         */
        Effects?: Effect[];
        /**
         * 素材片段在时间线中循环播放效果。
         * True：循环播放；False（默认值）：正常不循环
         */
        LoopMode?: boolean;
    }


    export interface SubtitleTrack {

    }

    export interface EffectTrack {
        EffectTrackItems: EffectTrackItem[]
    }

    export interface EffectTrackItem {
        /**
         * 特效轨片段类型，支持：VFX、Filter
         */
        Type: "VFX" | "Filter";
        /**
         * 特效轨片段子类型，详细见：
         * 特效效果示例:https://help.aliyun.com/zh/ims/developer-reference/example-of-special-effects/
         * 滤镜效果示例:https://help.aliyun.com/zh/ims/developer-reference/filter-effect-example
         */
        SubType: string;

        /**
         * 特效片段出现在时间线的持续时长。单位：秒，精确到小数点后4位。如果Duration不填，则默认为视频时长。Duration和TimelineOut仅有一个生效。
         */
        Duration?: number;


        /**
         * 该字段仅支持SubType为mosaic_rect/blur的情况。特效区域左上角距离输出视频左上角的横向距离。
         * 注：支持百分比和像素两种形式。当取值为[0～0.9999]时，表示相对输出视频宽的占比。当取值为>=2的整数时，表示绝对像素。    
         */
        X?: number;

        /**
         * 该字段仅支持SubType为mosaic_rect/blur的情况。
         * 特效区域距离输出视频左上角的纵向距离。
         * 注：支持百分比和像素两种形式。当取值为[0～0.9999]时，表示相对输出视频高的占比。当取值为>=2的整数时，表示绝对像素
         */
        Y?: number;

        /**
         * 该字段仅支持SubType为mosaic_rect/blur的情况。特效区域在输出视频中的宽度。
         * 注：支持百分比和像素两种形式。当取值为[0～0.9999]时，表示相对输出视频宽的占比。当取值为>=2的整数时，表示绝对像素。
         */
        Width?: number;
        /**
         * 该字段仅支持SubType为mosaic_rect/blur的情况。特效区域在输出视频中的高度。
         * 注：支持百分比和像素两种形式。当取值为[0～0.9999]时，表示相对输出视频高的占比。当取值为>=2的整数时，表示绝对像素。
         */
        Height?: number;


        /**
         * 特效片段出现在时间线的起始位置。单位：秒，精确到小数点后4位。如果TimelineIn不填，则默认为0。
         */
        TimelineIn?: number;

        /**
         * 	特效片段出现在时间线的结束位置。单位：秒，精确到小数点后4位。如果TimelineOut不填，则默认为视频结束时间。
         */
        TimelineOut?: number;
    }
}



export interface OutputMediaConfig {
    MediaURL?: string;
    /**
     * 成片输出到VOD时必填
     * 指定输出到VOD的媒资文件存储地址，不包含http:// 的前缀。如：outin-xxxxxx.oss-cn-shanghai.aliyuncs.com
     */
    StorageLocation?: string;
    /**
     * 成片输出到vod时必填
     */
    FileName?: string;


    Width?: number;

    Height?: number;

    Bitrate?: number;

    MaxDuration?: number;

    Video?: {
        Fps?: number;
        Orientation?: "Horizontal" | "Vertical"
        Codec?: string;
        Profile?: "baseline" | "main" | "high",
        /**
         * 取值范围：[0, 51]
         */
        Crf?: number;
        /**
         * 视频算法器预制
         */
        Preset?: "veryfast" | "fast" | "medium" | "slow" | "slower"
    },

}

export interface MediaProducingOptions {
    video: {
        urls: string[];
        options: VideoTrackOptions;
    },
    bgMusic?: {
        url: string;
        options: AudioTrackOptions
    },
    output: OutputMediaConfig,
    userData: Record<string, any>
}


export interface ICERes<T> {
    headers?: {
        [key: string]: string;
    };
    statusCode?: number;
    body?: T;
}

interface SubmitMediaProducingJobResponseBody {
    /**
     * @remarks
     * The job ID.
     *
     * @example
     * ****d80e4e4044975745c14b****
     */
    jobId?: string;
    /**
     * @remarks
     * The media asset ID of the output file.
     *
     * @example
     * ****c469e944b5a856828dc2****
     */
    mediaId?: string;
    /**
     * @remarks
     * The ID of the editing project.
     *
     * @example
     * ****b4549d46c88681030f6e****
     */
    projectId?: string;
    /**
     * @remarks
     * The request ID.
     *
     * @example
     * ****36-3C1E-4417-BDB2-1E034F****
     */
    requestId?: string;
    /**
     * @remarks
     * The media asset ID of the output file in ApsaraVideo VOD if the output file is stored in ApsaraVideo VOD.
     *
     * @example
     * ****d8s4h75ci975745c14b****
     */
    vodMediaId?: string;

}

export type SubmitMediaProducingJobResponse = ICERes<SubmitMediaProducingJobResponseBody>