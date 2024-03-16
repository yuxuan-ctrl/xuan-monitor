// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 监控信息上传 POST /monitor/errorReport */
export async function errorReportUsingPost(body: API.ErrorInfo, options?: { [key: string]: any }) {
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
