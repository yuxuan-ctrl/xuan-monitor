/**
 * @desc 用户列表查询
 */

import * as defs from '../../baseClass';
import { request as requestMethod } from '@/axios';
export interface Params {}

export const init = [];
export const path = '/user/getUserList';
const getParams = function (params, options?) {
  return true
    ? {
        url: `/user/getUserList`,
        method: 'GET',
        params: params || {},
        ...options,
      }
    : {
        url: `/user/getUserList`,
        method: 'GET',
        data: params || {},
        ...options,
      };
};
export const request = (params?: Params, options?: any) => {
  return requestMethod(getParams(params, options));
};
