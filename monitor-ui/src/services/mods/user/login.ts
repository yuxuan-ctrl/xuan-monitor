/**
 * @desc 用戶登录
 */

import * as defs from '../../baseClass';
import { request as requestMethod } from '@/axios';
export interface Params {}

export const init = '';
export const path = '/user/login';
const getParams = function (params, options?) {
  return false
    ? {
        url: `/user/login`,
        method: 'POST',
        params: params || {},
        ...options,
      }
    : {
        url: `/user/login`,
        method: 'POST',
        data: params || {},
        ...options,
      };
};
export const request = (params?: Params, options?: any) => {
  return requestMethod(getParams(params, options));
};
