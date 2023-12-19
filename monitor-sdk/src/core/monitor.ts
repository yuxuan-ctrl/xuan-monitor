import PageViewTracker from "./PageViewTracker";
import UvTracker from "./UserViewTracker";
import MessageQueueDBWrapper, { IMessage } from "./message";
import { debounce } from "../utils";
import { Listener } from "../decorator";
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

  constructor(userId?: string, customKey?: string) {
    this.pvTracker = new PageViewTracker(userId, this);
    this.uvTracker = new UvTracker(customKey, this);
  }

  initializeEventListeners() {
    this.addEventListeners();
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

  stopTracking() {
    this.removeEventListeners();
    this.uvTracker.stopRefreshInterval();
  }

  private addEventListeners() {
    this.originalPushState = history.pushState;
    this.originalReplaceState = history.replaceState;
    const debouncePageChange = debounce((method: string, ...args: any[]) => {
      this.onPageChange(method, ...args);
    }, 300);

    history.pushState = (...args) => {
      debouncePageChange.call(this, "pushState", ...args);
      if (this.originalPushState) {
        return this.originalPushState.apply(history, args);
      }
    };
    history.replaceState = (...args) => {
      debouncePageChange.call(this, "replaceState", ...args);
      if (this.originalReplaceState) {
        return this.originalReplaceState.apply(history, args);
      }
    };
  }

  public removeEventListeners() {
    Object.keys(this.Events).forEach((eventName) => {
      window.removeEventListener(eventName, this.Events[eventName]);
    });
  }

  private async onPageChange(method: string, ...args: any[]) {
    await this.pvTracker.calculateDuration();
    await this.pvTracker.trackPageView(method, ...args);
    this.sendMessage();
    this.updateDurationMessage();
  }

  public async sendMessage() {
    if (this.pvData?.url) {
      const message: IMessage = {
        data: { ...this.pvData, ...this.uvData },
        timestamp: Date.now(),
        name: "pv_uv_data",
        userId: this.pvTracker.userId,
      };
      MessageQueueDBWrapper.getInstance({
        dbName: "page_view_tracker",
        dbVersion: 1,
        storeName: "messages",
      }).enqueue(message);
    }
  }

  public updateDurationMessage() {
    console.log(this.stayDuration);
  }
}
