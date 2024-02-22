// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 监控信息上传 POST /monitor/errorReport */
export async function errorReportUsingPost(
  body: API.ErrorInfoDto,
  options?: { [key: string]: any },
) {
  return request<API.ResultReportVo>(`${process.env.DEV}/monitor/errorReport`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 监控信息上传 POST /monitor/report */
export async function reportUsingPost(body: API.EventsDTO, options?: { [key: string]: any }) {
  return request<API.ResultReportVo>(`${process.env.DEV}/monitor/report`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 监控信息上传测试 GET /monitor/report/test */
export async function testreportUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.testreportUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<API.ResultWebpvuv>(`${process.env.DEV}/monitor/report/test`, {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
