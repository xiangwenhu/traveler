import { ConfigEnv, UserConfigExport } from "vite";
import vue from "@vitejs/plugin-vue";
import { viteMockServe } from "vite-plugin-mock";
// import { vitePluginSvg } from "@webxrd/vite-plugin-svg";
import { resolve } from "path";

const pathResolve = (dir: string): any => {
    return resolve(__dirname, ".", dir);
};

const alias: Record<string, string> = {
    "@": pathResolve("src"),
};

/**
 * @description-en vite document address
 * @description-cn vite官网
 * https://vitejs.cn/config/ */
export default ({ command }: ConfigEnv): UserConfigExport => {
    const prodMock = true;
    return {
        base: "./",
        resolve: {
            alias,
        },
        server: {
            port: 3001,
            host: "0.0.0.0",
            open: true,
            proxy: {
                // 代理配置
                // "/api": {
                //     target: "http://localhost:3000",
                //     changeOrigin: true,
                // },
                "/geo": {
                    target: "https://geo.datav.aliyun.com",
                    changeOrigin: true,
                    rewrite(path) {
                        return path.replace("/geo", "");
                    },
                },
            },
        },
        build: {
            rollupOptions: {
                output: {
                    manualChunks: {
                        echarts: ["echarts"],
                    },
                },
            },
        },
        plugins: [
            vue(),
            // viteMockServe({
            //   mockPath: 'mock',
            //   localEnabled: command === 'serve',
            //   prodEnabled: command !== 'serve' && prodMock,
            //   watchFiles: true,
            //   injectCode: `
            //     import { setupProdMockServer } from '../mockProdServer';
            //     setupProdMockServer();
            //   `,
            //   logger: true,
            // }),
            // vitePluginSvg({
            //     // 必要的。必须是绝对路径组成的数组。
            //     iconDirs: [resolve(__dirname, "src/assets/svg")],
            //     // 必要的。入口script
            //     main: resolve(__dirname, "src/main.js"),
            //     symbolIdFormat: "icon-[name]",
            // }),
        ],
        css: {
            postcss: {
                plugins: [
                    {
                        postcssPlugin: "internal:charset-removal",
                        AtRule: {
                            charset: (atRule) => {
                                if (atRule.name === "charset") {
                                    atRule.remove();
                                }
                            },
                        },
                    },
                ],
            },
            preprocessorOptions: {
                scss: {
                    // api:'modern-compiler'
                    api: 'modern-compiler'
                }
            }
        },
    };
};
