/*
 * @Author: yuxuan-ctrl 
 * @Date: 2023-12-18 09:17:00
 * @LastEditors: yuxuan-ctrl 
 * @LastEditTime: 2024-02-07 13:53:34
 * @FilePath: \monitor-sdk\examples\vue\src\main.ts
 * @Description: 
 * 
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved. 
 */
import { createApp, App as AppInstance } from "vue";
import router from "./router";
import App from "./App.vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import {Monitor} from "../../../src/core";
// ----------分割线---umd模式------两种模式任选其一-------------- //
let app: AppInstance | null = null;
// 将渲染操作放入 mount 函数
function mount() {
  // Monitor.start(window);
  const monitor = new Monitor("lyx", "token");
  monitor.start(window);

  app = createApp(App);
  app.use(ElementPlus).use(router).mount("#vite-app");
}
mount();
