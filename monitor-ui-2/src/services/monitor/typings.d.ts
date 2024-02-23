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
    location?: Location;
    platform?: string;
    record?: string[];
    timestamp?: Timestamp;
    userAgent?: string;
    userId?: string;
  };

  type getDetailsUsingGETParams = {
    /** id */
    id: string;
  };

  type getMetricsUsingGETParams = {
    /** userId */
    userId?: string;
    /** hoursBack */
    hoursBack?: string;
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

  type Location = {
    latitude?: number;
    longitude?: number;
  };

  type MetricsVo = {
    allUsersLength?: number;
    averageStayDuration?: number;
    createTime?: string;
    date?: string;
    id?: string;
    mostFrequentPlatform?: string;
    mostFrequentScreenResolution?: string;
    mostVisitedPageId?: string;
    mostVisitedPageViews?: number;
    pageViewGrowthCount?: number;
    totalPageViews?: number;
    totalStayDuration?: number;
    uniqueVisitorGrowthCount?: number;
    uniqueVisitors?: number;
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
