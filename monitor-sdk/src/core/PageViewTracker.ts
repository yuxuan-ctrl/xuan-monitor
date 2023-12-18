import MessageQueueDBWrapper, { IMessage } from "./message";
import Monitor from "./monitor";
import { debounce } from "../utils";
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
  stayDuration: number;
  totalPageViews?: number;
  maxStayDuration?: number; // 单位：毫秒
  mostVisitedPageId?: number;
  mostVisitedPageViews?: number;
}

/**
 * 页面浏览跟踪器类。
 */
export default class PageViewTracker {
  /**
   * 最小的时间间隔（单位：毫秒）。
   */
  private minTimeInterval = 30 * 1000;

  /**
   * 访问页面的映射表。
   */
  private pageVisits = new Map<string, IPVData>();

  /**
   * 是否正在跟踪页面浏览。
   */
  private isTracking = false;

  /**
   * 当前页面的 URL。
   */
  private currentPageUrl?: string;

  /**
   * 用户 ID。
   */
  private _userId?: string;
  pvData: {
    stayDuration: number;
    title?: string;
    url?: string;
    userAgent?: string;
    platform?: string;
    screenResolution?: { width: number; height: number };
    timestamp?: number;
    referrer?: string;
    totalPageViews: number;
    maxStayDuration: number; // 单位：毫秒
    mostVisitedPageId: string;
    mostVisitedPageViews: number;
  };
  monitor: Monitor;
  currentPageEntryTime: number;
  /**
   * 构造函数。
   *
   * @param userId 可选的用户 ID。
   */
  constructor(userId?: string, monitor?: Monitor) {
    this.userId = userId;
    this.monitor = monitor;
    // this.addEventListeners();
  }

  /**
   * 获取用户 ID。
   *
   * @returns 返回用户 ID 或未定义。
   */
  get userId(): string | undefined {
    return this._userId;
  }

  /**
   * 设置用户 ID。
   *
   * @param value 用户 ID 或未定义。
   */
  set userId(value: string | undefined) {
    this._userId = value;
  }

  /**
   * 跟踪页面浏览。
   *
   * @param method 跟踪的方法。
   * @param args 方法的参数。
   */
  public trackPageView(method: string, ...args: any[]) {
    this.isTracking = true;
    this.storeCurrentPageEntryTime();
    const url = window.location.href;
    switch (method) {
      case "pushState":
      case "replaceState":
        const callback = debounce(this.updatePageViewTime, 1000);
        this.pvData = callback.call(this, url) as unknown as IPVData;
        // console.log(
        //   "🚀 ~ file: PageViewTracker.ts:110 ~ PageViewTracker ~ trackPageView ~ this.pvData:",
        //   this.pvData
        // );
        break;
      case "popstate":
      case "load":
        // this.pvData = this.updatePageViewTime(url);
        break;
      default:
        throw new Error(`Invalid method: ${method}`);
    }
    console.log(
      "🚀 ~ file: PageViewTracker.ts:125 ~ PageViewTracker ~ trackPageView ~ this.pvData:",
      this.pvData
    );

    this.isTracking = false;
    return this.pvData;
  }

  private storeCurrentPageEntryTime() {
    this.currentPageEntryTime = performance.now();
  }

  private calculateDuration() {
    if (!this.currentPageEntryTime) {
      return 0;
    }
    const stayDuration = performance.now() - this.currentPageEntryTime;
    return stayDuration;
  }

  /**
   * 更新页面查看时间。
   *
   * @param pageId 页面 ID。
   */
  private updatePageViewTime(pageId: string) {
    const now = performance.now();
    const lastVisitInfo = this.pageVisits.get(pageId);
    console.log(
      "🚀 ~ file: PageViewTracker.ts:146 ~ PageViewTracker ~ updatePageViewTime ~ this.pageVisits:",
      this.pageVisits
    );

    if (
      lastVisitInfo !== undefined &&
      now - lastVisitInfo.timestamp < this.minTimeInterval
    ) {
      return; // 如果上次访问时间距离现在小于最小时间间隔，则不计算 PV
    }

    const referrer =
      this.currentPageUrl && !pageId.startsWith("http")
        ? this.currentPageUrl
        : document.referrer;

    const stayDuration = this.calculateDuration();

    const pvData: IPVData = {
      title: document.title,
      url: window.location.href,
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      screenResolution: {
        width: window.screen.width,
        height: window.screen.height,
      },
      timestamp: now,
      referrer,
      stayDuration,
    };
    this.pageVisits.set(pageId, pvData);
    const result = this.calculateAndSendPVData(pvData);
    return result;
  }

  /**
   * 计算并发送 PV 数据。
   *
   * @param pvData 页面浏览数据。
   */
  private calculateAndSendPVData(pvData: IPVData) {
    // 根据 pageVisits 中的数据计算 PV，并发送到服务器

    // 这里可以遍历 pageVisits 集合，提取 PV 相关信息，
    // 如：总 PV 数量、各页面 PV 数量、平均停留时间等指标，
    // 并根据需要添加更多的用户行为和指标信息。

    // 示例：
    let totalPageViews = 0;
    let maxStayDuration = 0;
    let mostVisitedPageId = "";
    let mostVisitedPageViews = 0;

    for (const [pageId, pageInfo] of this.pageVisits.entries()) {
      totalPageViews += 1;

      const stayDuration = performance.now() - pageInfo.timestamp;

      if (stayDuration > maxStayDuration) {
        maxStayDuration = stayDuration;
        mostVisitedPageId = pageId;
      }

      if (pageInfo.referrer && pageInfo.referrer === this.currentPageUrl) {
        mostVisitedPageViews += 1;
      }
    }

    // console.log(
    //   `Total page views: ${totalPageViews}`,
    //   `Max stay duration: ${maxStayDuration} ms`,
    //   `Most visited page: ${mostVisitedPageId}`,
    //   `Most visited page views: ${mostVisitedPageViews}`
    // );
    // console.log({
    //   totalPageViews,
    //   maxStayDuration, // 单位：毫秒
    //   mostVisitedPageId,
    //   mostVisitedPageViews,
    //   ...pvData,
    // });

    return {
      totalPageViews,
      maxStayDuration, // 单位：毫秒
      mostVisitedPageId,
      mostVisitedPageViews,
      ...pvData,
    };
  }

  /**
   * 触发自定义事件。
   *
   * @param eventName 事件名称。
   * @param eventData 事件数据。
   */
  public triggerCustomEvent(eventName: string, eventData: any) {
    // this.sendMessage(eventName, eventData);
  }
}
