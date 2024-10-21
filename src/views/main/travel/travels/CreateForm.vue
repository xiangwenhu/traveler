<template>
  <el-dialog v-model="state.visible" :title="state.title" width="60vw">
    <el-form :model="formData" label-width="100" :rules="rules" ref="refForm">
      <el-form-item label="标题" required prop="title">
        <el-input v-model="formData.title"></el-input>
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input v-model="formData.description" type="textarea"></el-input>
      </el-form-item>
      <el-form-item label="封面" required prop="cover">
        <el-input v-model="formData.cover"></el-input>
      </el-form-item>
      <el-form-item label="省市县" prop="regions" required>
        <PCA style="width: 50%" v-modal="formData.regions"></PCA>
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
          href="https://api.map.baidu.com/lbsapi/getpoint/index.html"
          target="_blank"
          >打开地图</el-link
        >
      </el-form-item>
      <el-form-item label="日期" prop="date">
        <el-date-picker
          v-model="formData.date"
          value-format="x"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="标签"> </el-form-item>

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
</template>


<script setup lang="ts">
import { TravelItem } from "@/types/service";
import { reactive, ref } from "vue";
import PCA from "@/components/PCA/index.vue";
import { ElMessage, FormInstance, FormRules } from "element-plus";
import { copyUnEmptyProperty } from "@/utils/arrHandle";
import { addItem, updateItem } from "@/api/travel";
import { regionsToPCA } from "@/utils/pca";
import { getLatitudeAndLongitude } from "@/utils";
import { REG_COORDINATES } from "@/const/regex";

interface Props {
  item: TravelItem | undefined;
}

const props = defineProps<Props>();

const isEdit = props.item && props.item.id;
const operation = isEdit ? "编辑用户" : "新建用户";

const emits = defineEmits(["close", "ok"]);

const refForm = ref<FormInstance>();

const state = reactive<{
  title: string;
  visible: boolean;
}>({
  title: isEdit ? "编辑旅行" : "新建旅行",
  visible: true,
});

function getInitData() {
  if (!isEdit) return {};

  const it = props.item;
  return {
    ...it,
    regions: [it.province, it.city, it.county].filter(Boolean),
    coordinates: `${it.longtitude},${it.latitude}`,
  };
}

const formData = reactive<
  Partial<
    TravelItem & {
      regions: number[];
      coordinates: string;
    }
  >
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
  cover: [
    {
      required: true,
      message: "请上传封面",
      trigger: "blur",
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
          if(match) callback();
          callback(new Error('请输入正确的经纬度'))
      }
    }
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


function getSubmitData() {
  const data = copyUnEmptyProperty(formData);

  const pca = regionsToPCA(data.regions!);
  const longLat = getLatitudeAndLongitude(data.coordinates!);
  return {
    title: data.title,
    description: data.description,
    cover: data.cover,
    ...pca,
    address: data.address,
    date: data.date,
    ...longLat
  } as TravelItem;
}


function getPCA(){

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
    emits("ok");
  } catch (err) {
    ElMessage.error(`${operation}失败`);
  }
}

function onSubmit() {
  refForm.value?.validate((isValid) => {
    if (!isValid) return;
    doSubmit();
  });
}
</script>