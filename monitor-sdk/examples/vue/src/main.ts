import { createApp, App as AppInstance } from "vue";
import router from "./router";
import App from "./App.vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import Monitor from "../../../src/core/monitor";
// ----------分割线---umd模式------两种模式任选其一-------------- //
let app: AppInstance | null = null;
// 将渲染操作放入 mount 函数
function mount() {
  const monitor = new Monitor("lyx", "token");

  app = createApp(App);
  app.use(ElementPlus).use(router).mount("#vite-app");
}
mount();
