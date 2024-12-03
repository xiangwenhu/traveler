<template>
  <el-dialog
    width="60%"
    style="max-width: 600px"
    v-model="state.visible"
    @close="emits('close')"
    :title="state.title"
  >
    <el-form
      :rules="rules"
      size="default"
      label-width="100px"
      label-suffix="："
      :model="formData"
      ref="refForm"
    >
      <el-form-item label="姓名" required prop="name">
        <el-input maxlength="10" v-model="formData.name"></el-input>
      </el-form-item>
      <el-form-item label="账户" prop="account" required>
        <el-input
          maxlength="20"
          v-model="formData.account"
          :disabled="isEdit"
        ></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password" :required="!isEdit">
        <el-input
          type="password"
          maxlength="20"
          v-model="formData.password"
          show-password
        ></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email" required>
        <el-input maxlength="20" v-model="formData.email"></el-input>
      </el-form-item>
      <el-form-item label="账户状态" name="status " prop="status">
        <enable-status v-model="formData.status"></enable-status>
      </el-form-item>
      <el-form-item label="关联用户" prop="associateUsers">
        <Users v-model="formData.associateUsers" multiple></Users>
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
</template>

<script setup lang="ts">
import { ElMessage, FormInstance, FormItemRule, FormRules } from "element-plus";
import { reactive, ref } from "vue";
import EnableStatus from "@/components/select/enableStatus.vue";
import Users from "@/components/select/Users.vue";
import { addItem, updateItem } from "@/api/system/user";
import { copyUnEmptyProperty } from "@/utils/arrHandle";
import { UserItem } from "@/types/service";

interface Props {
  item: UserItem | undefined;
}
const emits = defineEmits(["close", "ok"]);

const props = defineProps<Props>();

const refForm = ref<FormInstance>();

const isEdit = !!(props.item && props.item.id);

const operation = isEdit ? "编辑用户" : "新建用户";

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
      account: props.item.account,
      status: props.item.status,
      password: props.item.password,
      email: props.item.email,
      associateUsers: props.item.associateUsers
    };

  return {
    status: 1,
  };
}

const formData = ref<UserItem>(initFormData() as UserItem);

const passwordRule: FormItemRule[] = isEdit
  ? [
      {
        message: "密码的长度为5-20",
        trigger: "blur",
        type: "string",
        min: 5,
        max: 20,
      },
    ]
  : [
      {
        message: "请输入密码",
        trigger: "blur",
        required: true,
      },
      {
        message: "密码的长度为5-20",
        trigger: "blur",
        type: "string",
        min: 5,
        max: 20,
      },
    ];

const rules: FormRules = {
  name: [
    {
      required: true,
      message: "请输入姓名",
      trigger: "blur",
    },
    {
      message: "姓名有效长度我2-10",
      trigger: "blur",
      type: "string",
      min: 2,
      max: 10,
    },
  ],
  account: [
    {
      required: true,
      message: "请输入账号",
      trigger: "blur",
      type: "string",
    },
    {
      message: "账号有效长度我5-20",
      trigger: "blur",
      type: "string",
      min: 5,
      max: 20,
    },
  ],
  password: passwordRule,
  status: [
    {
      required: true,
      message: "请选择账户状态",
      trigger: "blur",
    },
  ],
  email: [
    {
      required: true,
      message: "请输入正确的邮箱",
      trigger: "blur",
    },
    {
      type: "email",
      trigger: "blur",
      message: "请输入正确的邮箱",
    },
  ],
};

function getSubmitData() {
  return copyUnEmptyProperty(formData.value);
}

async function doSubmit() {
  try {
    const data = getSubmitData();
    console.log(`data:`, data);

    const method = isEdit ? updateItem : addItem;

    data.isAdmin = false;
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
