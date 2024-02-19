/**
 * @desc 用户通过Id查询
 */

import * as defs from '../../baseClass';
import { request as requestMethod } from '@/axios';
export interface Params {
  /** id */
  id: string;
}

export const init = new defs.Users();
export const path = '/user/getUserById';
const getParams = function (params, options?) {
  return true
    ? {
        url: `/user/getUserById`,
        method: 'GET',
        params: params || {},
        ...options,
      }
    : {
        url: `/user/getUserById`,
        method: 'GET',
        data: params || {},
        ...options,
      };
};
export const request = (params?: Params, options?: any) => {
  return requestMethod(getParams(params, options));
};
