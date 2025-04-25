<template>
  <div class="c-descriptions-container">
    <el-descriptions
      title="用户信息"
      :column="1"
      size="large"
      :border="true"
      class="c-descriptions"
    >
      <el-descriptions-item label="账号" width="200px">{{
        item?.account
      }}</el-descriptions-item>
      <el-descriptions-item label="名称">{{ item?.name }}</el-descriptions-item>
      <el-descriptions-item label="关联用户">{{
        item?.associateUsers
      }}</el-descriptions-item>
      <el-descriptions-item label="email">{{ item?.email }}</el-descriptions-item>
      <el-descriptions-item label="是否是管理员">
        {{ item?.isAdmin ? "是" : "否" }}
      </el-descriptions-item>
      <el-descriptions-item label="是否是只读用户">
        {{ item?.readonly ? "是" : "否" }}
      </el-descriptions-item>
      <el-descriptions-item label="phone">{{ item?.phone }}</el-descriptions-item>
      <el-descriptions-item label="创建时间">{{ item?.createdAt }}</el-descriptions-item>
      <el-descriptions-item label="更新时间">{{ item?.updatedAt }}</el-descriptions-item>
    </el-descriptions>
  </div>
</template>

<script lang="tsx" setup>
import { getItemByAccount } from "@/api/system/user";
import { onMounted, ref } from "vue";

const item = ref<any>();

async function init() {
  try {
    const res = await getItemByAccount({
      account: "uncle",
    });

    if (!res || res.code !== 0) return;

    item.value = res.data;
  } catch (err) {}
}

onMounted(init);
</script>

<style lang="scss" scoped>
.c-descriptions-container {
  flex-direction: column;
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
}

.c-descriptions {
  width: 60%;
  max-width: 1000px;
  min-width: 500px;
}
</style>
