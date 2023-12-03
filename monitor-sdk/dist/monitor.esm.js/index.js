/**
 * @description: Json 转 FormData
 * @param {*} data
 */
function json2FormData(data) {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
        let value = null;
        if (value instanceof Blob) {
            value = data[key];
        }
        else {
            value = JSON.stringify(data[key]);
        }
        formData.append(key, value);
    });
    return formData;
}
/**
 * @description: 生成uuid
 * @return {*}
 */
function createUUid() {
    let now = new Date().getTime();
    const uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (char) => {
        const rand = (now + Math.random() * 16) % 16 | 0;
        now = Math.floor(now / 16);
        return (char === "x" ? rand : (rand & 0x3) | 0x8).toString(16);
    });
    return uuid;
}
function sendBeacon(params, formData) {
    return new Promise((resolve, reject) => {
        const result = navigator.sendBeacon(`/${params.baseUrl}/monitor/report`, formData);
        result && resolve(result);
        !result && reject(result);
    });
}

/**
 * @description: 事件队列管理器
 */
class EventQueueManager {
    QUEUE = [];
    type;
    isSingle = true;
    constructor(config) {
        this.type = config?.type;
        this.isSingle = !(this.type && this.type === "mutiple");
        if (this.isSingle) {
            // 单例模式，一个window对象下只能有一个队列管理器
            if (window.eventQueue) {
                this.QUEUE = window.eventQueue;
                return;
            }
            window.eventQueue = this.QUEUE;
        }
    }
    /**
     * @description: 添加事件
     * @param {T} event
     * @return {*}
     */
    push(event) {
        const baseEvent = this.createBaseEvent();
        this.QUEUE.push({
            ...baseEvent,
            ...event,
        });
        return this.QUEUE;
    }
    /**
     * @description: 清除事件队列
     */
    clearQueue() {
        this.QUEUE = [];
        return this.QUEUE;
    }
    /**
     * @description: 创建基本事件
     */
    createBaseEvent(config) {
        const baseEvent = {
            timestamp: new Date().getTime(),
            uuid: createUUid(),
            pageUrl: window.location.href,
            type: "event",
        };
        // 如果传来config，就初始化默认的事件
        if (config) {
            Object.assign(baseEvent, config);
        }
        return baseEvent;
    }
    async trigger(callback) {
        try {
            this.QUEUE.forEach((item) => {
                callback(item);
            });
            return true;
        }
        catch (err) {
            return err;
        }
    }
}

let SDK = null; // EasyAgentSDK 实例对象
const reportWebVitals = (onPerfEntry) => {
    if (onPerfEntry && onPerfEntry instanceof Function) {
        import('./web-vitals-0ca3320c.js').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
            console.log();
            getCLS(onPerfEntry); // 布局偏移量
            getFID(onPerfEntry); // 首次输入延迟时间
            getFCP(onPerfEntry); // 首次内容渲染时间
            getLCP(onPerfEntry); // 首次最大内容渲染时间
            getTTFB(onPerfEntry); // 首个字节到达时间
        });
    }
};
class BaseMonitorSDK {
    appId = "";
    baseUrl = "";
    timeOnPage = 0;
    config = {};
    onPageShow = function () { };
    onPagesHide = function () { };
    eventQueueManager = new EventQueueManager();
    QUEUE = this.eventQueueManager.QUEUE;
    scheduleTimer = null;
    time = 60000;
    // 多个监听事件，只发送一次
    flag = null;
    constructor(config) {
        if (SDK)
            return;
        SDK = this;
        const { appId, baseUrl, onPageShow, onPagesHide } = config;
        // 初始化事件队列管理器
        this.eventQueueManager = new EventQueueManager();
        this.QUEUE = this.eventQueueManager.QUEUE;
        this.appId = appId;
        this.baseUrl = baseUrl || window.location.origin;
        this.onPageShow = onPageShow;
        this.onPagesHide = onPagesHide;
        this.time = config?.time;
        history.pushState = this.bindEventListener("pushState");
        history.replaceState = this.bindEventListener("replaceState");
        // 初始化监听页面变化
        this.listenPage();
        this.initSchedulers();
    }
    initSchedulers() {
        // 定时发送 PV/UV 监控数据
        this.scheduleTimer = setInterval(() => {
            this.flushQueue("pvuv");
        }, 10000); // 60秒发送一次，可以根据需求调整时间间隔
    }
    // 设置 config
    setConfig(config) {
        this.config = config;
    }
    /**
     * @description: 刷新任务队列
     */
    async flushQueue(type) {
        if (this.QUEUE.length === 0) {
            return Promise.resolve([]);
        }
        // 请求队列
        const EventList = this.QUEUE.map((event) => {
            return { ...event };
            // 上报事件
        });
        const formData = json2FormData({
            ...this.config,
            EventList,
            time: new Date().toLocaleString(),
            appId: this.appId,
            pageUrl: window.location.href,
        });
        const status = await sendBeacon({ baseUrl: this.baseUrl }, formData);
        status && this.eventQueueManager.clearQueue();
    }
    /**
     * @description: 监听页面变化
     */
    listenPage() {
        let pageShowTime = 0;
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
            console.log("🚀 ~ file: reportSDK.ts:112 ~ EasyAgentSDK ~ listenPage ~ msg:", msg);
        };
        // 监听页面错误事件
        window.addEventListener("error", (err) => {
            const errorInfo = {
                errFileName: err.filename,
                message: err.error.message,
            };
            this.errorReport({
                errorInfo,
            }).then(() => this.flushQueue("error"));
        }, true);
        // 监听页面抛出的异常（Promise抛出异常未用catch处理，即Promise.reject()）
        window.addEventListener("unhandledrejection", () => {
            return console.log("unhandledrejection");
        }, true);
        // 监听页面抛出的异常（Promise抛出异常已经用catch处理，即Promise.reject().catch()）
        window.addEventListener("rejectionhandled", (event) => {
            console.log("rejection handled"); // 1秒后打印"rejection handled"
        }, true);
    }
    /**
     * @description: 绑定replaceState事件
     * @param {*} type
     */
    bindEventListener(type) {
        const historyEvent = history[type];
        return function () {
            const newEvent = historyEvent.apply(this, arguments);
            const e = new Event(type);
            e.arguments = arguments;
            window.dispatchEvent(e);
            return newEvent;
        };
    }
    /**
     *
     * @description 获取页面PV、UV信息
     * @return {*}
     * @memberof EasyAgentSDK
     */
    getPvUv() {
        console.log(window.location.href);
        console.log(performance.getEntriesByType("resource"));
        const resourceList = performance
            .getEntriesByType("resource")
            .map((resource) => {
            return {
                type: resource.initiatorType,
                duration: resource.duration,
                decodedBodySize: resource.decodedBodySize,
                nextHopProtocol: resource.nextHopProtocol,
                name: resource.name,
            };
        });
        const performanceMetrics = this.getPerformance();
        return {
            url: window.location.href,
            resourceList,
            performanceMetrics,
        };
    }
    /**
     *
     * @description 获取Performance（性能）参数
     * @memberof EasyAgentSDK
     */
    async getPerformance() {
        // 兼容getEntries
        const performanceMetrics = performance.getEntries
            ? this.getPerformanceByEntries()
            : this.getPerformanceByTiming();
        reportWebVitals((data) => {
            Reflect.set(performanceMetrics, data.name, data.value);
        });
        return performanceMetrics;
    }
    getPerformanceByTiming() {
        const { startTime, domContentLoadedEventEnd, loadEventEnd, domComplete, domInteractive, fetchStart, redirectEnd, redirectStart, domainLookupEnd, domainLookupStart, unloadEventEnd, unloadEventStart, connectStart, connectEnd, responseEnd, requestStart, responseStart, } = performance.getEntries()[0];
        return {
            dnst: domainLookupEnd - domainLookupStart || 0,
            tcpt: connectEnd - connectStart || 0,
            wit: responseStart - startTime || 0,
            domt: domContentLoadedEventEnd - startTime || 0,
            lodt: loadEventEnd - startTime || 0,
            radt: fetchStart - startTime || 0,
            rdit: redirectEnd - redirectStart || 0,
            uodt: unloadEventEnd - unloadEventStart || 0,
            reqt: responseEnd - requestStart || 0,
            andt: domComplete - domInteractive || 0,
        };
    }
    getPerformanceByEntries() {
        const { domainLookupEnd, domainLookupStart, connectEnd, connectStart, responseStart, navigationStart, domContentLoadedEventEnd, loadEventEnd, fetchStart, redirectEnd, redirectStart, unloadEventEnd, unloadEventStart, responseEnd, requestStart, domComplete, domInteractive, } = performance.timing;
        return {
            dnst: domainLookupEnd - domainLookupStart || 0,
            tcpt: connectEnd - connectStart || 0,
            wit: responseStart - navigationStart || 0,
            domt: domContentLoadedEventEnd - navigationStart || 0,
            lodt: loadEventEnd - navigationStart || 0,
            radt: fetchStart - navigationStart || 0,
            rdit: redirectEnd - redirectStart || 0,
            uodt: unloadEventEnd - unloadEventStart || 0,
            reqt: responseEnd - requestStart || 0,
            andt: domComplete - domInteractive || 0,
        };
    }
    /**
     *
     * @description 触发任何一个report时间开始计时，只发送一次请求，清空队列
     * @memberof EasyAgentSDK
     */
    debounceReport(type) {
        if (this.flag) {
            clearTimeout(this.flag);
        }
        console.log(this.flag);
        this.flag = setTimeout(() => {
            this.flushQueue(type);
        }, 1000);
    }
    /**
     *
     *
     * @param {*} config // 上报的数据格式类似{data}
     * @memberof EasyAgentSDK
     * @description 自定义上报类型
     */
    report(config) {
        this.eventQueueManager.push(config);
    }
    // 用户行为上报
    async actionReport(config) {
        this.report({
            ...config,
            type: "action",
        });
    }
    // 网络状况上报
    async networkReport(config) {
        this.report({
            ...config,
            type: "error",
        });
    }
    // 页面性能指标上报
    async performanceReport(config) {
        this.report({
            ...config,
            type: "performance",
        });
    }
    // 错误警告上报
    async errorReport(config) {
        this.report({
            ...config,
            type: "error",
        });
    }
}

class VueMonitorSDK extends BaseMonitorSDK {
    app = null;
    constructor(config, app) {
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
        this.app.config.errorHandler = (err, vm, info) => {
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
            console.log("🚀 ~ file: reportSDK.ts:112 ~ EasyAgentSDK ~ listenPage ~ msg:", msg);
        };
        // 监听页面错误事件
        window.addEventListener("error", (err) => {
            const errorInfo = {
                errFileName: err.filename,
                message: err.error.message,
            };
            this.errorReport({
                errorInfo,
            }).then(() => this.flushQueue("error"));
        }, true);
        // 监听页面抛出的异常（Promise抛出异常未用catch处理，即Promise.reject()）
        window.addEventListener("unhandledrejection", () => {
            return console.log("unhandledrejection");
        }, true);
        // 监听页面抛出的异常（Promise抛出异常已经用catch处理，即Promise.reject().catch()）
        window.addEventListener("rejectionhandled", (event) => {
            console.log("rejection handled"); // 1秒后打印"rejection handled"
        }, true);
    }
}

export { BaseMonitorSDK, VueMonitorSDK };
