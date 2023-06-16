/* eslint-disable no-restricted-globals */
let SDK = null; // EasyAgentSDK 实例对象
const QUEUE = []; // 任务队列
const NOOP = (v) => v;

// 通过 web-vitals 页面性能指标
const reportWebVitals = (onPerfEntry) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import("web-vitals").then(({getCLS, getFID, getFCP, getLCP, getTTFB}) => {
      getCLS(onPerfEntry); // 布局偏移量
      getFID(onPerfEntry); // 首次输入延迟时间
      getFCP(onPerfEntry); // 首次内容渲染时间
      getLCP(onPerfEntry); // 首次最大内容渲染时间
      getTTFB(onPerfEntry); // 首个字节到达时间
    });
  }
};

export default class EasyAgentSDK {
  appId = "";
  baseUrl = "";
  timeOnPage = 0;
  config = {};
  onPageShow = null;
  onPagesHide = null;
  // 多个监听事件，只发送一次
  flag = null;
  constructor(options: any = {}) {
    if (SDK) return;

    SDK = this;
    this.appId = options.appId;
    this.baseUrl = options.baseUrl || window.location.origin;
    this.onPageShow = options.onPageShow || NOOP;
    this.onPagesHide = options.onPagesHide || NOOP;
    history.pushState = this.bindEventListener("pushState");
    history.replaceState = this.bindEventListener("replaceState");
    // 初始化监听页面变化
    this.listenPage();
  }

  // 设置 config
  setConfig(config) {
    this.config = config;
  }

  // 刷新任务队列
  flushQueue() {
    Promise.resolve().then(() => {
      QUEUE.forEach((fn) => fn());
      console.log(
        "🚀 ~ file: reportSDK.ts:50 ~ EasyAgentSDK ~ Promise.resolve ~ QUEUE:",
        QUEUE
      );
      QUEUE.length = 0;
    });
  }

  // 监听页面变化
  listenPage() {
    let pageShowTime = 0;
    window.addEventListener("pageshow", () => {
      pageShowTime = performance.now();
      // 页面性能指标上报
      reportWebVitals((data) => {
        this.debounceReport({data});
        // this.performanceReport({data});
      });
      // 执行 onPageShow
      this.onPageShow();
    });

    window.addEventListener("pagehide", () => {
      // 记录用户在页面停留时间
      this.timeOnPage = performance.now() - pageShowTime;
      // 刷新队列前执行 onPagesHide
      this.onPagesHide();
      // 刷新任务队列
      this.flushQueue();
    });
    // 监听Vue路由的replace事件
    window.addEventListener("replaceState", () => {
      this.debounceReport();
      return console.log("replaceState");
    });
    // 监听Vue的push事件和React的路由切换事件
    window.addEventListener("pushState", () => {
      console.log("pushState");
      this.getPvUv();
      this.debounceReport();
    });
    // 监听页面刷新或首次加载事件
    window.addEventListener("load", () => {
      this.debounceReport();
      return console.log("load");
    });
    // 监听页面错误事件
    window.addEventListener("error", () => {
      this.debounceReport();
      return console.log("error");
    });
    // 监听页面抛出的异常
    window.addEventListener("unhandledrejection", () => {
      return console.log("unhandledrejection");
    });
  }

  //绑定replaceState事件
  bindEventListener(type) {
    const historyEvent = history[type];
    return function () {
      const newEvent = historyEvent.apply(this, arguments);
      const e: any = new Event(type);
      e.arguments = arguments;
      window.dispatchEvent(e);
      return newEvent;
    };
  }

  // Json 转 FormData
  json2FormData(data) {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      let value = null;
      if (value instanceof Blob) {
        value = data[key];
      } else {
        value = JSON.stringify(data[key]);
      }
      formData.append(key, value);
    });

    return formData;
  }

  // 获取页面PV、UV信息
  getPvUv() {
    console.log(window.location.href);
    console.log(performance.getEntriesByType("resource"));
    const resourceList = performance
      .getEntriesByType("resource")
      .map((resource: any) => {
        return {
          type: resource.initiatorType,
          duration: resource.duration,
          decodedBodySize: resource.decodedBodySize,
          nextHopProtocol: resource.nextHopProtocol,
          name: resource.name,
        };
      });

    const timing = performance.timing;
    const performanceMetrics = {
      dnst: timing.domainLookupEnd - timing.domainLookupStart || 0,
      tcpt: timing.connectEnd - timing.connectStart || 0,
      wit: timing.responseStart - timing.navigationStart || 0,
      domt: timing.domContentLoadedEventEnd - timing.navigationStart || 0,
      lodt: timing.loadEventEnd - timing.navigationStart || 0,
      radt: timing.fetchStart - timing.navigationStart || 0,
      rdit: timing.redirectEnd - timing.redirectStart || 0,
      uodt: timing.unloadEventEnd - timing.unloadEventStart || 0,
      reqt: timing.responseEnd - timing.requestStart || 0,
      andt: timing.domComplete - timing.domInteractive || 0,
    };
    reportWebVitals((data) => {
      Reflect.set(performanceMetrics, data.name, data.value);
    });
    console.log(
      "🚀 ~ file: reportSDK.ts:167 ~ EasyAgentSDK ~ reportWebVitals ~ performanceMetrics:",
      performanceMetrics
    );
    return {
      url: window.location.href,
      resourceList,
      performanceMetrics,
    };
  }
  // 监听多次，只发送一次请求
  debounceReport(data = {}) {
    if (this.flag) {
      clearTimeout(this.flag);
    }
    console.log(this.flag);
    this.flag = setTimeout(() => {
      this.report({data});
    }, 1000);
  }

  // 自定义上报类型
  report(config) {
    console.log("report");
    QUEUE.push(() => {
      const formData = this.json2FormData({
        ...this.config,
        ...config,
        time: new Date().toLocaleString(),
        appId: this.appId,
        pageUrl: window.location.href,
      });
      navigator.sendBeacon(`${this.baseUrl}${config.url || ""}`, formData);
    });
  }

  // 用户行为上报
  actionReport(config) {
    this.report({
      ...config,
      type: "action",
    });
  }

  // 网络状况上报
  networkReport(config) {
    this.report({
      ...config,
      type: "network",
    });
  }

  // 页面性能指标上报
  performanceReport(config) {
    this.report({
      ...config,
      type: "performance",
    });
  }

  // 错误警告上报
  errorReport(config) {
    this.report({
      ...config,
      type: "error",
    });
  }
}
