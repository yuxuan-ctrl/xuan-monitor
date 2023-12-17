import { type ConfigEnv, type UserConfigExport, loadEnv } from "vite";
import path, { resolve } from "path";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import Components from "unplugin-vue-components/vite";

// postCss插件

/** 配置项文档：https://cn.vitejs.dev/config */
export default (configEnv: ConfigEnv): UserConfigExport => {
  const viteEnv = loadEnv(configEnv.mode, process.cwd()) as ImportMetaEnv;

  const { VITE_PUBLIC_PATH } = viteEnv;
  return {
    /** 打包时根据实际情况修改 base */
    base: VITE_PUBLIC_PATH,
    resolve: {
      alias: {
        /** @ 符号指向 src 目录 */
        "@": resolve(__dirname, "./src"),
      },
    },
    server: {
      /** 是否开启 HTTPS */
      https: false,
      /** 设置 host: true 才可以使用 Network 的形式，以 IP 访问项目 */
      host: true, // host: "0.0.0.0"
      /** 端口号 */
      port: 22000,
      /** 是否自动打开浏览器 */
      open: false,
      /** 跨域设置允许 */
      cors: true,
      /** 端口被占用时，是否直接退出 */
      strictPort: false,
      /** 接口代理 */
      proxy: {},
    },
    build: {
      /** 消除打包大小超过 500kb 警告 */
      chunkSizeWarningLimit: 2000,
      /** Vite 2.6.x 以上需要配置 minify: "terser", terserOptions 才能生效 */
      minify: "terser",
      /** 在打包代码时移除 console.log、debugger 和 注释 */
      terserOptions: {
        compress: {
          drop_console: false,
          drop_debugger: true,
          pure_funcs: ["console.log"],
        },
        format: {
          /** 删除注释 */
          comments: false,
        },
      },
      /** 区分目录 */
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            // 其他依赖按照各自的名字进行分块
            if (id.includes(".pnpm")) {
              return id
                .toString()
                .split(".pnpm/")[1]
                .split("node_modules/")[1]
                .split("/")[0]
                .toString();
            } else if (id.includes("node_modules") && !id.includes("@vue")) {
              return id
                .toString()
                .split("node_modules/")[1]
                .split("/")[0]
                .toString();
            }
            // Vue文件代码合在一起
            else if (
              id.includes("@vue" || "pinia") &&
              id.includes("node_modules")
            ) {
              console.log(id, "---------vue");
              return "vue-ventor";
            }
          },
          // 用于命名代码拆分时创建的共享块的输出命名
          chunkFileNames: "static/js/[name]-[hash].js",
          // 用于从入口点创建的块的打包输出格式[name]表示文件名,[hash]表示该文件内容hash值
          entryFileNames: "static/js/[name]-[hash].js",
          // 用于输出静态资源的命名，[ext]表示文件扩展名
          assetFileNames: "static/[ext]/[name]-[hash].[ext]",
        },
      },
      /** 打包后静态资源目录 */
      assetsDir: "static",
    },
    css: {
      postcss: {
        // plugins: [postcssPresetEnv(), tailwindcss()],
      },
    },
    /** Vite 插件 */
    plugins: [
      vue(),

      AutoImport({
        imports: ["vue", "vue-router"],
        ignore: ["h"],
        dts: "src/auto-imports.d.ts",
        /** 自动按需导入 Element Plus 相关函数，比如 ElMessage */
        resolvers: [ElementPlusResolver()],
        // /** 根据自动按需导入的相关 API，生成 .eslintrc-auto-import.json 文件供 Eslint 识别 */
        // eslintrc: {
        //   enabled: false, // 默认 false
        //   filepath: "./types/.eslintrc-auto-import.json", // 默认 "./.eslintrc-auto-import.json"
        //   globalsPropValue: true, // 默认 true (true | false | "readonly" | "readable" | "writable" | "writeable")
        // },
      }),
      /** 对代码进行gzip压缩 */
      // Compression({
      //   threshold: 51200,
      // }),

      Components({
        dts: "./types/components.d.ts",
        /** 自动按需导入 Element Plus 组件 */
        resolvers: [ElementPlusResolver()],
        directoryAsNamespace: true,
      }),
    ],
  };
};
