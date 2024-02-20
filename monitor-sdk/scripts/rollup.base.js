/*
 * @Author: yuxuanli
 * @Date: 2023-07-17 08:48:41
 * @LastEditors: yuxuan-ctrl 
 * @LastEditTime: 2024-02-20 14:03:33
 * @FilePath: \monitor-sdk\scripts\rollup.base.js
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import alias from "@rollup/plugin-alias";
import replace from "@rollup/plugin-replace";
import typescript from "rollup-plugin-typescript2";
import vue from "rollup-plugin-vue";
import babel from "@rollup/plugin-babel";
import clear from "rollup-plugin-clear";
import json from "@rollup/plugin-json";
import resolve from "@rollup/plugin-node-resolve";
import image from "@rollup/plugin-image";
import dts from "rollup-plugin-dts";

const pluginDts = dts();
// const external = ["element-plus", "vue", "lodash-es", "xlsx", "dayjs"];
const pkgName = "monitorZ";
const input = "src/index.ts";
export default [
  {
    input,
    output: [
      {
        dir: `dist/`,
        format: "es",
        name: pkgName,
      },
    ],
    plugins: [
      // babel({
      //   babelHelpers: "runtime",
      //   exclude: "node_modules/**", //依赖文件不编译
      //   extensions: [".js", ".jsx", ".ts", ".tsx"],
      //   presets: ["@babel/preset-env", "@babel/preset-typescript"],
      // }),
      resolve({
        extensions: [".mjs", ".cjs", ".js", ".jsx", ".json"], // Default: [ '.mjs', '.js', '.json', '.node' ]
      }),
      json(),
      // pluginDts,
      clear({
        targets: ["dist"],
      }),
      alias(),
      replace({
        "process.env.NODE_ENV": JSON.stringify(
          process.env.NODE_ENV || "development"
        ),
        preventAssignment: true,
      }),
      nodeResolve({ browser: true }),
      commonjs(),

      vue({
        include: /\.vue$/,
        css: true,
        compileTemplate: true,
      }),
      image(),
      //不要typeScript的校验
      typescript({
        exclude: "src",
        check: false,
        abortOnError: false,
      }),
    ],
  },
  {
    input,
    output: [
      { file: `dist/index.d.cts` },
      { file: `dist/index.d.mts` },
      { file: `dist/index.d.ts` }, // for node10 compatibility
    ],
    plugins: [pluginDts],
  },
];
