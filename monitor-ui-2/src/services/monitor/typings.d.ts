declare namespace API {
  type ErrorInfoDto = {
    appId?: string;
    createTime?: string;
    errorMessage?: string;
    errorType?: string;
    pageIndex?: number;
    pageSize?: number;
    record?: string[];
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
    timestamp?: Timestamp;
    url?: string;
    userId?: string;
  };

  type EventsDTO = {
    actionList?: Record<string, any>[];
    appId?: string;
    eventList?: Record<string, any>[];
    record?: string[];
    timestamp?: Timestamp;
  };

  type getDetailsUsingGETParams = {
    /** id */
    id: string;
  };

  type getMetricsUsingGETParams = {
    /** userId */
    userId?: string;
    /** startTime */
    startTime?: string;
    /** endTime */
    endTime?: string;
  };

  type getPageDataUsingGET1Params = {
    id?: number;
    pageIndex?: number;
    pageSize?: number;
    userName?: string;
  };

  type getPageDataUsingGETParams = {
    /** pageIndex */
    pageIndex: number;
    /** pageSize */
    pageSize: number;
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

  type Metrics = {
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

  type PageResultUsers = {
    pageIndex?: number;
    pageSize?: number;
    records?: Users[];
    total?: number;
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

  type ResultMetrics = {
    code?: number;
    data?: Metrics;
    msg?: string;
  };

  type ResultPageResultUsers = {
    code?: number;
    data?: PageResultUsers;
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

  type testreportUsingGETParams = {
    appId?: string;
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
    id?: number;
    isUse?: number;
    level?: number;
    passWord?: string;
    systemIds?: string;
    token?: string;
    userName?: string;
    usertoken?: string;
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
