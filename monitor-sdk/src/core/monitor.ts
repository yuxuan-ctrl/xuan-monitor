import PageViewTracker from "./PageViewTracker";
import UvTracker from "./UserViewTracker";
import ErrorTracker from "./ErrorTracker";
import MessageQueueDBWrapper, {IMessage} from "./Message";
import {
  wrapHistory,
  wrapFetch,
  wrapSetTimeout,
  wrapPromise,
  wrapXMLHttpRequest,
} from "../utils";
import {Listener} from "../decorator";
import "reflect-metadata";

export interface IPVData {
  title?: string;
  url?: string;
  userAgent?: string;
  platform?: string;
  screenResolution?: {
    width: number;
    height: number;
  };
  timestamp?: number;
  referrer?: string | null;
}

export interface UVData {
  uniqueKey: string;
  timestamp: number;
  userAgent?: string;
  language?: string;
  timeZoneOffset?: number;
  screenResolution?: {
    width: number;
    height: number;
  };
}
export default class Monitor {
  public pvTracker: PageViewTracker;
  public uvTracker: UvTracker;
  public errorTracker: ErrorTracker;
  public uvData: UVData;
  public pvData: IPVData;
  public stayDuration: number;
  public originalPushState: (
    data: any,
    unused: string,
    url?: string | URL
  ) => void;
  public originalReplaceState: (
    data: any,
    unused: string,
    url?: string | URL
  ) => void;
  static instance: Monitor | null = null;
  public Events: Object = {};
  originalFetch: any;

  constructor(userId?: string, customKey?: string) {
    this.pvTracker = new PageViewTracker(userId, this);
    this.uvTracker = new UvTracker(customKey, this);
    this.errorTracker = new ErrorTracker();
  }

  initializeEventListeners() {
    const methods = Object.getOwnPropertyNames(Monitor.prototype).filter(
      (methodName) => methodName !== "constructor"
    );
    methods.forEach((methodName) => {
      const method = Monitor.prototype[methodName].bind(this);
      const eventConfig = Reflect.getMetadata(
        "eventConfig",
        Monitor.prototype,
        methodName
      );
      if (eventConfig && typeof method === "function") {
        if (Array.isArray(eventConfig)) {
          eventConfig.forEach((eventName) => {
            this.Events[eventName] = method;
            window.addEventListener(eventName, method);
          });
        } else {
          window.addEventListener(eventConfig, method);
          this.Events[eventConfig] = method;
        }
      }
    });
  }

  startTracking() {
    this.initializeEventListeners();
    this.setGlobalProxy();
    this.uvTracker.initRefreshInterval(this.sendMessage);
  }

  @Listener("popstate")
  public async onPopState(event: PopStateEvent) {
    await this.pvTracker.trackPageView("popstate", event);
  }

  @Listener(["load", "pageshow"])
  public async onLoad(event: Event) {
    this.uvData = await this.uvTracker.trackUv();
    await this.pvTracker.trackPageView("load", event);
  }

  @Listener("beforeunload")
  public onBeforeUnload(event: BeforeUnloadEvent) {
    // 在用户离开页面之前，计算并发送停留时间
    this.pvTracker.calculateDuration();
  }

  @Listener("visibilitychange")
  public onVisablechange(event: BeforeUnloadEvent) {
    if (document.visibilityState === "hidden") {
      this.pvTracker.calculateDuration();
    } else {
      this.pvTracker.trackPageView("load", event);
    }
  }

  @Listener("error")
  public async onError(error: Error) {
    console.log(
      "🚀 ~ file: monitor.ts:125 ~ Monitor ~ onError ~ error:",
      error
    );
    this.reportError(error);
  }

  @Listener("unhandledrejection")
  public async onUnhandlerejection(error: {
    type: "unhandledrejection";
    promise: Promise<any>;
    reason: Error;
  }) {
    this.reportError(error.reason);
  }

  stopTracking() {
    this.removeEventListeners();
    this.uvTracker.stopRefreshInterval();
  }

  private setGlobalProxy() {
    wrapHistory(window.history, this.onPageChange.bind(this));

    // 创建一个新的 fetch 函数
    if (typeof window.fetch === "function") {
      const originalFetch = window.fetch;
      window.fetch = wrapFetch(originalFetch, this.reportError.bind(this));
    }

    if (typeof window.setTimeout === "function") {
      const originalSetTimeout = window.setTimeout;
      window.setTimeout = wrapSetTimeout(
        originalSetTimeout,
        this.reportError.bind(this)
      ) as any;
    }

    if (typeof window.Promise === "function") {
      const OriginalPromise = window.Promise;
      window.Promise = wrapPromise(
        OriginalPromise,
        this.reportError.bind(this)
      ) as any;
    }

    if (typeof window.XMLHttpRequest === "function") {
      const OriginalXMLHttpRequest = window.XMLHttpRequest;
      window.XMLHttpRequest = wrapXMLHttpRequest(
        OriginalXMLHttpRequest,
        this.reportError.bind(this)
      ) as any;
    }
  }

  public removeEventListeners() {
    Object.keys(this.Events).forEach((eventName) => {
      window.removeEventListener(eventName, this.Events[eventName]);
    });
  }

  private async onPageChange(method: string, ...args: any[]) {
    await this.pvTracker.calculateDuration();
    await this.pvTracker.trackPageView(method, ...args);
    if (this.pvData?.url) {
      const message: IMessage = {
        data: {...this.pvData, ...this.uvData},
        timestamp: Date.now(),
        name: "pv_uv_data",
        userId: this.pvTracker.userId,
      };
      this.sendMessage(message);
    }
    this.updateDurationMessage();
  }

  public async sendMessage(message) {
    MessageQueueDBWrapper.getInstance({
      dbName: "monitorxq",
      dbVersion: 1,
      storeName: "monitor_data",
    }).enqueue(message);
  }

  public async reportError(error: Error) {
    const errorInfo = await this.errorTracker.collectError(error);
    console.log(
      "🚀 ~ file: monitor.ts:207 ~ Monitor ~ reportError ~ errorInfo:",
      errorInfo
    );
    this.sendMessage(errorInfo);
  }

  public updateDurationMessage() {
    console.log(this.stayDuration);
  }
}
