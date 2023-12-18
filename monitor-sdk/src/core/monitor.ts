import PageViewTracker from "./PageViewTracker";
import UvTracker from "./UserViewTracker";
import MessageQueueDBWrapper, {IMessage} from "./message";
import {debounce} from "../utils";

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
  private _sendMessage: { cancel: () => void; flush: () => any; } & ((...args: any[]) => void);

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
    window.addEventListener("popstate", this.onPopState.bind(this));
    history.pushState = this.onPageChange.bind(this, "pushState");
    history.replaceState = this.onPageChange.bind(this, "replaceState");
    window.addEventListener("load", this.onLoad.bind(this));
    window.addEventListener("onbeforeunload", this.onLoad.bind(this));
    window.addEventListener("pageshow", this.onPageShow.bind(this));
  }

  public removeEventListeners() {
    window.removeEventListener("popstate", this.onPopState);
    window.removeEventListener("load", this.onLoad);
    window.removeEventListener("pageshow", this.onPageShow);
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
    // }
  }

  public async sendMessage() {
    const message: IMessage = {
      data: {...this.pvData, ...this.uvData},
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
