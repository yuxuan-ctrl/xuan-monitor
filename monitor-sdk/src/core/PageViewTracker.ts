type PageViewInfo = {
  timestamp: number;
  referrer: string | null;
};

export default class PageViewTracker {
  private minTimeInterval = 30 * 1000;
  private pageVisits = new Map<string, PageViewInfo>();
  private isTracking = false;
  private currentPageUrl?: string;

  constructor() {
    this.addEventListeners();
  }

  private addEventListeners() {
    window.addEventListener("popstate", this.onPopState.bind(this));
    history.pushState = this.trackPageView.bind(this, "pushState");
    history.replaceState = this.trackPageView.bind(this, "replaceState");
    window.addEventListener("load", this.onLoad.bind(this));
  }

  private removeEventListeners() {
    window.removeEventListener("popstate", this.onPopState);
    history.pushState = history.originalPushState || history.pushState;
    history.replaceState = history.originalReplaceState || history.replaceState;
    window.removeEventListener("load", this.onLoad);
  }

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

  private onPopState(event: PopStateEvent) {
    this.trackPageView("popstate");
  }

  private onLoad(event: Event) {
    this.trackPageView("load");
  }

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

    this.pageVisits.set(pageId, { timestamp: now, referrer });
    this.calculateAndSendPVData();
  }

  private calculateAndSendPVData() {
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
  }

  private setCurrentPageUrl(url: string) {
    this.currentPageUrl = url;
  }

  public startTrackingPageView(pageId: string, url?: string) {
    this.setCurrentPageUrl(url ?? "");
    this.startTrackingPageViewWithoutUrl(pageId);
  }

  public startTrackingPageViewWithoutUrl(pageId: string) {
    if (!this.pageVisits.has(pageId)) {
      this.pageVisits.set(pageId, {
        timestamp: performance.now(),
        referrer: null,
      });
      this.calculateAndSendPVData();
    } else {
      this.updatePageViewTime(pageId);
    }
  }

  public stopTracking() {
    this.removeEventListeners();
  }
}
