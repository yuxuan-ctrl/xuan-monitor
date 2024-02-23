/*
 * @Author: yuxuan-ctrl
 * @Date: 2023-12-11 14:37:34
 * @LastEditors: yuxuan-ctrl 
 * @LastEditTime: 2024-02-23 10:25:47
 * @FilePath: \monitor-sdk\src\core\monitor.ts
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
import PageViewTracker from './PageViewTracker';
import UvTracker from './UserViewTracker';
import ErrorTracker from './ErrorTracker';
import MessageQueueDBWrapper from './Message';
import { UVData, MonitorConfig, AnalysisData, IMessage } from '../types';
import { DB_CONFIG } from '../config/dbconfig';
import {
  wrapHistory,
  wrapFetch,
  wrapSetTimeout,
  wrapXMLHttpRequest,
} from '../utils';
import { Listener, EventManager } from '../decorator';
import Report from './Report';
import 'reflect-metadata';

export default class Monitor extends EventManager {
  static instance: Monitor | null = null;

  public pvTracker: PageViewTracker;
  public uvTracker: UvTracker;
  public errorTracker: ErrorTracker;
  public uvData: UVData;
  public pvData: AnalysisData;
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
  public Events: Object = {};
  originalFetch: any;
  reportUtils: Report;
  config: MonitorConfig;
  baseInfo: { appId: string; userId: string };
  report: Report;

  constructor(config: MonitorConfig) {
    super();
    this.config = config;
    this.pvTracker = new PageViewTracker(config?.userId, this);
    this.uvTracker = new UvTracker(config?.userId, this);
    this.report = new Report(config,this.uvTracker);
    this.report.start('/api');
    this.baseInfo = { appId: config.appId, userId: config?.userId };
    this.errorTracker = new ErrorTracker();
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
      DB_CONFIG.TRAFFIC_STORE_NAME,
      DB_CONFIG.Error_STORE_NAME,
      DB_CONFIG.ACTION_STORE_NAME,
      DB_CONFIG.RECORD_STORE_NAME,
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
  public async onError(error: Error) {
    this.reportError(error);
  }

  @Listener('unhandledrejection')
  public async onUnhandlerejection(error: {
    type: 'unhandledrejection';
    promise: Promise<any>;
    reason: Error;
  }) {
    // this.reportError(error.reason);
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
      window.fetch = wrapFetch(originalFetch, this.reportError.bind(this));
    }

    if (typeof window.setTimeout === 'function') {
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

    if (typeof window.XMLHttpRequest === 'function') {
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
    if (this.pvData?.pageUrl) {
      const message: AnalysisData = {
        ...this.pvData,
        ...this.uvData,
        ...this.baseInfo,
        userId: this.uvTracker.uniqueKey,
        timestamp: Date.now(),
        name: DB_CONFIG.TRAFFIC_STORE_NAME,
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
    this.report.fetchReport(`${this.config.baseUrl}/monitor/errorReport`, {
      ...errorInfo,
      ...this.baseInfo,
      userId: this.uvTracker.uniqueKey,
    });
  }

  public async updateDurationMessage() {
    console.log(this.stayDuration);
    const latestPv = await this.getLastData(DB_CONFIG.TRAFFIC_STORE_NAME);
    console.log('🚀 ~ Monitor ~ updateDurationMessage ~ latestPv:', latestPv);
    const { data } = latestPv;
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
