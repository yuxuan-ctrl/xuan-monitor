import { IMessage } from './Message';
import Monitor from './Monitor';
import { normalizeUrlForPath, collectWebVitals } from '../utils';

/**
 * 页面浏览跟踪器类。
 */
export default class PageViewTracker {
  /**
   * 最小的时间间隔（单位：毫秒）。
   */
  private minTimeInterval = 3 * 1000;

  /**
   * 访问页面的映射表。
   */
  private pageVisits = new Map<string, IMessage>();

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
  pvData: IMessage;
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
  public async trackPageView(method: string, ...args: any[]) {
    this.isTracking = true;
    const url = normalizeUrlForPath(window.location.href);
    switch (method) {
      case 'pushState':
      case 'replaceState':
        this.monitor.pvData = await this.updatePageViewTime(url);
        break;
      case 'popstate':
      case 'load':
        this.storeCurrentPageEntryTime();
        // this.pvData = this.updatePageViewTime(url);
        break;
      default:
        throw new Error(`Invalid method: ${method}`);
    }

    this.isTracking = false;
  }

  private storeCurrentPageEntryTime() {
    this.currentPageEntryTime = performance.now();
  }

  public async calculateDuration() {
    if (!this.currentPageEntryTime) {
      return 0;
    }
    const stayDuration = performance.now() - this.currentPageEntryTime;
    this.monitor.stayDuration = stayDuration;
    this.storeCurrentPageEntryTime();
    return stayDuration;
  }

  /**
   * 更新页面查看时间。
   *
   * @param pageId 页面 ID。
   */
  private async updatePageViewTime(pageId: string) {
    // const { fcp, lcp } = await collectWebVitals();
    console.log("🚀 ~ PageViewTracker ~ updatePageViewTime ~ lcp:", lcp)
    console.log("🚀 ~ PageViewTracker ~ updatePageViewTime ~ fcp:", fcp)
    const now = performance.now();
    const lastVisitInfo = this.pageVisits.get(pageId);

    if (
      lastVisitInfo !== undefined &&
      now - lastVisitInfo.timestamp < this.minTimeInterval
    ) {
      return; // 如果上次访问时间距离现在小于最小时间间隔，则不计算 PV
    }

    const referrer =
      this.currentPageUrl && !pageId.startsWith('http')
        ? this.currentPageUrl
        : document.referrer;

    const pvData: IMessage = {
      // title: document.title,
      pageUrl: normalizeUrlForPath(window.location.href),
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
    const result = this.calculateAndSendPVData(pvData);
    return result;
  }

  /**
   * 计算并发送 PV 数据。
   *
   * @param pvData 页面浏览数据。
   */
  private calculateAndSendPVData(pvData: IMessage) {
    // 根据 pageVisits 中的数据计算 PV，并发送到服务器

    // 这里可以遍历 pageVisits 集合，提取 PV 相关信息，
    // 如：总 PV 数量、各页面 PV 数量、平均停留时间等指标，
    // 并根据需要添加更多的用户行为和指标信息。

    // 示例：
    let mostVisitedPageId = '';
    let mostVisitedPageViews = 0;

    for (const [pageId, pageInfo] of this.pageVisits.entries()) {
      if (pageInfo.referrer && pageInfo.referrer === this.currentPageUrl) {
        mostVisitedPageViews += 1;
      }
    }

    return {
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
