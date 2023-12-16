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

  /**
   * 构造函数。
   *
   * @param userId 可选的用户 ID。
   */
  constructor(userId?: string) {
    this.userId = userId;
    this.addEventListeners();
    history.originalReplaceState = history.replaceState;
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
   * 添加事件监听器。
   */
  private addEventListeners() {
    window.addEventListener("popstate", this.onPopState.bind(this));
    history.pushState = this.trackPageView.bind(this, "pushState");
    history.replaceState = this.trackPageView.bind(this, "replaceState");
    window.addEventListener("load", this.onLoad.bind(this));
  }

  /**
   * 移除事件监听器。
   */
  private removeEventListeners() {
    window.removeEventListener("popstate", this.onPopState);
    history.pushState = history.originalPushState || history.pushState;
    history.replaceState = history.originalReplaceState || history.replaceState;
    window.removeEventListener("load", this.onLoad);
  }

  /**
   * 跟踪页面浏览。
   *
   * @param method 跟踪的方法。
   * @param args 方法的参数。
   */
  private trackPageView(method: string, ...args: any[]) {
    this.isTracking = true;
    switch (method) {
      case "pushState":
        history.originalPushState.apply(history, args);
        break;
      case "replaceState":
        history.originalReplaceState.apply(history, args);
        break;
      case "popstate":
      case "load":
        this.updatePageViewTime("current_page");
        break;
      default:
        throw new Error(`Invalid method: ${method}`);
    }
    this.isTracking = false;
  }

  /**
   * 发送消息到消息队列。
   *
   * @param eventName 消息名称。
   * @param eventData 消息数据。
   */
  private sendMessage(eventName: string, eventData: any) {
    const message: IMessage = {
      data: eventData,
      timestamp: Date.now(),
      name: eventName,
      userId: this.userId,
    };
    MessageQueueDBWrapper.getInstance({
      dbName: "page_view_tracker",
      dbVersion: 1,
      storeName: "messages",
    }).enqueue(message);
  }

  /**
   * 处理 popstate 事件。
   *
   * @param event popstate 事件对象。
   */
  private onPopState(event: PopStateEvent) {
    this.trackPageView("popstate");
  }

  /**
   * 处理 load 事件。
   *
   * @param event load 事件对象。
   */
  private onLoad(event: Event) {
    this.trackPageView("load");
  }

  /**
   * 更新页面查看时间。
   *
   * @param pageId 页面 ID。
   */
  private updatePageViewTime(pageId: string) {
    const now = performance.now();
    const lastVisitInfo = this.pageVisits.get(pageId);

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
    };
    this.pageVisits.set(pageId, pvData);

    this.calculateAndSendPVData(pvData);
  }

  /**
   * 计算并发送 PV 数据。
   *
   * @param pvData 页面浏览数据。
   */
  private calculateAndSendPVData(pvData: IPVData) {
    // 根据 pageVisits 中的数据计算 PV，并发送到服务器
    console.log("Calculating and sending PV data...");

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

    console.log(
      `Total page views: ${totalPageViews}`,
      `Max stay duration: ${maxStayDuration} ms`,
      `Most visited page: ${mostVisitedPageId}`,
      `Most visited page views: ${mostVisitedPageViews}`
    );

    // 发送 PV 数据到消息队列
    this.sendMessage("pv_data", {
      totalPageViews,
      maxStayDuration, // 单位：毫秒
      mostVisitedPageId,
      mostVisitedPageViews,
      ...pvData,
    });
  }

  /**
   * 停止跟踪页面浏览。
   */
  public stopTracking() {
    this.removeEventListeners();
  }

  /**
   * 触发自定义事件。
   *
   * @param eventName 事件名称。
   * @param eventData 事件数据。
   */
  public triggerCustomEvent(eventName: string, eventData: any) {
    this.sendMessage(eventName, eventData);
  }
}
