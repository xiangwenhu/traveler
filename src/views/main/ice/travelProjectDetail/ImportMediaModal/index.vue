<template>
  <el-dialog
    v-model="dialogVisible"
    title="选择媒资导入"
    :width="720"
    append-to-body
    @close="onClose"
    :close-on-click-modal="false"
    id="dialog-ice-project"
  >
    <el-scrollbar height="80vh" id="ice-project-scrollbar">
      <el-tabs v-model="state.activeName" class="demo-tabs" style="height: 100%;">
        <el-tab-pane label="本地上传" name="local">
            <LocalMediaUpload v-if="state.activeName == 'local'" @submit="onSubmit" :project-id="projectId" @close="onClose"/>
        </el-tab-pane>
        <el-tab-pane label="ICE媒体资源" name="ice">
            <SearchICEMedia v-if="state.activeName == 'ice'" @submit="onSubmit"  @close="onClose"/>
        </el-tab-pane>
      </el-tabs>
    </el-scrollbar>

    <!-- <template #footer>
        <div class="dialog-footer">
          <el-button @click="onClose">关闭</el-button>
          <el-button type="primary" @click="handleSubmit">导入 </el-button>
        </div>
      </template> -->
  </el-dialog>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue";
const dialogVisible = ref(true);
const emits = defineEmits(["close", "submit"]);
import LocalMediaUpload from "./LocalMediaUpload.vue";
import SearchICEMedia from "./SearchICEMedia.vue";


// const loading = ref(true)


const props = defineProps<{
  projectId: string
}>()

const state = reactive({
  activeName: "local"
})


function onClose() {
  emits("close");
}

function onSubmit(data: any) {
  emits("submit", data);
}

</script>
  