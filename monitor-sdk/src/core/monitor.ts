import PageViewTracker from "./PageViewTracker";
import UvTracker from "./UserViewTracker";
import MessageQueueDBWrapper, { IMessage } from "./message";
import { debounce } from "../utils";

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
  uvData: UVData;
  pvData: IPVData;
  private _sendMessage: { cancel: () => void; flush: () => any } & ((
    ...args: any[]
  ) => void);
  originalPushState: (data: any, unused: string, url?: string | URL) => void;
  originalReplaceState: (data: any, unused: string, url?: string | URL) => void;

  constructor(userId?: string, customKey?: string) {
    this.pvTracker = new PageViewTracker(userId, this);
    this.uvTracker = new UvTracker(customKey, this);
    this._sendMessage = debounce(this.sendMessage, 1000);
  }

  startTracking() {
    this.addEventListeners();
    this.uvTracker.initRefreshInterval(this.sendMessage);
  }

  stopTracking() {
    this.removeEventListeners();
    this.uvTracker.stopRefreshInterval();
  }

  public addEventListeners() {
    this.originalPushState = history.pushState;
    this.originalReplaceState = history.replaceState;
    window.addEventListener("popstate", this.onPopState.bind(this));
    window.addEventListener("load", this.onLoad.bind(this));
    window.addEventListener("onbeforeunload", this.onLoad.bind(this));
    window.addEventListener("pageshow", this.onPageShow.bind(this));
    history.pushState = (...args) => {
      this.onPageChange.call(this, "pushState", ...args);
      if (this.originalPushState) {
        return this.originalPushState.apply(history, args);
      }
    };
    history.replaceState = (...args) => {
      this.onPageChange.call(this, "replaceState", ...args);
      if (this.originalReplaceState) {
        return this.originalReplaceState.apply(history, args);
      }
    };
  }

  public removeEventListeners() {
    window.removeEventListener("popstate", this.onPopState);
    window.removeEventListener("load", this.onLoad);
    window.removeEventListener("pageshow", this.onPageShow);
    // window.removeEventListener("onbeforeunload", this.onBeforeunload);
  }

  private onPageChange(method: string, ...args: any[]) {
    this.pvData = this.pvTracker.trackPageView(method, ...args);
    this._sendMessage();
  }

  public onPopState(event: PopStateEvent) {
    this.pvData = this.pvTracker.trackPageView("popstate", event);
    console.log(
      "🚀 ~ file: monitor.ts:71 ~ Monitor ~ onPopState ~ this.pvData:",
      this.pvData
    );
  }

  public async onLoad(event: Event) {
    this.uvData = await this.uvTracker.trackUv();
    this.pvData = this.pvTracker.trackPageView("load", event);
  }

  public onPageShow(event: PageTransitionEvent) {
    // if (event.persisted) {
    //   // 如果页面是从浏览器缓存中恢复的，更新页面浏览数据
    //   this.pvData = this.pvTracker.trackPageView("pageshow", event);
    //   this._sendMessage();
    // }
  }

  public onBeforeUnload(event: BeforeUnloadEvent) {
    // 在用户离开页面之前，计算并发送停留时间
    // const stayDuration = this.pvTracker.calculateDuration();
    // if (stayDuration > 0) {
    //   this.pvData.stayDuration = stayDuration;
    //   this._sendMessage();
    // }
    // 如果需要的话，可以在这里添加自定义的确认对话框逻辑
    // event.preventDefault(); // 阻止默认的确认对话框
    // event.returnValue = 'Are you sure you want to leave?'; // 设置自定义的确认消息
  }

  public async sendMessage() {
    console.log(this.uvData);
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
