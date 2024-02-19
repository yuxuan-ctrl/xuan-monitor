/**
 * @desc testRedirectPost
 */

import * as defs from '../../baseClass';
import { request as requestMethod } from '@/axios';
export interface Params {}

export const init = undefined;
export const path = '/redirectToPost';
const getParams = function (params, options?) {
  return false
    ? {
        url: `/redirectToPost`,
        method: 'POST',
        params: params || {},
        ...options,
      }
    : {
        url: `/redirectToPost`,
        method: 'POST',
        data: params || {},
        ...options,
      };
};
export const request = (params?: Params, options?: any) => {
  return requestMethod(getParams(params, options));
};
