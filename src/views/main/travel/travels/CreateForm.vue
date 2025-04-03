<template>
  <el-dialog
    center
    v-model="state.visible"
    :title="state.title"
    :width="props.width"
    @close="emits('close')"
  >
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
          dir="travel/cover"
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
      <el-form-item label="开始日期" prop="date">
        <el-date-picker
          v-model="formData.date"
          value-format="YYYY-MM-DD HH:mm:ss"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="结束日期" prop="endDate">
        <el-date-picker
          v-model="formData.endDate"
          value-format="YYYY-MM-DD HH:mm:ss"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="费用" prop="cost">
        <el-input-number v-model="formData.cost"></el-input-number>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <TravelStatus v-model="formData.status"></TravelStatus>
      </el-form-item>
      <el-form-item label="交通工具" prop="transport">
        <TransportList v-model="formData.transport"></TransportList>
      </el-form-item>
      <el-form-item label="标签">
        <tags v-model="formData.tags" multiple />
      </el-form-item>
      <el-form-item label="关联景点" prop="scenicSpots">
        <AAAAA v-model="formData.scenicSpots" multiple />
      </el-form-item>
      <el-form-item label="关联高校" prop="schools">
        <School v-model="formData.schools" multiple />
      </el-form-item>
      <el-form-item label-width="0">
        <div class="center wp-100">
          <el-button type="primary" @click="onSubmit" size="default" :disabled="!editable">提交</el-button>
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
import { EnumTravelStatus, TravelItem } from "@/types/service";
import { Prop, PropType, reactive, ref } from "vue";
import PCA from "@/components/PCA/index.vue";
import {
  ElLoadingService,
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
import AAAAA from "@/components/select/AAAAA.vue";
import School from "@/components/select/School.vue";
import TravelStatus from "@/components/select/TravelStatus.vue";
import TransportList from "@/components/select/TransportList.vue";

import { getFormSettings } from "@/utils/mobile";
import { isNotReadonlyUser } from "@/store/quick";
const formSetting = getFormSettings();

const ACCEPTS = [...Image_Suffix].join(",");

const editable = isNotReadonlyUser();


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
  isPlan: {
    type: Boolean,
    default() {
      return false;
    },
  },
});

const isEdit = props.item && props.item.id;
const operation = (isEdit ? "编辑旅行" : "新建旅行") + (props.isPlan ? "计划" : "");

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
      coordinates: it.longitude && it.latitude ? `${it?.longitude},${it.latitude}` : "",
      status: props.isPlan ? EnumTravelStatus.Planing : EnumTravelStatus.Completed,
      cost: 0,
      date: new Date().toLocaleString(),
      endDate: new Date().toLocaleString(),
    } as Partial<TravelItem>;
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
  } as Partial<TravelItem>;
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
      message: "请选择k开始日期",
      trigger: "blur",
    },
  ],
  endDate: [
    {
      required: true,
      message: "请选择结束日期",
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
  cost: [
    {
      required: true,
      message: "请输入费用",
      trigger: "blur",
    },
  ],
  status: [
    {
      required: true,
      message: "请选择状态",
      trigger: "blur",
    },
  ],
  transport: [
    {
      required: true,
      message: "请选择交通工具",
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
    scenicSpots: fd.scenicSpots || null,
    schools: fd.schools || null,
    endDate: fd.endDate,
    cost: fd.cost || 0,
    status: fd.status,
    transport: fd.transport,
  } as TravelItem;
}

async function doSubmit() {
  const loading = ElLoadingService({
    target: document.body,
    text: "处理中",
  });
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
  } finally {
    loading.close();
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
