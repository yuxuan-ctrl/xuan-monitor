declare namespace API {
  type ErrorInfoDto = {
    appId?: string;
    createTime?: string;
    errorMessage?: string;
    errorType?: string;
    pageIndex?: number;
    pageSize?: number;
    record?: string[];
    requestUrl?: string;
    stackTrace?: string;
    timestamp?: Timestamp;
    url?: string;
    userAgent?: string;
    userId?: string;
  };

  type Errors = {
    appId?: string;
    createTime?: string;
    errorMessage?: string;
    errorType?: string;
    esErrorId?: string;
    isResolved?: number;
    timestamp?: Timestamp;
    url?: string;
    userId?: string;
  };

  type EventsDTO = {
    actionList?: Record<string, any>[];
    appId?: string;
    eventList?: Record<string, any>[];
    location?: Location;
    platform?: string;
    record?: string[];
    timestamp?: Timestamp;
    userAgent?: string;
    userId?: string;
  };

  type getChartsDataUsingGETParams = {
    /** appId */
    appId?: string;
    /** startTime */
    startTime?: string;
    /** endTime */
    endTime?: string;
  };

  type getDetailsUsingGETParams = {
    /** id */
    id: string;
  };

  type getMetricsUsingGETParams = {
    /** appId */
    appId?: string;
    /** userId */
    userId?: string;
    /** currentDay */
    currentDay?: string;
  };

  type getPageDataUsingGETParams = {
    /** pageIndex */
    pageIndex: number;
    /** pageSize */
    pageSize: number;
    /** userId */
    userId?: string;
  };

  type getUserByIdUsingGETParams = {
    /** id */
    id: string;
  };

  type getUserPageUsingGETParams = {
    id?: number;
    pageIndex?: number;
    pageSize?: number;
    userName?: string;
  };

  type IPageErrors = {
    current?: number;
    pages?: number;
    records?: Errors[];
    size?: number;
    total?: number;
  };

  type IPageUsers = {
    current?: number;
    pages?: number;
    records?: Users[];
    size?: number;
    total?: number;
  };

  type Location = {
    latitude?: number;
    longitude?: number;
  };

  type Metrics = {
    allUsersLength?: number;
    averageStayDuration?: number;
    createTime?: string;
    date?: string;
    id?: string;
    mostFrequentPlatform?: string;
    mostFrequentScreenResolution?: string;
    mostVisitedPageId?: string;
    mostVisitedPageViews?: number;
    totalPageViews?: number;
    totalStayDuration?: number;
    uniqueVisitors?: number;
  };

  type MetricsVo = {
    allUsersLength?: number;
    averageStayDuration?: number;
    createTime?: string;
    dailyErrorCount?: number;
    date?: string;
    errorsTypeMap?: Record<string, any>;
    id?: string;
    mostFrequentPlatform?: string;
    mostFrequentScreenResolution?: string;
    mostVisitedPageId?: string;
    mostVisitedPageViews?: number;
    pastByMetric?: Metrics;
    popularList?: PageViewInfo[];
    resolvedErrorCount?: number;
    totalErrorCount?: number;
    totalPageViews?: number;
    totalStayDuration?: number;
    uniqueVisitors?: number;
  };

  type PageViewInfo = {
    averageStayDuration?: number;
    pageUrl?: string;
    totalStayDuration?: number;
    viewCount?: number;
  };

  type ReportVo = {
    appId?: string;
    data?: Record<string, any>;
    pageUrl?: string;
    time?: string;
  };

  type ResultErrorInfoDto = {
    code?: number;
    data?: ErrorInfoDto;
    msg?: string;
  };

  type ResultIPageErrors = {
    code?: number;
    data?: IPageErrors;
    msg?: string;
  };

  type ResultIPageUsers = {
    code?: number;
    data?: IPageUsers;
    msg?: string;
  };

  type ResultListMetricsVo = {
    code?: number;
    data?: MetricsVo[];
    msg?: string;
  };

  type ResultListSystemsduixiang = {
    code?: number;
    data?: Systemsduixiang[];
    msg?: string;
  };

  type ResultMetricsVo = {
    code?: number;
    data?: MetricsVo;
    msg?: string;
  };

  type ResultReportVo = {
    code?: number;
    data?: ReportVo;
    msg?: string;
  };

  type ResultWebpvuv = {
    code?: number;
    data?: Webpvuv;
    msg?: string;
  };

  type Systemsduixiang = {
    appId?: string;
    appName?: string;
    appType?: string;
    createTime?: string;
  };

  type testreportUsingGETParams = {
    appId?: string;
    'location.latitude'?: number;
    'location.longitude'?: number;
    platform?: string;
    record?: string[];
    'timestamp.date'?: number;
    'timestamp.day'?: number;
    'timestamp.hours'?: number;
    'timestamp.minutes'?: number;
    'timestamp.month'?: number;
    'timestamp.nanos'?: number;
    'timestamp.seconds'?: number;
    'timestamp.time'?: number;
    'timestamp.timezoneOffset'?: number;
    'timestamp.year'?: number;
    userAgent?: string;
    userId?: string;
  };

  type Timestamp = {
    date?: number;
    hours?: number;
    minutes?: number;
    month?: number;
    nanos?: number;
    seconds?: number;
    time?: number;
    year?: number;
  };

  type UserDTO = {
    passWord?: string;
    userName?: string;
  };

  type Users = {
    createTime?: string;
    ipAddress?: string;
    lastLoginTime?: string;
    location?: string;
    platform?: string;
    userAgent?: string;
    userId?: string;
  };

  type Webpvuv = {
    appId?: string;
    createTime?: string;
    pageUrl?: string;
    pv?: number;
    type?: string;
    uv?: number;
  };
}
