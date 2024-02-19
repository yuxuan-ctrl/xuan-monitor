/**
 * @desc 监控信息上传
 */

import * as defs from '../../baseClass';
import { request as requestMethod } from '@/axios';
export interface Params {}

export const init = new defs.Result();
export const path = '/monitor/errorReport';
const getParams = function (params, options?) {
  return false
    ? {
        url: `/monitor/errorReport`,
        method: 'POST',
        params: params || {},
        ...options,
      }
    : {
        url: `/monitor/errorReport`,
        method: 'POST',
        data: params || {},
        ...options,
      };
};
export const request = (params?: Params, options?: any) => {
  return requestMethod(getParams(params, options));
};
