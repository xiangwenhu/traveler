<template>
  <el-button type="primary" v-if="visible" @click="onToSyncT" size="large"
    >同步到本地</el-button
  >

  <el-dialog append-to-body v-model="state.dialog" v-if="state.dialog" title="同步文件到本地">
    <div>
      <div v-for="item in refTasks" :key="item.id">
        <div>{{ item.title }}</div>
        <el-progress v-bind="getProgressInfo(item)"></el-progress>
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer" style="text-align: center;">
        <el-button @click="state.dialog = false" type="primary">关闭</el-button>
      </div>
    </template>
  </el-dialog>
</template>


<script setup lang="ts">
import { ResourceItem, TravelItem } from "@/types/service";
import { ensureDirHandle } from "@/utils/fileSystem";
import _ from "lodash";
import { getItems as getResourceItems } from "@/api/resource";
import { ElMessage } from "element-plus";
import {
  isFileSystemApiSupported,
  isIndexedBDSupported,
} from "@/utils/feature";
import { CommonTask } from "@/lib/async-task/types";
import { createAsync } from "@/lib/async-task";
import { reactive, ref } from "vue";

const visible = isIndexedBDSupported() && isFileSystemApiSupported();

const IDB_HANDLE_KEY = "traveler-dir-handle-1";

const props = defineProps<{
  travelItem: TravelItem;
}>();

interface ETaskItem extends ResourceItem {
  progress?: number;
  status?: "ready" | "uploading" | "success" | "error";
  message: string;
}

const progressInfo = reactive<{
  total: number;
  success: number;
}>({
  total: 0,
  success: 0,
});

const state = reactive<{
  dialog: boolean;
}>({
  dialog: false,
});

function getProgressInfo(item: ETaskItem) {
  const percentage = item.status == "success" ? 100 : 0;

  let status: string = "";
  switch (item.status) {
    case "success":
      status = "success";
      break;
    case "error":
      status = "exception";
      break;
  }

  return {
    percentage,
    status,
  };
}

const refTasks = ref<ETaskItem[]>();

async function onToSync() {
  const rootHandle = await ensureDirHandle(IDB_HANDLE_KEY);
  if (!rootHandle) return;

  const dirHandle: FileSystemDirectoryHandle =
    await rootHandle.getDirectoryHandle(props.travelItem.title, {
      create: true,
    });
  const resources = await getResourceList();
  if (!resources) return;
  if (resources.length == 0) return ElMessage.warning("没有需要下载的资源");
  //   const urls = resources?.map((r) => r.url);

  refTasks.value = resources as ETaskItem[];
  batchDownload(refTasks.value, dirHandle);

  state.dialog = true;
}

async function getResourceList() {
  try {
    const { travelItem } = props;
    const res = await getResourceItems({
      travelId: travelItem.id!,
      pageNum: 1,
      pageSize: 1000,
    });
    if (!res || res.code != 0) return;

    const list = res.data?.list || [];

    return list;
  } catch (err) {
    ElMessage.error("查询旅行资源失败");
    return undefined;
  }
}

const onToSyncT = _.throttle(onToSync, 300, {
  leading: true,
  trailing: false,
});

function createTask(item: ETaskItem, dirHandle: FileSystemDirectoryHandle) {
  const fullName = decodeURIComponent(item.url.split("/").pop()!);
  const name = fullName.split("-").pop()!;

  return new Promise(async (resolve, reject) => {
    try {
      const file: Blob = await fetch(item.url.replace("http:", "https:")).then(
        (res) => res.blob()
      );
      const fHandle = await dirHandle.getFileHandle(name, { create: true });
      const writable = await fHandle.createWritable({
        keepExistingData: true,
        mode: "exclusive",
      });
      await writable.write(file);
      await writable.close();
      resolve(true);
    } catch (err) {
      reject(err);
    }
  });
}

async function batchDownload(
  resources: ETaskItem[],
  dirHandle: FileSystemDirectoryHandle
) {
  const tasks: CommonTask<any, ETaskItem>[] = resources.map((item, i) => {
    return {
      task: () => createTask(item, dirHandle),
      name: `download ${item.url}`,
      timeout: 60 * 1000,
      extra: item,
    };
  });

  const taskManager = createAsync(tasks, {
    cancelOnTaskError: true,
    // 因为本地用的是同一个临时目录
    cancelWaitUntilAllTaskCompleted: true,
  });

  const results = await taskManager
    .onTaskError((task: CommonTask<any, ETaskItem>, error: any) => {
      console.error(`Task error: ${task.name}:`, error && error.message);
      task.extra!.status = "error";
      task.extra!.message = error && error.message;
    })
    .onTaskComplete((task: CommonTask<any, ETaskItem>, result) => {
      task.extra!.status = "success";
    })
    .onCancel((msg: string) => {
      console.log("tasks cancelled:", msg);
    })
    .onProgress((progress, workingTasks) => {
      console.log(
        `剩余任务数量:${progress.leftCount}, 进行中的任务数量:${progress.workingTaskCount}, 完成数量：${progress.completedCount}, 错误数量：${progress.errorCount}`
      );
      if (progress.leftCount === 0) {
        console.log("working task", workingTasks);
      }

      progressInfo.success = progress.completedCount;
    })
    .startPromise();

  const errorTasks = results.filter((t) => !t.success);

  if (errorTasks && errorTasks.length > 0) {
    const t = errorTasks[0];
    throw new Error(`${t?.extra.url} 下载失败`);
  }
}
</script>