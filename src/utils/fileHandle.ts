import * as xlsx from "xlsx";
import { ElMessage } from "element-plus";

//** input框上传文件 */
export function handleExcel (e: any, callBack: Function){
    const files = e.target.files;
    if (files.length <= 0) {
        return false;
    } else if (!/\.(xls|xlsx)$/.test(files[0].name.toLowerCase())) {
        ElMessage.error("请上传excel类型文件")
        return false;
    }
    // 读取表格数据
    const fileReader = new FileReader();
    fileReader.onload = (ev: any) => {
        const workbook = xlsx.read(ev.target.result, {
            type: "binary",
            cellDates: true,
        });
        const wsName = workbook.SheetNames[0];
        const ws = xlsx.utils.sheet_to_json(workbook.Sheets[wsName]);
        
        callBack(ws); //处理数据
    };
   
    fileReader.readAsBinaryString(files[0]);
};

// 获取文件格式
export function getFileType (file: File) {
    return file.name.split(".").pop();
};