/**
 * @desc testRedirect
 */

import * as defs from '../../baseClass';
import { request as requestMethod } from '@/axios';
export interface Params {}

export const init = undefined;
export const path = '/redirectTo';
const getParams = function (params, options?) {
  return true
    ? {
        url: `/redirectTo`,
        method: 'GET',
        params: params || {},
        ...options,
      }
    : {
        url: `/redirectTo`,
        method: 'GET',
        data: params || {},
        ...options,
      };
};
export const request = (params?: Params, options?: any) => {
  return requestMethod(getParams(params, options));
};
