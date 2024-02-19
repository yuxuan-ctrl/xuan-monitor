/**
 * @desc 监控信息上传测试
 */

import * as defs from '../../baseClass';
import { request as requestMethod } from '@/axios';
export interface Params {
  /** pageIndex */
  pageIndex: number;
  /** pageSize */
  pageSize: number;
}

export const init = new defs.Result();
export const path = '/errors/getPageData';
const getParams = function (params, options?) {
  return true
    ? {
        url: `/errors/getPageData`,
        method: 'GET',
        params: params || {},
        ...options,
      }
    : {
        url: `/errors/getPageData`,
        method: 'GET',
        data: params || {},
        ...options,
      };
};
export const request = (params?: Params, options?: any) => {
  return requestMethod(getParams(params, options));
};
