import { getSTSToken } from "@/api/ali";
import OSS from "ali-oss";

let client: OSS | undefined;

export async function getCredentials(): Promise<OSS.Credentials> {
    const res = await getSTSToken();
    return res.data!
}

async function getClient() {
    const credentials = await getCredentials();
    client = new OSS({
        // yourRegion填写Bucket所在地域。以华东1（杭州）为例，yourRegion填写为oss-cn-hangzhou。
        region: "oss-cn-beijing",
        // 从STS服务获取的临时访问密钥（AccessKey ID和AccessKey Secret）。
        accessKeyId: credentials.AccessKeyId,
        accessKeySecret: credentials.AccessKeySecret,
        // 从STS服务获取的安全令牌（SecurityToken）。
        stsToken: credentials.SecurityToken,
        // 填写Bucket名称。
        bucket: "traveler-traveler",
        async refreshSTSToken() {
            const credentials = await getCredentials();
            return {
                accessKeyId: credentials.AccessKeyId,
                accessKeySecret: credentials.AccessKeySecret,
                stsToken: credentials.SecurityToken
            };
        },
    });

    return client;
}


export function createOSSClient() {
    getClient();
}

export function getOSSClient() {
    return client;
};