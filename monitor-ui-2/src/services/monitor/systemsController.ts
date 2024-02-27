// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 新增系统 POST /systems/createSystem */
export async function createSystemUsingPost(
  body: API.Systemsduixiang,
  options?: { [key: string]: any },
) {
  return request<API.ResultSystemsduixiang>(`${process.env.DEV}/systems/createSystem`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 修改系统 PUT /systems/editSystem */
export async function editSystemUsingPut(
  body: API.Systemsduixiang,
  options?: { [key: string]: any },
) {
  return request<API.ResultSystemsduixiang>(`${process.env.DEV}/systems/editSystem`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取系统详情 GET /systems/getSystemsById */
export async function getSystemsByIdUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getSystemsByIdUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<API.ResultSystemsduixiang>(`${process.env.DEV}/systems/getSystemsById`, {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 获取系统列表 GET /systems/getSystemsList */
export async function getSystemsListUsingGet(options?: { [key: string]: any }) {
  return request<API.ResultListSystemsduixiang>(`${process.env.DEV}/systems/getSystemsList`, {
    method: 'GET',
    ...(options || {}),
  });
}
