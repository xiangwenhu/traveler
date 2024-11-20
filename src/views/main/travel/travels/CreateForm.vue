<template>
  <el-dialog
    v-model="state.visible"
    :title="state.title"
    :width="props.width"
    @close="emits('close')"
  >
    <el-form :model="formData" label-width="100" :rules="rules" ref="refForm">
      <el-form-item label="标题" required prop="title">
        <el-input v-model="formData.title"></el-input>
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input v-model="formData.description" type="textarea"></el-input>
      </el-form-item>
      <el-form-item label="封面" required prop="files">
        <!-- <el-input v-model="formData.cover"></el-input> -->
        <OSSUpload
          v-model:file-list="formData.files"
          :limit="1"
          list-type="picture-card"
          :on-preview="onPictureCardPreview"
          :accept="ACCEPTS"
        ></OSSUpload>
      </el-form-item>
      <el-form-item label="省市县" prop="regions" required>
        <PCA style="width: 50%" v-model="formData.regions"></PCA>
      </el-form-item>
      <el-form-item label="地址" required prop="address">
        <el-input v-model="formData.address"></el-input>
      </el-form-item>
      <el-form-item label="经纬度" required prop="coordinates">
        <el-input v-model="formData.coordinates" style="width: 50%"></el-input>
        <el-link
          style="margin-left: 10px"
          type="primary"
          :underline="false"
          href="https://lbs.amap.com/tools/picker"
          target="_blank"
          >打开地图</el-link
        >
      </el-form-item>
      <el-form-item label="日期" prop="date">
        <el-date-picker
          v-model="formData.date"
          value-format="YYYY-MM-DD HH:mm:ss"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="标签">
        <tags v-model="formData.tags" multiple />
      </el-form-item>

      <el-form-item label-width="0">
        <div class="center wp-100">
          <el-button type="primary" @click="onSubmit" size="default"
            >提交</el-button
          >
          <el-button @click="emits('close')">取消</el-button>
        </div>
      </el-form-item>
    </el-form>
  </el-dialog>
  <el-dialog v-model="state.dialogPicVisible">
    <img w-full :src="state.dialogPicUrl" alt="Preview Image" />
  </el-dialog>
</template>

<script setup lang="ts">
import { TravelItem } from "@/types/service";
import { Prop, PropType, reactive, ref } from "vue";
import PCA from "@/components/PCA/index.vue";
import {
  ElMessage,
  FormInstance,
  FormRules,
  UploadFile,
  UploadProps,
} from "element-plus";
import { copyUnEmptyProperty } from "@/utils/arrHandle";
import { addItem, updateItem } from "@/api/travel";
import { regionsToPCA } from "@/utils/pca";
import { getLatitudeAndLongitude } from "@/utils";
import { REG_COORDINATES } from "@/const/regex";
import OSSUpload from "@/components/upload/index.vue";
import { Image_Suffix } from "@/const/index";
import tags from "@/components/select/tags.vue";

const ACCEPTS = [...Image_Suffix].join(",");

interface Props {
  item: Partial<TravelItem> | undefined;
  width: string | number;
}

const props = defineProps({
  item: {
    type: Object as PropType<Partial<TravelItem> | undefined>,
  },
  width: {
    type: Number as PropType<number | string>,
    default() {
      return "60vw";
    },
  },
});

const isEdit = props.item && props.item.id;
const operation = isEdit ? "编辑旅行" : "新建旅行";

const emits = defineEmits(["close", "ok"]);

const refForm = ref<FormInstance>();

const state = reactive<{
  title: string;
  visible: boolean;
  dialogPicVisible: boolean;
  dialogPicUrl: string;
}>({
  title: operation,
  visible: true,
  dialogPicVisible: false,
  dialogPicUrl: "",
});

function getInitData() {
  const it = props.item || ({} as Partial<TravelItem>);

  if (!isEdit) {
    return {
      ...it,
      regions: [it.province, it.city, it.county].filter(Boolean),
      coordinates:
        it.longitude && it.latitude ? `${it?.longitude},${it.latitude}` : "",
    } as any;
  }

  return {
    ...it,
    regions: [it.province, it.city, it.county].filter(Boolean),
    coordinates: `${it.longitude},${it.latitude}`,
    files: [
      {
        name: it.cover,
        url: it.cover,
      },
    ],
  } as any;
}

const formData = reactive<
  Partial<TravelItem> & {
    regions?: number[];
    coordinates?: string;
    files?: UploadFile[];
  }
>(getInitData());

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
  files: [
    {
      type: "array",
      required: true,
      message: "请上传封面",
      trigger: "blur",
    },
    {
      message: "请上传封面",
      validator(rule, value, callback, source, options) {
        const isArray = Array.isArray(value);
        if (isArray && value.length > 0) callback();
        callback(new Error("请上传封面"));
      },
    },
  ],
  coordinates: [
    {
      required: true,
      message: "请输入经纬度",
      trigger: "blur",
    },
    {
      message: "请输入正确的经纬度",
      validator(rule, value, callback, source, options) {
        const match = REG_COORDINATES.test(value.trim());
        if (match) callback();
        callback(new Error("请输入正确的经纬度"));
      },
    },
  ],
  address: [
    {
      required: true,
      message: "请输入详细地址",
      trigger: "blur",
    },
  ],
  date: [
    {
      required: true,
      message: "请选择日期",
      trigger: "blur",
    },
  ],
  regions: [
    {
      required: true,
      message: "请选择省市县",
      trigger: "blur",
    },
  ],
};

function getCover(files: UploadFile[]) {
  const f = files[0];
  return f.response || formData.cover;
}

function getSubmitData() {
  const fd = copyUnEmptyProperty(formData);
  const pca = regionsToPCA(fd.regions!);
  const longLat = getLatitudeAndLongitude(fd.coordinates!);
  return {
    title: fd.title,
    description: fd.description || null,
    cover: getCover(fd.files!),
    ...pca,
    address: fd.address,
    date: fd.date,
    ...longLat,
    tags: fd.tags || [],
  } as TravelItem;
}

async function doSubmit() {
  try {
    const data = getSubmitData();
    console.log(`data:`, data);

    const method = isEdit ? updateItem : addItem;

    if (isEdit) {
      data.id = props.item.id;
    }

    const res = await method(data);

    if (!res || res.code != 0) return;

    ElMessage.success(`${operation}成功`);
    emits("close");
    emits("ok", res.data);
  } catch (err) {
    ElMessage.error(`${operation}失败`);
  }
}

function onSubmit() {
  console.log("formData:", formData);
  refForm.value?.validate((isValid) => {
    if (!isValid) return;
    doSubmit();
  });
}

const onPictureCardPreview: UploadProps["onPreview"] = (uploadFile) => {
  state.dialogPicUrl = uploadFile.url!;
  state.dialogPicVisible = true;
};
</script>
