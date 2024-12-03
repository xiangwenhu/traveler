<template>
  <div class="container">
    <div class="p-rel" style="height: 50px">
      <!-- <Search @search="onSearch"></Search> -->

      <div class="p-abs" style="right: 0; top: 0">
        <el-space>
          <el-icon @click="onSearch">
            <Refresh />
          </el-icon>
          <el-button type="primary" @click="onToAdd">添加账号</el-button>
        </el-space>
      </div>
    </div>

    <el-table v-loading="state.loading" :data="paginatedData">
      <el-table-column type="index" width="80" label="编号" :index="indexMethod" />
      <el-table-column label="姓名" prop="name"></el-table-column>
      <el-table-column label="账号" prop="account"></el-table-column>
      <el-table-column
        label="账号状态"
        prop="status"
        :formatter="enableStatusFormat"
      ></el-table-column>
      <el-table-column
        label="创建时间"
        prop="createdAt"
        :formatter="dateFormatDefault"
      ></el-table-column>
      <el-table-column label="操作" fixed="right">
        <template #default="scope">
          <el-icon  @click="onToEdit(scope.row)" size="larger">
            <Edit />
          </el-icon>
          <el-popconfirm title="确认删除用户吗？" @confirm="onToDelete(scope.row)">
            <template #reference>
              <el-icon  size="larger">
                <Delete />
              </el-icon>
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
    ></el-pagination>

    <create-form
      v-if="state.visible"
      :item="state.item"
      @close="onCloseAdd"
      @ok="onSearch"
    ></create-form>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, unref } from "vue";
import Search, { SearchParams } from "./Search.vue";
import { delay } from "@/utils";
import { enableStatusFormat, dateFormatDefault } from "@/utils/colFormat";
import { ElMessage } from "element-plus";
import { copyUnEmptyProperty } from "@/utils/arrHandle";
import CreateForm from "./CreateForm.vue";
import { deleteItem, getItems } from "@/api/system/user";
import { Refresh, Edit, View, Delete } from "@element-plus/icons";

const state = reactive<{
  loading: boolean;
  visible: boolean;
  visibleDetail: boolean;
  item: any;
}>({
  loading: false,
  visible: false,
  item: undefined,
  visibleDetail: false,
});

const pager = {
  pageNum: 1,
  pageSize: 10,
};

const searchParams = ref<
  SearchParams & {
    pageSize: number;
    pageNum: number;
  }
>({
  ...pager,
} as any);

const list = ref<any[]>([]);

function getSearchParams() {
  return copyUnEmptyProperty({
    ...searchParams.value,
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
    tableData.total = tableData.list.length;
  } catch (err) {
    state.loading = false;
    ElMessage.error(`获取内部运营人员信息失败`);
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
  state.visible = true;
  state.item = item;
}

function onToAdd() {
  state.visible = true;
  state.item = undefined;
}

async function onToDelete(item: any) {
  try {
    state.loading = true;

    const res = await deleteItem({
      id: item.id,
    });
    await delay(300);

    if (!res || res.code != 0) return;

    onSearch();

    ElMessage.success("删除公司运营人员管理成功");
  } catch (err) {
    ElMessage.error(`删除公司运营人员管理失败`);
  } finally {
    state.loading = false;
  }
}

function onCloseAdd() {
  state.visible = false;
}

function indexMethod(index: number) {
  const pager = searchParams.value;
  return (pager.pageNum - 1) * pager.pageSize + index + 1;
}

function onLocalSearch() {}

const paginatedData = computed(() => {
  const sp = searchParams.value;

  const start = (sp.pageNum - 1) * sp.pageSize;
  const end = start + sp.pageSize;
  return tableData.list.slice(start, end);
});
</script>

<style lang="scss" scoped>
.container {
  margin: 10px;
}
</style>
