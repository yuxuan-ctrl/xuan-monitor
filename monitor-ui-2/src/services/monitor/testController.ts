// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** testRedirect GET /redirectTo */
export async function testRedirectUsingGet(options?: { [key: string]: any }) {
  return request<any>(`${process.env.DEV}/redirectTo`, {
    method: 'GET',
    ...(options || {}),
  });
}

/** testRedirectPost POST /redirectToPost */
export async function testRedirectPostUsingPost(options?: { [key: string]: any }) {
  return request<any>(`${process.env.DEV}/redirectToPost`, {
    method: 'POST',
    ...(options || {}),
  });
}

/** testCookieRedirect GET /setCookieRedirect */
export async function testCookieRedirectUsingGet(options?: { [key: string]: any }) {
  return request<any>(`${process.env.DEV}/setCookieRedirect`, {
    method: 'GET',
    ...(options || {}),
  });
}
