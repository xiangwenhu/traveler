<template>
    <el-dialog
      v-model="layer.show"
      :title="layer.title"
      :width="layer.width"
      center
      v-if="layer.show"
      @close="close"
    >
      <slot></slot>
      <template #footer v-if="layer.showButton">
        <div>
          <el-button type="primary" @click="confirm"> {{layer.confirmText || '确认'}}</el-button>
          <el-button @click="close">取消</el-button>
        </div>
      </template>
    </el-dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export interface LayerInterface {
  show: boolean;
  title: string;
  showButton?: boolean;
  width?: string;
  draggable?: boolean;
  [propName: string]: any;
  confirmText?: string;
}
export interface LayerType {
  close: Function
}
export default defineComponent({
  props: {
    layer: {
      type: Object,
      default: () => {
        return {
          show: false,
          title: '',
          showButton: false,
        }
      },
      required: true
    }
  },
  setup(props, ctx) {
    function confirm() {
      ctx.emit('confirm')
    }
    function close() {
      props.layer.show = false;
      ctx.emit("close")
    }
    return {
      confirm,
      close
    }
  }
})
</script>

<style lang="scss" scoped>
  
</style>