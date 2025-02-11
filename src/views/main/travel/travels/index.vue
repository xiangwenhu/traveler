<template>
  <div class="container">
    <div class="p-rel">
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
      <el-table-column type="index" width="80" label="编号" :index="indexMethod" />
      <el-table-column>
        <template #default="scope">
          <el-image :src="scope.row.cover" fit="cover" style="max-height: 300px;" :preview-src-list="[scope.row.cover]"
            preview-teleported></el-image>
        </template>
      </el-table-column>
      <el-table-column label="标题" prop="title"></el-table-column>
      <el-table-column label="日期">
        <template #default="scope">
          {{ dateFormatDefault(undefined, undefined, scope.row.date) }} -
          {{ dateFormatDefault(undefined, undefined, scope.row.endDate) }}
        </template>
      </el-table-column>
      <el-table-column prop="cost" label="费用"></el-table-column>
      <el-table-column label="地址">
        <template #default="scope">
          {{ scope.row.provinceName }}/ {{ scope.row.cityName }}
          {{ scope.row.countyName ? `/` + scope.row.countyName : "" }}
        </template>
      </el-table-column>
      <!-- <el-table-column label="详细地址" prop="address"></el-table-column> -->
      <el-table-column label="更新时间" prop="updatedAt" :formatter="dateFormatDefault"></el-table-column>
      <el-table-column label="操作" fixed="right">
        <template #default="scope">
          <router-link :to="`/travel/detail/${scope.row.id}`">
            <el-icon size="large" class="action-item">
              <View />
            </el-icon>
          </router-link>
          <el-icon @click="onToEdit(scope.row)" size="large" class="action-item">
            <Edit />
          </el-icon>

          <el-icon size="large" class="action-item" @click="onToCloudVideoCut(scope.row)">
            <VideoPlay></VideoPlay>
          </el-icon>

          <el-popconfirm title="确认删除吗？" @confirm="onToDelete(scope.row)">
            <template #reference>
              <el-icon size="large" class="action-item">
                <Delete />
              </el-icon>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination class="pager" background layout="prev, pager, next,total,jumper" :page-size="searchParams.pageSize"
      v-model:current-page="searchParams.pageNum" :total="tableData.total"
      @update:current-page="onSearch"></el-pagination>

    <create-form v-if="state.dialog" @close="state.dialog = false" :item="state.editItem" @ok="onRefresh"
      :is-plan="isPlan"></create-form>
  </div>
</template>

<script setup lang="ts">
import { deleteItem, getItems, updateItem } from "@/api/travel";
import { delay } from "@/utils";
import { copyUnEmptyProperty } from "@/utils/arrHandle";
import { ElLoadingService, ElMessage } from "element-plus";
import { onMounted, reactive, ref, watch } from "vue";
import CreateForm from "./CreateForm.vue";
import Search, { SearchParams } from "./Search.vue";
import { Refresh, Edit, View, Delete, VideoPlay } from "@element-plus/icons";
import { dateFormatDefault } from "@/utils/colFormat";
import { TravelItem } from "@/types/service";
import { createEditingProject } from "@/api/ice";
import { useRouter } from "vue-router";
import { syncResourcesToICEProject } from "../../ice/utils/travel";

const router = useRouter();

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

function getSearchParams(sParams: SearchParams) {
  const extra = props.isPlan
    ? {
      status: [0, 1, 2, 3].join(","),
    }
    : {
      status: "9",
    };

  return copyUnEmptyProperty({
    ...searchParams.value,
    ...sParams,
    ...extra,
  });
}

async function onSearch(sParams: SearchParams = {} as any) {
  try {
    state.loading = true;

    await delay(300);
    const params = getSearchParams(sParams);
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

async function onToCloudVideoCut(item: TravelItem) {
  try {

    router.push({
      path: `/ice/project/${item.id!}`,
    });
  } catch (err: any) {
    console.log("onToCloudVideoCut error:", err);
    ElMessage.error(`跳转失败：${err && err.message}`);
  } finally {
    // onRefresh();
  }
}
</script>

<style lang="scss" scoped>
.action-item {
  cursor: pointer;
  font-size: 20px;
  margin-right: 10px;
}
</style>
../../ice/utils/ice