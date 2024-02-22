// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 指标获取 GET /Metrics/getMetrics */
export async function getMetricsUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getMetricsUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<API.ResultMetrics>(`${process.env.DEV}/Metrics/getMetrics`, {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
