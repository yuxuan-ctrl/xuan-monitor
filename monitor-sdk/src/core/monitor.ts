import PageViewTracker from "./PageViewTracker";
import UvTracker from "./UserViewTracker";
import MessageQueueDBWrapper, { IMessage } from "./message";

interface IPVData {
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

interface UVData {
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
  private pvTracker: PageViewTracker;
  private uvTracker: UvTracker;
  uvData: UVData;
  pvData: IPVData;

  constructor(userId?: string, customKey?: string) {
    this.pvTracker = new PageViewTracker(userId, this);
    this.uvTracker = new UvTracker(customKey, this);
  }

  startTracking() {
    this.addEventListeners();
    this.uvTracker.initRefreshInterval(this.sendMessage);
  }

  stopTracking() {
    this.removeEventListeners();
    this.uvTracker.stopRefreshInterval();
  }

  private addEventListeners() {
    window.addEventListener("popstate", this.onPopState.bind(this));
    history.pushState = this.onPageChange.bind(this, "pushState");
    history.replaceState = this.onPageChange.bind(this, "replaceState");
    window.addEventListener("load", this.onLoad.bind(this));
    window.addEventListener("pageshow", this.onPageShow.bind(this));
  }

  private removeEventListeners() {
    window.removeEventListener("popstate", this.onPopState);
    history.pushState = history.originalPushState || history.pushState;
    history.replaceState = history.originalReplaceState || history.replaceState;
    window.removeEventListener("load", this.onLoad);
    window.removeEventListener("pageshow", this.onPageShow);
  }

  private onPageChange(method: string, ...args: any[]) {
    this.pvData = this.pvTracker.trackPageView(method, ...args);
  }

  private onPopState(event: PopStateEvent) {
    this.pvData = this.pvTracker.trackPageView("popstate", event);
  }

  private async onLoad(event: Event) {
    this.uvData = await this.uvTracker.trackUv();
    this.pvData = this.pvTracker.trackPageView("load", event);
  }

  private onPageShow(event: PageTransitionEvent) {
    // if (event.persisted) {
    // }
  }

  public async sendMessage() {
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
