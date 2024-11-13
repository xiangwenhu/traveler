// import { uploadAttachment } from "@/api/warningProcess";
// import { UploadProgressEvent, UploadRequestOptions } from "element-plus";
// import { UploadAjaxError } from "element-plus/es/components/upload/src/ajax";

// export interface UploadRequestOptions {
//     action: string;
//     method: string;
//     data: Record<string, string | Blob | [string | Blob, string]>;
//     filename: string;
//     file: File;
//     headers: Headers | Record<string, string | number | null | undefined>;
//     onError: (evt: UploadAjaxError) => void;
//     onProgress: (evt: UploadProgressEvent) => void;
//     onSuccess: (response: any) => void;
//     withCredentials: boolean;
// }

// export function uploadImage(alertId, options: UploadRequestOptions) {
//     const formData = new FormData();
//     // formData.append("file", param.file);
//     formData.append("picture", options.file);

//     uploadAttachment();

//     setTimeout(() => {
//         options.onSuccess({});
//     }, 300);
// }
