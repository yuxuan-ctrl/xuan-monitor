// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 用户通过Id查询 GET /user/getUserById */
export async function getUserByIdUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getUserByIdUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<API.Users>(`${process.env.DEV}/user/getUserById`, {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 获取用户详情信息 GET /user/getUserDetails */
export async function getUserDetailsUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getUserDetailsUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<API.ResultUserDetailsVO>(`${process.env.DEV}/user/getUserDetails`, {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 用户列表查询 GET /user/getUserList */
export async function getUserListUsingGet(options?: { [key: string]: any }) {
  return request<API.Users[]>(`${process.env.DEV}/user/getUserList`, {
    method: 'GET',
    ...(options || {}),
  });
}

/** 用户分页查询 GET /user/getUserPage */
export async function getUserPageUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getUserPageUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<API.ResultPageUsersVo>(`${process.env.DEV}/user/getUserPage`, {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 用户地域分布数量 GET /user/getUsersByRegion */
export async function getUsersByRegionUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getUsersByRegionUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<API.ResultListRegionUserVO>(`${process.env.DEV}/user/getUsersByRegion`, {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 用戶登录 POST /user/login */
export async function loginUsingPost(body: API.UserDTO, options?: { [key: string]: any }) {
  return request<string>(`${process.env.DEV}/user/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
