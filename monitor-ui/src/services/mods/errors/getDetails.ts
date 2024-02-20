/**
 * @desc 错误详情获取
 */

import * as defs from '../../baseClass';
import { request as requestMethod } from '@/axios';
export interface Params {
  /** id */
  id: string;
}

export const init = new defs.Result();
export const path = '/errors/getDetails';
const getParams = function (params, options?) {
  return true
    ? {
        url: `/errors/getDetails`,
        method: 'GET',
        params: params || {},
        ...options,
      }
    : {
        url: `/errors/getDetails`,
        method: 'GET',
        data: params || {},
        ...options,
      };
};
export const request = (params?: Params, options?: any) => {
  return requestMethod(getParams(params, options));
};
