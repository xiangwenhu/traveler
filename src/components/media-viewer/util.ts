import { imageViewerEmits, imageViewerProps } from "element-plus";
import { PropType } from "vue";

const { urlList, ...restViewerProps } = imageViewerProps;
export const viewerProps = {
  ...restViewerProps,
  urlList: {
    type: Object as PropType<{ title: string; url: string }[]>,
    required: true,
    default() {
      return [];
    },
  },
};