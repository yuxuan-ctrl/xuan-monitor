import PageViewTracker from "./PageViewTracker";
import UvTracker from "./UserViewTracker";
import ErrorTracker from "./ErrorTracker";
import MessageQueueDBWrapper, {IMessage} from "./Message";
import {IPVData, UVData, IPvUvData} from "../types";
import {DB_CONFIG} from "../config/dbconfig";
import {
  wrapHistory,
  wrapFetch,
  wrapSetTimeout,
  wrapPromise,
  wrapXMLHttpRequest,
} from "../utils";
import {Listener} from "../decorator";
import "reflect-metadata";

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
  messageWrapper: MessageQueueDBWrapper;

  constructor(userId?: string, customKey?: string) {
    this.pvTracker = new PageViewTracker(userId, this);
    this.uvTracker = new UvTracker(customKey, this);
    this.errorTracker = new ErrorTracker();
    this.uvTracker.initRefreshInterval(this.sendMessage);
    this.initializeEventListeners();
    this.setGlobalProxy();
    this.initializeDatabase();
  }

  initializeDatabase() {
    this.messageWrapper = MessageQueueDBWrapper.getInstance({
      dbName: "monitorxq",
      dbVersion: 1,
      storeName: "monitor_data",
    });
    this.messageWrapper.openDatabase([
      DB_CONFIG.TRAFFIC_STORE_NAME,
      DB_CONFIG.Error_STORE_NAME,
    ]);
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

  public stopTracking() {
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

    // if (typeof window.Promise === "function") {
    //   const OriginalPromise = window.Promise;
    //   window.Promise = wrapPromise(
    //     OriginalPromise,
    //     this.reportError.bind(this)
    //   ) as any;
    // }

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
        ...this.pvData,
        ...this.uvData,
        timestamp: Date.now(),
        name: DB_CONFIG.TRAFFIC_STORE_NAME,
        userId: this.pvTracker.userId,
      };
      this.sendMessage(message, DB_CONFIG.TRAFFIC_STORE_NAME);
    }
    this.updateDurationMessage();
  }

  public async sendMessage(message, storeName) {
    this.messageWrapper.enqueue(message, storeName);
  }

  public async reportError(error: Error) {
    const errorInfo = await this.errorTracker.collectError(error);
    this.sendMessage(errorInfo, DB_CONFIG.Error_STORE_NAME);
  }

  public async updateDurationMessage() {
    console.log(this.stayDuration);
    const latestPv = await this.getLastData(DB_CONFIG.TRAFFIC_STORE_NAME);
    const {data} = latestPv;
    const newData = {
      ...latestPv,
      data: {
        ...data,
        stayDuration: this.stayDuration,
      },
    };
    this.messageWrapper.update(
      latestPv.id,
      newData,
      DB_CONFIG.TRAFFIC_STORE_NAME
    );
  }

  public async getLastData(storeName: string): Promise<IPvUvData | undefined> {
    try {
      const lastData = await this.messageWrapper.query(
        (_) => true,
        storeName,
        {field: "timestamp", direction: "desc"},
        1
      );
      if (lastData.length > 0) {
        return lastData[0];
      } else {
        return undefined;
      }
    } catch (error) {
      console.error("Error getting last data ID:", error);
      return undefined;
    }
  }
}
