type ObjectMap<Key extends string | number | symbol = any, Value = any> = {
  [key in Key]: Value;
};

declare namespace defs {
  export class ErrorInfoDto {
    /** appId */
    appId?: string;

    /** createTime */
    createTime?: string;

    /** errorMessage */
    errorMessage?: string;

    /** errorType */
    errorType?: string;

    /** pageIndex */
    pageIndex?: number;

    /** pageSize */
    pageSize?: number;

    /** record */
    record?: Array<string>;

    /** stackTrace */
    stackTrace?: string;

    /** timestamp */
    timestamp?: defs.Timestamp;

    /** url */
    url?: string;

    /** userAgent */
    userAgent?: string;

    /** userId */
    userId?: string;
  }

  export class Errors {
    /** appId */
    appId?: string;

    /** createTime */
    createTime?: string;

    /** errorMessage */
    errorMessage?: string;

    /** errorType */
    errorType?: string;

    /** esErrorId */
    esErrorId?: string;

    /** timestamp */
    timestamp?: defs.Timestamp;

    /** url */
    url?: string;

    /** userId */
    userId?: string;
  }

  export class EventsDTO {
    /** actionList */
    actionList?: Array<object>;

    /** appId */
    appId?: string;

    /** eventList */
    eventList?: Array<object>;

    /** record */
    record?: Array<string>;

    /** timestamp */
    timestamp?: defs.Timestamp;
  }

  export class IPage<T0 = any> {
    /** current */
    current?: number;

    /** pages */
    pages?: number;

    /** records */
    records: Array<T0>;

    /** size */
    size?: number;

    /** total */
    total?: number;
  }

  export class PageResult<T0 = any> {
    /** pageIndex */
    pageIndex?: number;

    /** pageSize */
    pageSize?: number;

    /** records */
    records: Array<T0>;

    /** total */
    total?: number;
  }

  export class ReportVo {
    /** appId */
    appId?: string;

    /** data */
    data?: object;

    /** pageUrl */
    pageUrl?: string;

    /** time */
    time?: string;
  }

  export class Result<T0 = any> {
    /** code */
    code?: number;

    /** data */
    data: T0;

    /** msg */
    msg?: string;
  }

  export class Timestamp {
    /** date */
    date?: number;

    /** hours */
    hours?: number;

    /** minutes */
    minutes?: number;

    /** month */
    month?: number;

    /** nanos */
    nanos?: number;

    /** seconds */
    seconds?: number;

    /** time */
    time?: number;

    /** year */
    year?: number;
  }

  export class UserDTO {
    /** passWord */
    passWord?: string;

    /** userName */
    userName?: string;
  }

  export class Users {
    /** createTime */
    createTime?: string;

    /** id */
    id?: number;

    /** isUse */
    isUse?: number;

    /** level */
    level?: number;

    /** passWord */
    passWord?: string;

    /** systemIds */
    systemIds?: string;

    /** token */
    token?: string;

    /** userName */
    userName?: string;

    /** usertoken */
    usertoken?: string;
  }

  export class Webpvuv {
    /** appId */
    appId?: string;

    /** createTime */
    createTime?: string;

    /** pageUrl */
    pageUrl?: string;

    /** pv */
    pv?: number;

    /** type */
    type?: string;

    /** uv */
    uv?: number;
  }
}

declare namespace API {
  /**
   * 错误接口
   */
  export namespace errors {
    /**
     * 错误详情获取
     * /errors/getDetails
     */
    export namespace getDetails {
      export class Params {
        /** id */
        id: string;
      }

      export type Response = defs.Result<defs.ErrorInfoDto>;
      export const path = '/errors/getDetails';

      export const init: Response;

      export function request(
        params?: Params,
        options?: any,
      ): Promise<Response>;
    }

    /**
     * 错误列表获取
     * /errors/getPageData
     */
    export namespace getPageData {
      export class Params {
        /** pageIndex */
        pageIndex: number;
        /** pageSize */
        pageSize: number;
      }

      export type Response = defs.Result<defs.IPage<defs.Errors>>;
      export const path = '/errors/getPageData';

      export const init: Response;

      export function request(
        params?: Params,
        options?: any,
      ): Promise<Response>;
    }
  }

  /**
   * 监控接口
   */
  export namespace monitor {
    /**
     * 监控信息上传
     * /monitor/errorReport
     */
    export namespace errorReport {
      export class Params {}

      export type Response = defs.Result<defs.ReportVo>;
      export const path = '/monitor/errorReport';

      export const init: Response;

      export function request(
        params?: Params,
        body?: defs.ErrorInfoDto,
        options?: any,
      ): Promise<Response>;
    }

    /**
     * 监控信息上传
     * /monitor/report
     */
    export namespace report {
      export class Params {}

      export type Response = defs.Result<defs.ReportVo>;
      export const path = '/monitor/report';

      export const init: Response;

      export function request(
        params?: Params,
        body?: defs.EventsDTO,
        options?: any,
      ): Promise<Response>;
    }

    /**
     * 监控信息上传测试
     * /monitor/report/test
     */
    export namespace testreport {
      export class Params {
        /** appId */
        appId?: string;
        /** record */
        record?: Array<string>;
        /** date */
        date?: number;
        /** day */
        day?: number;
        /** hours */
        hours?: number;
        /** minutes */
        minutes?: number;
        /** month */
        month?: number;
        /** nanos */
        nanos?: number;
        /** seconds */
        seconds?: number;
        /** time */
        time?: number;
        /** timezoneOffset */
        timezoneOffset?: number;
        /** year */
        year?: number;
      }

      export type Response = defs.Result<defs.Webpvuv>;
      export const path = '/monitor/report/test';

      export const init: Response;

      export function request(
        params?: Params,
        options?: any,
      ): Promise<Response>;
    }
  }

  /**
   * Test Controller
   */
  export namespace test {
    /**
     * testRedirect
     * /redirectTo
     */
    export namespace testRedirect {
      export class Params {}

      export type Response = any;
      export const path = '/redirectTo';

      export const init: Response;

      export function request(
        params?: Params,
        options?: any,
      ): Promise<Response>;
    }

    /**
     * testRedirectPost
     * /redirectToPost
     */
    export namespace testRedirectPost {
      export class Params {}

      export type Response = any;
      export const path = '/redirectToPost';

      export const init: Response;

      export function request(
        params?: Params,
        options?: any,
      ): Promise<Response>;
    }

    /**
     * testCookieRedirect
     * /setCookieRedirect
     */
    export namespace testCookieRedirect {
      export class Params {}

      export type Response = any;
      export const path = '/setCookieRedirect';

      export const init: Response;

      export function request(
        params?: Params,
        options?: any,
      ): Promise<Response>;
    }
  }

  /**
   * 用户管理
   */
  export namespace user {
    /**
     * 手写分页查询用户列表
     * /user/getPageData
     */
    export namespace getPageData {
      export class Params {
        /** id */
        id?: number;
        /** pageIndex */
        pageIndex?: number;
        /** pageSize */
        pageSize?: number;
        /** userName */
        userName?: string;
      }

      export type Response = defs.Result<defs.PageResult<defs.Users>>;
      export const path = '/user/getPageData';

      export const init: Response;

      export function request(
        params?: Params,
        options?: any,
      ): Promise<Response>;
    }

    /**
     * 用户通过Id查询
     * /user/getUserById
     */
    export namespace getUserById {
      export class Params {
        /** id */
        id: string;
      }

      export type Response = defs.Users;
      export const path = '/user/getUserById';

      export const init: Response;

      export function request(
        params?: Params,
        options?: any,
      ): Promise<Response>;
    }

    /**
     * 用户列表查询
     * /user/getUserList
     */
    export namespace getUserList {
      export class Params {}

      export type Response = Array<defs.Users>;
      export const path = '/user/getUserList';

      export const init: Response;

      export function request(
        params?: Params,
        options?: any,
      ): Promise<Response>;
    }

    /**
     * 用户分页查询
     * /user/getUserPage
     */
    export namespace getUserPage {
      export class Params {
        /** id */
        id?: number;
        /** pageIndex */
        pageIndex?: number;
        /** pageSize */
        pageSize?: number;
        /** userName */
        userName?: string;
      }

      export type Response = defs.Result<defs.IPage<defs.Users>>;
      export const path = '/user/getUserPage';

      export const init: Response;

      export function request(
        params?: Params,
        options?: any,
      ): Promise<Response>;
    }

    /**
     * 用戶登录
     * /user/login
     */
    export namespace login {
      export class Params {}

      export type Response = string;
      export const path = '/user/login';

      export const init: Response;

      export function request(
        params?: Params,
        body?: defs.UserDTO,
        options?: any,
      ): Promise<Response>;
    }
  }
}
