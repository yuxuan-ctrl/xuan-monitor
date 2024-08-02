/*
 * @Author: yuxuan-ctrl
 * @Date: 2023-12-11 14:37:34
 * @LastEditors: yuxuan-ctrl 
 * @LastEditTime: 2024-08-02 11:08:02
 * @FilePath: \monitor-sdk\src\core\monitor.ts
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
import PageViewTracker from './PageViewTracker';
import UvTracker from './UserViewTracker';
import ErrorTracker, { ErrorInfo } from './ErrorTracker';
import MessageQueueDBWrapper from './Message';
import { UVData, MonitorConfig, AnalysisData, IMessage } from '../types';
import { DB_CONFIG } from '../config/dbconfig';
import {
  wrapHistory,
  wrapFetch,
  wrapSetTimeout,
  wrapXMLHttpRequest,
  getCurrentUnix,
  shouldProcessErrorReport,
} from '../utils';
import { Listener, EventManager } from '../decorator';
import Report from './Report';
import { debounce } from '../utils/debounce';
import 'reflect-metadata';

const {
  TRAFFIC_STORE_NAME,
  Error_STORE_NAME,
  ACTION_STORE_NAME,
  RECORD_STORE_NAME,
  INTERFACE_STORE_NAME,
} = DB_CONFIG;

type historyFunction = (data: any, unused: string, url?: string | URL) => void;
export default class Monitor extends EventManager {
  static instance: Monitor | null = null;

  public pvTracker: PageViewTracker;
  public uvTracker: UvTracker;
  public errorTracker: ErrorTracker;
  public uvData: UVData;
  public pvData: AnalysisData;
  public stayDuration: number;
  public originalPushState: historyFunction;
  public originalReplaceState: historyFunction;
  public Events: Object = {};
  private errorMutex: number = 0; // 错误上报上锁 0-可用 1-占用
  public originalFetch: any;
  public reportUtils: Report;
  public config: MonitorConfig;
  public baseInfo: { appId: string; userId: string };
  public report: Report;
  public reportError: { cancel: () => void; flush: () => any } & ((
    ...args: any[]
  ) => void);

  constructor(config: MonitorConfig) {
    super();
    this.config = config;
    this.pvTracker = new PageViewTracker(config?.userId, this);
    this.uvTracker = new UvTracker(config?.userId, this);
    this.report = new Report(config, this.uvTracker);
    this.report.start(this.config?.baseUrl || '/api');
    this.baseInfo = { appId: config.appId, userId: config?.userId };
    this.errorTracker = new ErrorTracker();
    this.reportError = debounce(this.basicReportError, 1000);
    // this.uvTracker.initRefreshInterval(this.sendMessage);
    this.setGlobalProxy();
    this.initializeDatabase();
  }

  initializeDatabase() {
    this.messageWrapper = MessageQueueDBWrapper.getInstance({
      dbName: 'monitorxq',
      dbVersion: 1,
      storeName: 'monitor_data',
    });
    this.messageWrapper.openDatabase([
      TRAFFIC_STORE_NAME,
      Error_STORE_NAME,
      ACTION_STORE_NAME,
      RECORD_STORE_NAME,
      INTERFACE_STORE_NAME,
    ]);
  }

  @Listener('popstate')
  public async onPopState(event: PopStateEvent) {
    await this.pvTracker.trackPageView('popstate', event);
  }

  @Listener(['load', 'pageshow'])
  public async onLoad(event: Event) {
    this.uvData = await this.uvTracker.trackUv();
    await this.pvTracker.trackPageView('load', event);
  }

  @Listener('beforeunload')
  public onBeforeUnload(event: BeforeUnloadEvent) {
    // 在用户离开页面之前，计算并发送停留时间
    this.pvTracker.calculateDuration();
  }

  @Listener('visibilitychange')
  public onVisablechange(event: BeforeUnloadEvent) {
    if (document.visibilityState === 'hidden') {
      this.pvTracker.calculateDuration();
    } else {
      this.pvTracker.trackPageView('load', event);
    }
  }

  @Listener('error')
  public async onError(error: ErrorEvent) {
    console.log('🚀 ~ Monitor ~ onError ~ error:', error);
    this.reportError(error.error);
  }

  @Listener('unhandledrejection')
  public async onUnhandlerejection(error: {
    type: 'unhandledrejection';
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
    if (typeof window.fetch === 'function') {
      const originalFetch = window.fetch;
      window.fetch = wrapFetch(
        originalFetch,
        this.reportError.bind(this),
        this.config
      );
    }

    if (typeof window.setTimeout === 'function') {
      const originalSetTimeout = window.setTimeout;
      window.setTimeout = wrapSetTimeout(
        originalSetTimeout,
        this.reportError.bind(this)
      ) as any;
    }

    if (typeof window.XMLHttpRequest === 'function') {
      const OriginalXMLHttpRequest = window.XMLHttpRequest;
      window.XMLHttpRequest = wrapXMLHttpRequest(
        OriginalXMLHttpRequest,
        this.reportError.bind(this),
        this.config
      ) as any;
    }
  }

  public removeEventListeners() {
    Object.keys(this.Events).forEach((eventName) => {
      window.removeEventListener(eventName, this.Events[eventName]);
    });
  }

  private async onPageChange(method: string, ...args: any[]) {
    const stayDuration = await this.pvTracker.calculateDuration();
    await this.updateDurationMessage(stayDuration);
    await this.pvTracker.trackPageView(method, ...args);
    if (this.pvData?.pageUrl) {
      const message: AnalysisData = {
        ...this.pvData,
        ...this.uvData,
        ...this.baseInfo,
        userId: this.uvTracker.uniqueKey,
        timestamp: getCurrentUnix(),
        name: TRAFFIC_STORE_NAME,
      };
      this.sendMessage(message, TRAFFIC_STORE_NAME);
    }
  }

  public async sendMessage(message, storeName) {
    this.messageWrapper.enqueue(message, storeName);
  }

  public async basicReportError(error: Error) {
    const errorInfo = await this.errorTracker.collectError(error);
    if (
      errorInfo?.requestUrl &&
      !shouldProcessErrorReport(errorInfo.requestUrl)
    ) {
      return;
    }
    // 假如errorReport 发生错误就上锁
    this.errorMutex === 0 &&
      this.report
        .fetchReport(`${this.config.baseUrl}/monitor/errorReport`, {
          ...errorInfo,
          ...this.baseInfo,
          userId: this.uvTracker.uniqueKey,
        })
        .then(() => (this.errorMutex = 0))
        .catch(() => (this.errorMutex = 1));
  }

  public async updateDurationMessage(stayDuration) {
    console.log('stayDuration================================', stayDuration);
    const latestPv = await this.getLastData(TRAFFIC_STORE_NAME);
    if (latestPv) {
      const { data } = latestPv;
      const newData = {
        ...latestPv,
        data: {
          ...data,
          stayDuration: stayDuration,
        },
      };
      this.messageWrapper
        .update(latestPv.id, newData, TRAFFIC_STORE_NAME)
        .then(() => {
          this.messageWrapper.updateStatus(
            latestPv.id,
            TRAFFIC_STORE_NAME,
            'pending'
          );
        });
    }
    return true;
  }

  public async getLastData(storeName: string): Promise<IMessage | undefined> {
    try {
      const lastData = await this.messageWrapper.query(
        (_) => true,
        storeName,
        { field: 'timestamp', direction: 'desc' },
        1
      );
      if (lastData.length > 0) {
        return lastData[0];
      } else {
        return undefined;
      }
    } catch (error) {
      return undefined;
    }
  }
}
