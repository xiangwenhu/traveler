<template>
  <div class="bottom-back" @click="onBack">
    <el-icon size="larger" style="font-size: 30px">
      <Back />
    </el-icon>
    返回
  </div>
</template>













<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

function onBack() {
  router.back();
}
</script>


<style lang="scss" scoped>
.bottom-back {
  position: fixed;
  bottom: 0;
  height: 30px;
  left: 0;
  right: 0;
  font-size: 22px;
  line-height: 30px;
  letter-spacing: 6px;
  background-color: #8b8b7a;
  color: #fff;
  display: none;
}

.mobile {
  .bottom-back {
    display: block;
  }
}
</style>