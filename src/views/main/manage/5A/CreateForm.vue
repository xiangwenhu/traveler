<template>
  <el-dialog
    v-model="state.visible"
    :title="state.title"
    :width="props.width"
    @close="emits('close')"
    center
  >
    <el-form
      :model="formData"
      label-width="100"
      :rules="rules"
      ref="refForm"
      v-bind="formSetting"
    >
      <el-form-item label="名称" required prop="name">
        <el-input v-model="formData.name" :max="50"></el-input>
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input v-model="formData.description" type="textarea"></el-input>
      </el-form-item>
      <el-form-item label="照片" required prop="files">
        <!-- <el-input v-model="formData.cover"></el-input> -->
        <OSSUpload
          v-model:file-list="formData.files"
          list-type="picture-card"
          :on-preview="onPictureCardPreview"
          :accept="ACCEPTS"
          dir="5a"
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
      <el-form-item label="入选年份" prop="year">
        <el-input-number :min="2000" v-model="formData.year"></el-input-number>
      </el-form-item>
      <el-form-item label="标签">
        <tags v-model="formData.tags" multiple />
      </el-form-item>
      <el-form-item label="网址" prop="website">
        <div style="text-align: left; width: 100%">
          <div v-if="formData.website && formData.website.length > 0">
            <div v-for="(w, index) in formData.website" :key="index" class="website-item">
              <el-link :href="w.url" target="_blank" type="primary">{{
                w.title || "官网"
              }}</el-link>
              <el-icon class="op" @click="onToEditUrlItem(index, w)">
                <Edit />
              </el-icon>
              <el-icon class="op" @click="onDeleteUrlItem(index)"
                ><DeleteFilled
              /></el-icon>
            </div>
          </div>
          <div
            class="op"
            style="display: inline-block"
            @click="
              onToEditUrlItem(
                formData.website?.length || 0,
                {
                  title: formData.name || '',
                  url: '',
                },
                'website'
              )
            "
          >
            <el-icon><Plus /> </el-icon>添加
          </div>
        </div>
      </el-form-item>
      <el-form-item label="二维码" prop="QRfiles">
        <!-- <el-input v-model="formData.cover"></el-input> -->
        <OSSUpload
          v-model:file-list="formData.QRFiles"
          list-type="picture"
          :on-preview="onPictureCardPreview"
          :accept="ACCEPTS"
          dir="5a"
        ></OSSUpload>

        <el-button
          style="margin-left: 10px; "
          size="large"
          @click="
            onToEditUrlItem(
              formData.QRCodes?.length || 0,
              {
                title: formData.name || '',
                url: '',
              },
              'QRCodes'
            )
          "
        >
          <el-icon><Plus /> </el-icon> 通过地址添加
        </el-button>
      </el-form-item>
      <el-form-item prop="isfree" label="是否免费">
        <el-checkbox v-model="formData.isfree">免费</el-checkbox>
      </el-form-item>

      <el-form-item label-width="0">
        <div class="center wp-100">
          <el-button type="primary" @click="onSubmit" size="default">提交</el-button>
          <el-button @click="emits('close')">取消</el-button>
        </div>
      </el-form-item>
    </el-form>
  </el-dialog>
  <el-dialog v-model="state.dialogPicVisible">
    <img w-full :src="state.dialogPicUrl" alt="Preview Image" />
  </el-dialog>
  <el-dialog v-model="dialogUrlItem.visible" center append-to-body title="编辑网站">
    <web-site-form
      v-if="dialogUrlItem.visible"
      :item="dialogUrlItem.item"
      @close="onCloseDialogUrlItem"
      @save="onSaveSite"
    ></web-site-form>
  </el-dialog>
</template>

<script setup lang="ts">
import { AAAAAItem, UrlItem } from "@/types/service";
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
import { addItem, updateItem } from "@/api/5A";
import { regionsToPCA } from "@/utils/pca";
import { getLatitudeAndLongitude } from "@/utils";
import { REG_COORDINATES } from "@/const/regex";
import OSSUpload from "@/components/upload/index.vue";
import { Image_Suffix } from "@/const/index";
import tags from "@/components/select/tags.vue";
import { DeleteFilled, Edit, Plus } from "@element-plus/icons-vue";
import WebSiteForm from "@/components/WebSiteForm.vue";
import { WebSite } from "@/types";
import { getFormSettings } from "@/utils/mobile";
const formSetting = getFormSettings();

const ACCEPTS = [...Image_Suffix].join(",");

interface Props {
  item: Partial<AAAAAItem> | undefined;
  width: string | number;
}

const props = defineProps({
  item: {
    type: Object as PropType<Partial<AAAAAItem> | undefined>,
  },
  width: {
    type: Number as PropType<number | string>,
    default() {
      return "60vw";
    },
  },
});

const isEdit = props.item && props.item.id;
const operation = isEdit ? "编辑景点" : "新建景点";

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

type UrlFiled = "website" | "QRCodes";

const dialogUrlItem = reactive<{
  item: WebSite | undefined;
  itemIndex: number;
  visible: boolean;
  field: UrlFiled;
}>({
  item: undefined,
  visible: false,
  itemIndex: -1,
  field: "website",
});

function getInitData() {
  const it = props.item || ({} as Partial<AAAAAItem>);

  if (!isEdit) {
    return {
      ...it,
      regions: [it.province, it.city, it.county].filter(Boolean),
      coordinates: it.longitude && it.latitude ? `${it?.longitude},${it.latitude}` : "",
    } as any;
  }

  return {
    ...it,
    regions: [it.province, it.city, it.county].filter(Boolean),
    coordinates: `${it.longitude},${it.latitude}`,
    files: (it.photos || []).map((p) => ({
      name: p.title,
      url: p.url,
    })),
    QRFiles: (it.QRCodes || []).map((p) => ({
      name: p.title,
      url: p.url,
    })),
  } as any;
}

const formData = reactive<
  Partial<AAAAAItem> & {
    regions?: number[];
    coordinates?: string;
    files?: UploadFile[];
    QRFiles?: UploadFile[];
  }
>(getInitData());

const rules: FormRules = {
  name: [
    {
      required: true,
      message: "请输入名称",
      trigger: "blur",
    },
    {
      type: "string",
      message: "标题长度为2-50",
      trigger: "blur",
      min: 2,
      max: 50,
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
  year: [
    {
      required: true,
      message: "请选择年份",
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

function getUrlItems(files: UploadFile[]) {
  const photos = files.map((f) => ({
    title: f.name,
    url: f.response || f.url,
  }));
  return photos;
}

function getSubmitData() {
  const fd = copyUnEmptyProperty(formData);
  const pca = regionsToPCA(fd.regions!);
  const longLat = getLatitudeAndLongitude(fd.coordinates!);
  return {
    name: fd.name,
    description: fd.description || null,
    photos: getUrlItems(fd.files!),
    ...pca,
    address: fd.address,
    year: fd.year,
    ...longLat,
    tags: fd.tags || [],
    isfree: !!fd.isfree || false,
    website: fd.website || [],
    QRCodes: getUrlItems(fd.QRFiles!),
  } as AAAAAItem;
}

async function doSubmit() {
  try {
    const data = getSubmitData();
    console.log(`data:`, data);

    const method = isEdit ? updateItem : addItem;

    if (isEdit) {
      data.id = props.item.id!;
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

function onDeleteUrlItem(index: number) {
  switch (dialogUrlItem.field) {
    case "website":
      formData.website!.splice(index, 1);
      break;
  }
}

function onToEditUrlItem(index: number, item: WebSite, filed: UrlFiled) {
  dialogUrlItem.field = filed;
  dialogUrlItem.visible = true;
  dialogUrlItem.item = item;
  dialogUrlItem.itemIndex = index;
}

function onCloseDialogUrlItem() {
  dialogUrlItem.visible = false;
  dialogUrlItem.item = undefined;
  dialogUrlItem.itemIndex = -1;
}

function onSaveSite(item: WebSite) {
  if (!formData[dialogUrlItem.field]) {
    formData.website = [item];
  } else {
    formData[dialogUrlItem.field]![dialogUrlItem.itemIndex] = item;
  }

  switch (dialogUrlItem.field) {
    case "QRCodes":
      formData.QRFiles = (formData.QRCodes || []).map((p) => ({
        name: p.title,
        url: p.url,
      })) as any;
      break;
  }

  onCloseDialogUrlItem();
}
</script>

<style lang="scss" scoped>
.op {
  vertical-align: middle;
  cursor: pointer;
}
</style>
