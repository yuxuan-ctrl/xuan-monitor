export class ErrorInfoDto {
  /** appId */
  appId = '';

  /** createTime */
  createTime = '';

  /** errorMessage */
  errorMessage = '';

  /** errorType */
  errorType = '';

  /** pageIndex */
  pageIndex = undefined;

  /** pageSize */
  pageSize = undefined;

  /** record */
  record = [];

  /** stackTrace */
  stackTrace = '';

  /** timestamp */
  timestamp = new Timestamp();

  /** url */
  url = '';

  /** userAgent */
  userAgent = '';

  /** userId */
  userId = '';
}

export class EventsDTO {
  /** actionList */
  actionList = [];

  /** appId */
  appId = '';

  /** eventList */
  eventList = [];

  /** record */
  record = [];

  /** timestamp */
  timestamp = new Timestamp();
}

export class IPage {
  /** current */
  current = undefined;

  /** pages */
  pages = undefined;

  /** records */
  records = [];

  /** size */
  size = undefined;

  /** total */
  total = undefined;
}

export class PageResult {
  /** pageIndex */
  pageIndex = undefined;

  /** pageSize */
  pageSize = undefined;

  /** records */
  records = [];

  /** total */
  total = undefined;
}

export class ReportVo {
  /** appId */
  appId = '';

  /** data */
  data = undefined;

  /** pageUrl */
  pageUrl = '';

  /** time */
  time = '';
}

export class Result {
  /** code */
  code = undefined;

  /** data */
  data = new IPage();

  /** msg */
  msg = '';
}

export class Timestamp {
  /** date */
  date = undefined;

  /** hours */
  hours = undefined;

  /** minutes */
  minutes = undefined;

  /** month */
  month = undefined;

  /** nanos */
  nanos = undefined;

  /** seconds */
  seconds = undefined;

  /** time */
  time = undefined;

  /** year */
  year = undefined;
}

export class UserDTO {
  /** passWord */
  passWord = '';

  /** userName */
  userName = '';
}

export class Users {
  /** createTime */
  createTime = '';

  /** id */
  id = undefined;

  /** isUse */
  isUse = undefined;

  /** level */
  level = undefined;

  /** passWord */
  passWord = '';

  /** systemIds */
  systemIds = '';

  /** token */
  token = '';

  /** userName */
  userName = '';

  /** usertoken */
  usertoken = '';
}

export class Webpvuv {
  /** appId */
  appId = '';

  /** createTime */
  createTime = '';

  /** pageUrl */
  pageUrl = '';

  /** pv */
  pv = undefined;

  /** type */
  type = '';

  /** uv */
  uv = undefined;
}
