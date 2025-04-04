<template>
  <el-dialog
    width="60%"
    style="max-width: 600px"
    v-model="state.visible"
    @close="emits('close')"
    :title="state.title"
    center
  >
    <el-form
      :rules="rules"
      size="default"
      label-width="100px"
      label-suffix="："
      :model="formData"
      ref="refForm"
    >
      <el-form-item label="标签名" required prop="name">
        <el-input maxlength="10" v-model="formData.name"></el-input>
      </el-form-item>

      <el-form-item label-width="0">
        <div class="center wp-100">
          <permission-submit @click="onSubmit">
            提交
          </permission-submit>
          <el-button @click="emits('close')">取消</el-button>
        </div>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script setup lang="ts">
import { ElMessage, FormInstance, FormItemRule, FormRules } from "element-plus";
import { reactive, ref } from "vue";
import { addItem, updateItem } from "@/api/tags";
import { copyUnEmptyProperty } from "@/utils/arrHandle";

interface Props {
  item: any;
}
const emits = defineEmits(["close", "ok"]);

const props = defineProps<Props>();

const refForm = ref<FormInstance>();

const isEdit = !!(props.item && props.item.id);

const operation = isEdit ? "编辑标签" : "新建标签";

const state = reactive<{
  visible: boolean;
  title: string;
}>({
  visible: true,
  title: operation,
});

function initFormData() {
  if (isEdit)
    return {
      name: props.item.name,
    };

  return {
    // status: 1,
  };
}

const formData = ref<any>(initFormData());

const rules: FormRules = {
  name: [
    {
      required: true,
      message: "请输入标签名",
      trigger: "blur",
    },
    {
      message: "标签名有效长度我2-10",
      trigger: "blur",
      type: "string",
      min: 2,
      max: 10,
    },
  ]
};

function getSubmitData() {
  return copyUnEmptyProperty(formData.value);
}

async function doSubmit() {
  try {
    const data = getSubmitData();
    console.log(`data:`, data);

    const method = isEdit ? updateItem : addItem;
    data.parentId = 0;
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
