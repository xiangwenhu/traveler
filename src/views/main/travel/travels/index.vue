<template>
  <div class="container">
    <div class="p-rel" style="height: 50px">
      <Search @search="onSearch" v-if="!props.isPlan"></Search>

      <div class="p-abs" style="right: 0; top: 0">
        <el-space>
          <el-icon @click="onSearch">
            <Refresh />
          </el-icon>
          <el-button type="primary" @click="onToAdd">新增</el-button>
        </el-space>
      </div>
    </div>

    <el-table v-loading="state.loading" :data="tableData.list">
      <el-table-column
        type="index"
        width="80"
        label="编号"
        :index="indexMethod"
      />
      <el-table-column>
        <template #default="scope">
          <el-image :src="scope.row.cover"></el-image>
        </template>
      </el-table-column>
      <el-table-column label="标题" prop="title"></el-table-column>
      <el-table-column label="日期">
        <template #default="scope">
          {{ dateFormatDefault(undefined, undefined, scope.row.date) }} -
          {{ dateFormatDefault(undefined, undefined, scope.row.endDate) }}
        </template>
      </el-table-column>
      <el-table-column prop="cost"  label="费用"></el-table-column>
      <el-table-column label="地址">
        <template #default="scope">
          {{ scope.row.provinceName }}/ {{ scope.row.cityName }}
          {{ scope.row.countyName ? `/` + scope.row.countyName : "" }}
        </template>
      </el-table-column>
      <!-- <el-table-column label="详细地址" prop="address"></el-table-column> -->
      <el-table-column
        label="更新时间"
        prop="updatedAt"
        :formatter="dateFormatDefault"
      ></el-table-column>
      <el-table-column label="操作" fixed="right">
        <template #default="scope">
          <router-link :to="`/travel/detail/${scope.row.id}`">
            <el-icon size="large" class="action-item">
              <View />
            </el-icon>
          </router-link>
          <el-icon
            @click="onToEdit(scope.row)"
            size="large"
            class="action-item"
          >
            <Edit />
          </el-icon>

          <el-popconfirm title="确认删除吗？" @confirm="onToDelete(scope.row)">
            <template #reference>
              <el-icon size="large" class="action-item"><Delete /></el-icon>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      class="pager"
      background
      layout="prev, pager, next,total,jumper"
      :page-size="searchParams.pageSize"
      v-model:current-page="searchParams.pageNum"
      :total="tableData.total"
      @update:current-page="onSearch"
    ></el-pagination>

    <create-form
      v-if="state.dialog"
      @close="state.dialog = false"
      :item="state.editItem"
      @ok="onRefresh"
      :is-plan="isPlan"
    ></create-form>
  </div>
</template>

<script setup lang="ts">
import { deleteItem, getItems } from "@/api/travel";
import { delay } from "@/utils";
import { copyUnEmptyProperty } from "@/utils/arrHandle";
import { ElMessage } from "element-plus";
import { onMounted, reactive, ref, watch } from "vue";
import CreateForm from "./CreateForm.vue";
import Search, { SearchParams } from "./Search.vue";
import { Refresh, Edit, View, Delete } from "@element-plus/icons";
import { dateFormatDefault } from "@/utils/colFormat";

const props = defineProps({
  isPlan: {
    type: Boolean,
    default() {
      return false;
    },
  },
});

const state = reactive<{
  dialog: boolean;
  editItem: any;
  loading: boolean;
}>({
  dialog: false,
  editItem: undefined,
  loading: false,
});

function onToAdd() {
  state.dialog = true;
  state.editItem = undefined;
}

const pager = {
  pageNum: 1,
  pageSize: 10,
};

const searchParams = ref<{
  pageSize: number;
  pageNum: number;
}>({
  ...pager,
} as any);

const list = ref<any[]>([]);

function getSearchParams() {
  const extra = props.isPlan
    ? {
        status: [0, 1, 2, 3].join(","),
      }
    : {
        status: "9",
      };

  return copyUnEmptyProperty({
    ...searchParams.value,
    ...extra,
  });
}

async function onSearch(sParams: SearchParams = {} as any) {
  try {
    state.loading = true;

    searchParams.value = {
      ...searchParams.value,
      ...sParams,
    };

    await delay(300);
    const params = getSearchParams();
    const res = await getItems(params);
    state.loading = false;
    if (!res || res.code != 0 || !res.data) return;
    tableData.list = res.data.list || [];
    tableData.total = res.data.total || 0;
  } catch (err) {
    console.log("onSearch travel:", err);
    state.loading = false;
    ElMessage.error(`获取旅行记录失败`);
  }
}
const tableData = reactive<{
  list: any[];
  total: number;
}>({
  list: [],
  total: 0,
});

onMounted(() => {
  onSearch();
});

function onToEdit(item: any) {
  state.dialog = true;
  state.editItem = item;
}

async function onToDelete(item: any) {
  try {
    state.loading = true;

    const res = await deleteItem(item.id);
    await delay(300);

    if (!res || res.code != 0) return;

    onSearch();

    ElMessage.success("删除旅行记录成功");
  } catch (err) {
    ElMessage.error(`删除旅行记录失败`);
  } finally {
    state.loading = false;
  }
}

function indexMethod(index: number) {
  const pager = searchParams.value;
  return (pager.pageNum - 1) * pager.pageSize + index + 1;
}

function onRefresh() {
  onSearch();
}
</script>

<style lang="scss" scoped>
.action-item {
  cursor: pointer;
  font-size: 20px;
  margin-right: 10px;
}
</style>
