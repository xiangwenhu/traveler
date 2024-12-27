<template>
  <el-button
    @click="state.dialog = true"
    size="large"
    type="danger"
    class="btn-add"
    v-if="travelItem"
    >一键成片</el-button
  >
  <el-dialog v-model="state.dialog" title="一键成片" append-to-body>
    <el-form
      :model="formData"
      label-width="auto"
      :rules="rules"
      ref="refForm"
      v-bind="formSetting"
    >
      <el-form-item label="标题" required prop="title">
        <el-input v-model="formData.title"></el-input>
      </el-form-item>
      <!-- <el-form-item label="封面" required prop="files">
        <OSSUpload
          v-model:file-list="formData.files"
          :limit="1"
          list-type="picture-card"
          :on-preview="onPictureCardPreview"
          :accept="ACCEPTS"
          dir="travel"
        ></OSSUpload>
      </el-form-item> -->
      <el-form-item label="图片展示时间" prop="imageDuration" required>
        <el-input-number v-model="formData.imageDuration"></el-input-number>
      </el-form-item>
      <el-form-item label="转场时间" prop="imageDuration" required>
        <el-input-number
          v-model="formData.transitionDuration"
        ></el-input-number>
      </el-form-item>
      <el-form-item prop="usebgMusic" label="使用背景音乐">
        <el-checkbox v-model="formData.usebgMusic">使用背景音乐</el-checkbox>
      </el-form-item>
      <el-form-item prop="bgMusic" label="背景音乐">
        <el-input v-model="formData.bgMusic"></el-input>
      </el-form-item>
      <el-form-item label-width="0">
        <div class="center wp-100">
          <el-button type="primary" @click="onSubmit" size="default"
            >提交</el-button
          >
          <el-button @click="state.dialog = false">取消</el-button>
        </div>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>


<script setup lang="ts">
import {
  submitTravelMediaProducing,
  TravelMediaProducingOptions,
} from "@/api/ice";
import { TravelItem } from "@/types/service";
import { delay } from "@/utils";
import { getFormSettings } from "@/utils/mobile";
import { ElLoading, ElMessage, FormInstance, FormRules } from "element-plus";
import { throttle } from "lodash";
import { reactive, ref } from "vue";
const formSetting = getFormSettings();

const props = defineProps<{
  urls: string[];
  travelItem: TravelItem | undefined;
}>();

const state = reactive<{
  loading: boolean;
  dialog: boolean;
  disabledLoadMore: boolean;
}>({
  loading: false,
  dialog: false,
  disabledLoadMore: false,
});

interface FormData {
  title: string;
  imageDuration: number;
  useTransition: boolean;
  transitionDuration: number;
  usebgMusic: boolean;
  bgMusic: string;
}

function getInitData(): FormData {
  return {
    useTransition: true,
    title: props.travelItem?.title || "",
    imageDuration: 4,
    usebgMusic: true,
    bgMusic:
      "https://traveler-traveler.oss-cn-beijing.aliyuncs.com/music/1c1c9684-0d30-4ce6-91d5-4c6973077182.mp3",
    transitionDuration: 1,
  };
}
const refForm = ref<FormInstance>();
const formData = reactive<FormData>(getInitData());

const rules: FormRules = {
  title: [
    {
      required: true,
      message: "请输入标题",
      trigger: "blur",
    },
    {
      type: "string",
      message: "标题长度为2-20",
      trigger: "blur",
      min: 2,
      max: 20,
    },
  ],
  //   files: [
  //     {
  //       type: "array",
  //       required: true,
  //       message: "请上传封面",
  //       trigger: "blur",
  //     },
  //     {
  //       message: "请上传封面",
  //       validator(rule, value, callback, source, options) {
  //         const isArray = Array.isArray(value);
  //         if (isArray && value.length > 0) callback();
  //         callback(new Error("请上传封面"));
  //       },
  //     },
  //   ]
};

const onSubmit = throttle(
  function onSubmit() {
    console.log("formData:", formData);
    refForm.value?.validate((isValid) => {
      if (!isValid) return;
      doSubmit();
    });
  },
  5000,
  {
    trailing: false,
  }
);

function doSubmit() {
  const { travelItem, urls } = props;

  if (!travelItem) return;

  const bgMusic = formData.usebgMusic
    ? {
        url:
          formData.bgMusic ||
          "https://traveler-traveler.oss-cn-beijing.aliyuncs.com/music/1c1c9684-0d30-4ce6-91d5-4c6973077182.mp3",
        options: {
          LoopMode: true,
        },
      }
    : undefined;

  const data: TravelMediaProducingOptions = {
    travelId: travelItem.id!,
    video: {
      urls,
      options: {
        mainTrack: true,
        imageDuration: formData.imageDuration || 4,
        useTransition: true,
        transitionDuration: formData.transitionDuration || 1,
      },
    },
    bgMusic,
    output: {
      FileName: `${formData.title}.mp4`,
    },
    userData: {
      title: formData.title,
    },
  };

  onSubmitMediaProducing(data);
}

const onSubmitMediaProducing = async function onSubmitMediaProducing(
  data: TravelMediaProducingOptions
) {
  const loadingEl = ElLoading.service({
    lock: true,
  });

  try {
    await delay(200);

    if (props.urls.length === 0) return ElMessage.error(`该旅行暂无媒体资源`);

    const res = await submitTravelMediaProducing(data);

    if (res && res.code == 0) {
      state.dialog = false;
    }

    console.log("res:", res);
  } catch (err: any) {
    ElMessage.error(`提交失败：${err && err.message}`);
  } finally {
    loadingEl.close();
  }
};
</script>
