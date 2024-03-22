declare namespace API {
  type ActionInfo = {
    appId?: string;
    createTime?: string;
    data?: string;
    id?: string;
    pageUrl?: string;
    timestamp?: string;
    type?: string;
    userId?: string;
  };

  type AppsDashboardVo = {
    activeUserMap?: Record<string, any>;
    todayUserMap?: Record<string, any>;
  };

  type ErrorInfo = {
    appId?: string;
    createTime?: string;
    errorId?: string;
    errorMessage?: string;
    errorType?: string;
    pageUrl?: string;
    record?: string;
    requestUrl?: string;
    stackTrace?: string;
    timestamp?: Timestamp;
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

  type EventInfo = {
    appId?: string;
    createTime?: string;
    id?: string;
    language?: string;
    metrics?: string;
    mostVisitedPageId?: string;
    mostVisitedPageViews?: number;
    name?: string;
    pageUrl?: string;
    platform?: string;
    referrer?: string;
    screenResolution?: string;
    slowResources?: string;
    stayDuration?: number;
    timeZoneOffset?: number;
    timestamp?: string;
    uniqueKey?: string;
    userAgent?: string;
    userId?: string;
  };

  type EventsDTO = {
    actionList?: ActionInfo[];
    appId?: string;
    eventList?: EventInfo[];
    interfaceList?: InterfaceInfo[];
    location?: Location;
    platform?: string;
    record?: string;
    timestamp?: Timestamp;
    userAgent?: string;
    userId?: string;
  };

  type getAppsDashboardDataUsingGETParams = {
    /** appId */
    appId?: string;
    /** userId */
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

  type getInterfacePageUsingGETParams = {
    /** appId */
    appId?: string;
    /** pageIndex */
    pageIndex?: number;
    /** pageSize */
    pageSize?: number;
    /** userId */
    userId?: string;
    /** timeStep */
    timeStep?: string;
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

  type getSystemsByIdUsingGETParams = {
    /** appId */
    appId: string;
  };

  type getUserByIdUsingGETParams = {
    /** id */
    id: string;
  };

  type getUserDetailsUsingGETParams = {
    endTime?: string;
    pageIndex?: number;
    pageSize?: number;
    startTime?: string;
    userId?: string;
  };

  type getUserPageUsingGETParams = {
    id?: number;
    pageIndex?: number;
    pageSize?: number;
    userId?: string;
  };

  type getUsersByRegionUsingGETParams = {
    /** appId */
    appId: string;
  };

  type InterfaceInfo = {
    appId?: string;
    createTime?: string;
    duration?: number;
    id?: string;
    method?: string;
    pageUrl?: string;
    requestUrl?: string;
    timestamp?: number;
    userId?: string;
  };

  type IPageErrors = {
    current?: number;
    pages?: number;
    records?: Errors[];
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
    errorsTypeMap?: Record<string, any>;
    id?: string;
    mostFrequentPlatform?: string;
    mostFrequentScreenResolution?: string;
    mostVisitedPageId?: string;
    mostVisitedPageViews?: number;
    pastByMetric?: Metrics;
    popularList?: PageViewInfo[];
    realTimeUsers?: number;
    resolvedErrorCount?: number;
    totalErrorCount?: number;
    totalPageViews?: number;
    totalStayDuration?: number;
    uniqueVisitors?: number;
  };

  type OrderItem = {
    asc?: boolean;
    column?: string;
  };

  type Pageable = {
    offset?: number;
    pageNumber?: number;
    pageSize?: number;
    paged?: boolean;
    sort?: Sort;
    unpaged?: boolean;
  };

  type PageInterfaceInfo = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: InterfaceInfo[];
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type PageResultUserAction = {
    pageIndex?: number;
    pageSize?: number;
    records?: UserAction[];
    total?: number;
  };

  type PageUsersVo = {
    content?: UsersVo[];
    empty?: boolean;
    first?: boolean;
    last?: boolean;
    number?: number;
    numberOfElements?: number;
    pageable?: Pageable;
    size?: number;
    sort?: Sort;
    totalElements?: number;
    totalPages?: number;
  };

  type PageViewInfo = {
    averageStayDuration?: number;
    pageUrl?: string;
    totalStayDuration?: number;
    viewCount?: number;
  };

  type RegionUserVO = {
    regionCode?: string;
    regionName?: string;
    userCount?: number;
  };

  type ReportVo = {
    appId?: string;
    data?: Record<string, any>;
    pageUrl?: string;
    time?: string;
  };

  type ResultAppsDashboardVo = {
    code?: number;
    data?: AppsDashboardVo;
    msg?: string;
  };

  type ResultErrorInfo = {
    code?: number;
    data?: ErrorInfo;
    msg?: string;
  };

  type ResultIPageErrors = {
    code?: number;
    data?: IPageErrors;
    msg?: string;
  };

  type ResultListMetricsVo = {
    code?: number;
    data?: MetricsVo[];
    msg?: string;
  };

  type ResultListRegionUserVO = {
    code?: number;
    data?: RegionUserVO[];
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

  type ResultPageInterfaceInfo = {
    code?: number;
    data?: PageInterfaceInfo;
    msg?: string;
  };

  type ResultPageUsersVo = {
    code?: number;
    data?: PageUsersVo;
    msg?: string;
  };

  type ResultReportVo = {
    code?: number;
    data?: ReportVo;
    msg?: string;
  };

  type ResultSystemsduixiang = {
    code?: number;
    data?: Systemsduixiang;
    msg?: string;
  };

  type ResultUserDetailsVO = {
    code?: number;
    data?: UserDetailsVO;
    msg?: string;
  };

  type Sort = {
    empty?: boolean;
    sorted?: boolean;
    unsorted?: boolean;
  };

  type Systemsduixiang = {
    appId?: string;
    appName?: string;
    appType?: string;
    createTime?: string;
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

  type UserAction = {
    createTime?: string;
    description?: string;
    id?: string;
    pageUrl?: string;
    type?: string;
  };

  type UserDetailsVO = {
    user?: Users;
    userActionLogs?: PageResultUserAction;
  };

  type UserDTO = {
    passWord?: string;
    userName?: string;
  };

  type Users = {
    belongCity?: string;
    createTime?: string;
    ipAddress?: string;
    lastLoginTime?: string;
    location?: string;
    platform?: string;
    userAgent?: string;
    userId?: string;
  };

  type UsersVo = {
    createTime?: string;
    ipAddress?: string;
    lastLoginTime?: string;
    location?: string;
    platform?: string;
    userAgent?: string;
    userId?: string;
  };
}
