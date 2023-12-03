import { SDKConfigType } from "../types";
import BaseMonitorSDK from "./BaseMonitorSDK";

export default class VueMonitorSDK extends BaseMonitorSDK {
  app: any = null;
  constructor(config: SDKConfigType, app: any) {
    super(config);
    this.app = app;
    this.listenPageVue();
  }

  // 重写BaseSDK的listenPage方法
  listenPage() {
    return;
  }

  /**
   * @description: 监听页面变化
   */
  listenPageVue() {
    let pageShowTime = 0;

    this.app.config.errorHandler = (err: any, vm: any, info: any) => {
      console.log("errorHandle", err, vm, info);
      // err，错误对象
      // vm，发生错误的组件实例
      // info，Vue特定的错误信息，例如错误发生的生命周期、错误发生的事件
    };

    window.addEventListener("pageshow", () => {
      pageShowTime = performance.now();
      // 页面性能指标上报
      const data = this.getPerformance();
      console.log("page show");
      this.performanceReport({ data });
      // 执行 onPageShow
      this.onPageShow();
    });

    window.addEventListener("pagehide", () => {
      // 记录用户在页面停留时间
      this.timeOnPage = performance.now() - pageShowTime;
      // 刷新队列前执行 onPagesHide
      this.onPagesHide();
    });

    // 监听Vue路由的replace事件
    window.addEventListener("replaceState", () => {
      const data = this.getPvUv();
      this.report({ data });
    });

    // 监听Vue的push事件和React的路由切换事件
    window.addEventListener("pushState", () => {
      const data = this.getPvUv();
      this.actionReport({ data });
    });

    // 监听页面错误事件
    window.onerror = function (msg, _url, line, col, error) {
      console.log("onerror");
      console.log(
        "🚀 ~ file: reportSDK.ts:112 ~ EasyAgentSDK ~ listenPage ~ msg:",
        msg
      );
    };

    // 监听页面错误事件
    window.addEventListener(
      "error",
      (err) => {
        const errorInfo = {
          errFileName: err.filename,
          message: err.error.message,
        };
        this.errorReport({
          errorInfo,
        }).then(() => this.flushQueue("error"));
      },
      true
    );

    // 监听页面抛出的异常（Promise抛出异常未用catch处理，即Promise.reject()）
    window.addEventListener(
      "unhandledrejection",
      () => {
        return console.log("unhandledrejection");
      },
      true
    );

    // 监听页面抛出的异常（Promise抛出异常已经用catch处理，即Promise.reject().catch()）
    window.addEventListener(
      "rejectionhandled",
      (event) => {
        console.log("rejection handled"); // 1秒后打印"rejection handled"
      },
      true
    );
  }
}
