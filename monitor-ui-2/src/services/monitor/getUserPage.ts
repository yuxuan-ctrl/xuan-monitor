// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 用户分页查询 GET /user/getUserPage */
export async function getUserPageUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getUserPageUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<API.ResultIPageUsers>(`${process.env.DEV}/user/getUserPage`, {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
