// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** getInterfaceInfoById GET /performance/getInterfaceInfoById */
export async function getInterfaceInfoByIdUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getInterfaceInfoByIdUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<API.ResultInterfaceInfo>(`${process.env.DEV}/performance/getInterfaceInfoById`, {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** getInterfacePage GET /performance/getInterfacePage */
export async function getInterfacePageUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getInterfacePageUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<API.ResultPageInterfaceInfo>(`${process.env.DEV}/performance/getInterfacePage`, {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
