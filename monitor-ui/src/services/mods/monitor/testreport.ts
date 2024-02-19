/**
 * @desc 监控信息上传测试
 */

import * as defs from '../../baseClass';
import { request as requestMethod } from '@/axios';
export interface Params {
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

export const init = new defs.Result();
export const path = '/monitor/report/test';
const getParams = function (params, options?) {
  return true
    ? {
        url: `/monitor/report/test`,
        method: 'GET',
        params: params || {},
        ...options,
      }
    : {
        url: `/monitor/report/test`,
        method: 'GET',
        data: params || {},
        ...options,
      };
};
export const request = (params?: Params, options?: any) => {
  return requestMethod(getParams(params, options));
};
