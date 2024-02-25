// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 获取系统列表 GET /systems/getSystemsList */
export async function getSystemsListUsingGet(options?: { [key: string]: any }) {
  return request<API.Systemsduixiang[]>(`${process.env.DEV}/systems/getSystemsList`, {
    method: 'GET',
    ...(options || {}),
  });
}
