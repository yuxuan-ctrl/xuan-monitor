// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 错误详情获取 GET /errors/getDetails */
export async function getDetailsUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getDetailsUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<API.ResultErrorInfo>(`${process.env.DEV}/errors/getDetails`, {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 错误列表获取 GET /errors/getPageData */
export async function getPageDataUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getPageDataUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<API.ResultIPageErrors>(`${process.env.DEV}/errors/getPageData`, {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
