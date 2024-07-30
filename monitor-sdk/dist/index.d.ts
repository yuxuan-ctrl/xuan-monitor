import { RRwebPlayerOptions } from 'rrweb-player';

/*
 * @Author: yuxuan-ctrl
 * @Date: 2023-12-05 14:03:01
 * @LastEditors: yuxuan-ctrl
 * @LastEditTime: 2024-02-21 14:29:01
 * @FilePath: \monitor-sdk\src\types\index.d.ts
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
interface MonitorConfig {
  appId: string; // 系统ID
  userId?: string; // 用户ID
  baseUrl: string;
  reportFrequency?: number; // 上报频率（单位：秒）
  dataRetentionHours?: number;
}

interface UVData$1 {
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

interface IMessage {
  id?: number;
  data?: any;
  timestamp?: any;
  status?: 'pending' | 'consumed' | 'enter';
  pageUrl?: string;
}

interface AnalysisData {
  name?: string;
  age?: number;
  email?: string;
  userId?: string;
  userAgent?: string;
  platform?: string;
  pageUrl?: string;
  screenResolution?: any;
  referrer?: string;
  metrics?: string;
  timestamp?: any;
  slowResources?: string;
}

/**
 * 页面浏览跟踪器类。
 */
declare class PageViewTracker {
    /**
     * 最小的时间间隔（单位：毫秒）。
     */
    private minTimeInterval;
    /**
     * 访问页面的映射表。
     */
    private pageVisits;
    /**
     * 是否正在跟踪页面浏览。
     */
    private isTracking;
    /**
     * 当前页面的 URL。
     */
    private currentPageUrl?;
    /**
     * 用户 ID。
     */
    private _userId?;
    pvData: IMessage;
    monitor: Monitor;
    currentPageEntryTime: number;
    /**
     * 构造函数。
     *
     * @param userId 可选的用户 ID。
     */
    constructor(userId?: string, monitor?: Monitor);
    /**
     * 获取用户 ID。
     *
     * @returns 返回用户 ID 或未定义。
     */
    get userId(): string | undefined;
    /**
     * 设置用户 ID。
     *
     * @param value 用户 ID 或未定义。
     */
    set userId(value: string | undefined);
    /**
     * 跟踪页面浏览。
     *
     * @param method 跟踪的方法。
     * @param args 方法的参数。
     */
    trackPageView(method: string, ...args: any[]): Promise<void>;
    private storeCurrentPageEntryTime;
    calculateDuration(): Promise<number>;
    /**
     * 更新页面查看时间。
     *
     * @param pageId 页面 ID。
     */
    private updatePageViewTime;
    /**
     * 计算并发送 PV 数据。
     *
     * @param pvData 页面浏览数据。
     */
    private calculateAndSendPVData;
    /**
     * 触发自定义事件。
     *
     * @param eventName 事件名称。
     * @param eventData 事件数据。
     */
    triggerCustomEvent(eventName: string, eventData: any): void;
}

interface UVData {
    uniqueKey: string;
    timestamp: number;
    userAgent?: string;
    language?: string;
    timeZoneOffset?: number;
}
declare class UvTracker {
    uvData: UVData | null;
    customKey?: string;
    refreshIntervalId?: number;
    monitor: Monitor;
    uniqueKey: string;
    constructor(customKey?: string, monitor?: Monitor);
    /**
     * 获取或生成唯一的用户标识符（unique key）。
     *
     * @returns 返回唯一用户标识符。
     */
    getUniqueKey(): Promise<string>;
    /**
     * 收集用户的附加信息。
     *
     * @returns 返回包含附加用户信息的对象。
     */
    collectUserInfo(): Partial<UVData>;
    /**
     * 记录UV数据。
     *
     * @param customKey 可选的自定义唯一键。
     */
    trackUv(customKey?: string): Promise<UVData>;
    /**
     * 初始化定期刷新UV数据的定时器。
     */
    initRefreshInterval(sendMessage: Function): void;
    /**
     * 停止定期刷新UV数据的定时器。
     */
    stopRefreshInterval(): void;
}

interface IIndexedDBConfig {
    dbName?: string;
    version?: number;
    storeName?: string;
}
interface IDBDatabaseInfo extends IDBDatabase {
}
declare class IndexedDBWrapper {
    private config;
    private db;
    constructor(config?: IIndexedDBConfig);
    openDatabase(storeNames: Array<string>): Promise<IDBDatabase>;
    closeDatabase(): void;
    protected ensureDatabaseOpen(): Promise<IDBDatabase>;
    add(data: IMessage, storeName: string): Promise<number>;
    get(id: number, storeName: string): Promise<IMessage | undefined>;
    update(id: number, newData: IMessage, storeName: string): Promise<void>;
    delete(id: number, storeName: string): Promise<void>;
    getAll(storeName: string): Promise<IMessage[]>;
    query(condition: (data: IMessage) => boolean, storeName: string, order?: {
        field: keyof IMessage;
        direction: 'asc' | 'desc';
    }, limit?: number): Promise<IMessage[]>;
    clear(storeName: string): Promise<void>;
    getCount(storeName: string): Promise<number>;
    getBaseInfo(): Promise<IDBDatabaseInfo>;
}

declare class MessageQueueDBWrapper extends IndexedDBWrapper {
    private static _instance;
    private maxMessageCount;
    constructor(config: any);
    static getInstance(config: {
        dbName: string;
        dbVersion: number;
        storeName: string;
    }): MessageQueueDBWrapper;
    enqueue(data: any, storeName: any): Promise<void>;
    dequeue(storeName: any): Promise<IMessage[] | undefined>;
    findLatestPage(storeName: any): Promise<IMessage>;
    updateStatus(id: any, storeName: any, status: any): void;
    batchDeleteBeforeDate(storeNameList: string[], hoursAgo: number): Promise<void>;
}

declare class HttpError extends Error {
    status: number;
    responseText: string;
    cause: XMLHttpRequest;
    method: string;
    requestUrl: string;
    data: string;
    stack: string;
    constructor(status: number, method: string, requestUrl: string, data: string, message: string, xhr: XMLHttpRequest, stack: string);
}

interface ErrorInfo {
    errorType: string;
    errorMessage: string;
    stackTrace?: string;
    cause?: string;
    timestamp: string;
    userAgent: string;
    pageUrl: string;
    operationSequence: any[];
    logContext: any;
    method?: string;
    requestUrl?: string;
    data?: any;
    status?: number;
    record?: any;
}
declare class ErrorTracker {
    operationSequence: any;
    logContext: any;
    errors: any;
    messageWrapper: MessageQueueDBWrapper;
    constructor();
    collectOperation(operation: any): void;
    clearOperationSequence(): void;
    setLogContext(context: any): void;
    clearLogContext(): void;
    getRange(startTime?: any, endTime?: any): Promise<string>;
    collectError(error: Error | string | HttpError): Promise<ErrorInfo>;
    private getCommonErrorInfo;
}

declare class EventManager {
    _registeredEvents: Map<string, {
        element: any;
        method: Function;
    }>;
    messageWrapper: MessageQueueDBWrapper;
    private manageEventListener;
    private _processEvent;
    private _registerEvent;
    start(root?: Element): void;
    stop(root?: Element): void;
}

declare class WebSocketManager {
    socket: WebSocket;
    url: string | URL;
    isConnected: boolean;
    constructor(url: any);
    start(): void;
    stop(): void;
    sendData(data: any): void;
}

declare class Report {
    baseUrl?: String;
    reportUrl?: String;
    method: String;
    headers: {
        'Content-Type': string;
    };
    webSocketData: any;
    status: any;
    timeInterval: number;
    dataRetentionHours: number;
    websocketManager: WebSocketManager;
    messageWrapper: any;
    config: MonitorConfig;
    uvTracker: UvTracker;
    constructor(config: MonitorConfig, uvTracker: UvTracker);
    start(baseUrl: any, useWebSocket?: boolean): void;
    setSuccessfulStatus(trafficList: any, actionList: any, interfaceList: any): void;
    mapWithStoreName(list: any, storeName: any): any;
    clearIndex(): void;
    fetchReport(url: any, data: any): Promise<unknown>;
    webSocketReport(data: any): Promise<void>;
    getRange(startTime?: any, endTime?: any): Promise<string>;
}

type historyFunction = (data: any, unused: string, url?: string | URL) => void;
declare class Monitor extends EventManager {
    static instance: Monitor | null;
    pvTracker: PageViewTracker;
    uvTracker: UvTracker;
    errorTracker: ErrorTracker;
    uvData: UVData$1;
    pvData: AnalysisData;
    stayDuration: number;
    originalPushState: historyFunction;
    originalReplaceState: historyFunction;
    Events: Object;
    private errorMutex;
    originalFetch: any;
    reportUtils: Report;
    config: MonitorConfig;
    baseInfo: {
        appId: string;
        userId: string;
    };
    report: Report;
    reportError: {
        cancel: () => void;
        flush: () => any;
    } & ((...args: any[]) => void);
    constructor(config: MonitorConfig);
    initializeDatabase(): void;
    onPopState(event: PopStateEvent): Promise<void>;
    onLoad(event: Event): Promise<void>;
    onBeforeUnload(event: BeforeUnloadEvent): void;
    onVisablechange(event: BeforeUnloadEvent): void;
    onError(error: ErrorEvent): Promise<void>;
    onUnhandlerejection(error: {
        type: 'unhandledrejection';
        promise: Promise<any>;
        reason: Error;
    }): Promise<void>;
    stopTracking(): void;
    private setGlobalProxy;
    removeEventListeners(): void;
    private onPageChange;
    sendMessage(message: any, storeName: any): Promise<void>;
    basicReportError(error: Error): Promise<void>;
    updateDurationMessage(stayDuration: any): Promise<boolean>;
    getLastData(storeName: string): Promise<IMessage | undefined>;
}

interface RecordReplayConfig extends RRwebPlayerOptions {
    props: any;
    startTime?: number | string;
    endTime?: number | string;
}
declare class Record$1 {
    stopFn: any;
    events: any[];
    messageWrapper: MessageQueueDBWrapper;
    constructor();
    start(): any;
    replay(dom: any, config?: RecordReplayConfig): Promise<void>;
    getRange(startTime?: any, endTime?: any): Promise<IMessage[]>;
}

declare class ClickTracker extends EventManager {
    type: string;
    constructor();
    handler(event: any): Promise<void>;
}

declare class InputTracker extends EventManager {
    type: string;
    constructor();
    handler(event: any): Promise<void>;
}

declare class ResizeTracker extends EventManager {
    type: string;
    constructor();
    handler(): void;
}

declare class SelectTracker extends EventManager {
    type: string;
    constructor();
    handler(root: any): void;
}

declare class ClipboardTracker extends EventManager {
    type: string;
    constructor();
    handler(event: ClipboardEvent): void;
}

declare class SubmitTracker extends EventManager {
    type: string;
    constructor();
    handler(event: any): void;
}

declare class Behavior {
    Events: Record<string, any>;
    constructor();
    static start(root?: HTMLElement): void;
}
declare const Click: typeof ClickTracker;
declare const Input: typeof InputTracker;
declare const Resize: typeof ResizeTracker;
declare const Selection: typeof SelectTracker;
declare const Clipboard: typeof ClipboardTracker;
declare const Submit: typeof SubmitTracker;

export { Behavior, Click, Clipboard, Input, Monitor, Record$1 as Record, Resize, Selection, Submit };
