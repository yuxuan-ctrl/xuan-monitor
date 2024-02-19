/**
 * @desc 用户分页查询
 */

import * as defs from '../../baseClass';
import { request as requestMethod } from '@/axios';
export interface Params {
  /** id */
  id?: number;
  /** pageIndex */
  pageIndex?: number;
  /** pageSize */
  pageSize?: number;
  /** userName */
  userName?: string;
}

export const init = new defs.Result();
export const path = '/user/getUserPage';
const getParams = function (params, options?) {
  return true
    ? {
        url: `/user/getUserPage`,
        method: 'GET',
        params: params || {},
        ...options,
      }
    : {
        url: `/user/getUserPage`,
        method: 'GET',
        data: params || {},
        ...options,
      };
};
export const request = (params?: Params, options?: any) => {
  return requestMethod(getParams(params, options));
};
