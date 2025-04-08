<template>
  <el-icon @click="onToEdit">
    <Edit />
  </el-icon>

  <el-dialog v-model="state.dialog" title="编辑资源" append-to-body top="15vh">
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
      <el-form-item label-width="0">
        <div class="center wp-100">
          <permission-submit @click="onSubmit">
            提交
          </permission-submit>
          <el-button @click="state.dialog = false">取消</el-button>
        </div>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
  
  
<script setup lang="ts">
import { updateItem } from "@/api/resource";
import { ResourceItem } from "@/types/service";
import { delay } from "@/utils";
import { getFormSettings } from "@/utils/mobile";
import {
  ElLoading,
  ElMessage,
  FormInstance,
  FormRules,
  RenderRowData,
} from "element-plus";
import { throttle } from "lodash";
import { reactive, ref } from "vue";
import { Edit } from "@element-plus/icons";

const formSetting = getFormSettings();

const emits = defineEmits<{
  (e: "success", id: number): void;
}>();

const props = defineProps<{
  item: ResourceItem | undefined;
}>();

const state = reactive<{
  loading: boolean;
  dialog: boolean;
}>({
  loading: false,
  dialog: false,
});

interface FormData {
  title: string;
}

function getInitData(): FormData {
  return {
    title: props.item?.title || "",
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
      message: "标题长度为2-100",
      trigger: "blur",
      min: 2,
      max: 100,
    },
  ],
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

function onToEdit(e: Event) {
  e.stopImmediatePropagation();
  state.dialog = true;
}

function doSubmit() {
  const { item } = props;

  if (!item) return;

  const data = {
    id: item.id!,
    title: formData.title,
  } as ResourceItem;

  onUpdateItem(data);
}

const onUpdateItem = async function onUpdateItem(data: ResourceItem) {
  const loadingEl = ElLoading.service({
    lock: true,
  });

  try {
    await delay(200);

    const res = await updateItem(data);

    if (res && res.code == 0) {
      state.dialog = false;
      emits("success", props.item?.id!);
    }

    props.item!.title = formData.title;

    console.log("res:", res);
  } catch (err: any) {
    ElMessage.error(`提交失败：${err && err.message}`);
  } finally {
    loadingEl.close();
  }
};
</script>
  