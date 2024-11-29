<template>
  <el-form :model="formData" label-width="100" :rules="rules" ref="refForm">
    <el-form-item label="名称" required prop="title">
      <el-input v-model="formData.title"></el-input>
    </el-form-item>

    <el-form-item label="网址" required prop="url">
      <el-input v-model="formData.url"></el-input>
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
</template>


<script setup lang="ts">
import { WebSite } from "@/types";
import { FormInstance, FormRules } from "element-plus";
import { PropType, reactive, ref } from "vue";

const emits = defineEmits<{
  (e: "save", data: WebSite): void;
  (e: "close"): void;
}>();
const props = defineProps({
  item: {
    type: Object as PropType<WebSite>,
  },
});

const refForm = ref<FormInstance>();

const isEdit = !!props.item;

function getInitData() {
  if (isEdit) {
    return props.item;
  }

  return {
    title: "",
    url: "",
  };
}

const rules: FormRules = {
  title: [
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
  url: [
    {
      type: "url",
      required: true,
      message: "请输入正确的url地址",
      trigger: "blur",
    },
  ],
};

const formData = reactive<WebSite>(getInitData());

async function doSubmit() {
  emits("save", formData);
}

function onSubmit() {
  console.log("formData:", formData);
  refForm.value?.validate((isValid) => {
    if (!isValid) return;
    doSubmit();
  });
}
</script>

<style lang="scss" scoped>
</style>