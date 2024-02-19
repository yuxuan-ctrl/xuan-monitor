/**
 * @desc testCookieRedirect
 */

import * as defs from '../../baseClass';
import { request as requestMethod } from '@/axios';
export interface Params {}

export const init = undefined;
export const path = '/setCookieRedirect';
const getParams = function (params, options?) {
  return true
    ? {
        url: `/setCookieRedirect`,
        method: 'GET',
        params: params || {},
        ...options,
      }
    : {
        url: `/setCookieRedirect`,
        method: 'GET',
        data: params || {},
        ...options,
      };
};
export const request = (params?: Params, options?: any) => {
  return requestMethod(getParams(params, options));
};
