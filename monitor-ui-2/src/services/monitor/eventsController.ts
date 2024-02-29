// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 获取图表数据 GET /Metrics/getAppsDashboardData */
export async function getAppsDashboardDataUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getAppsDashboardDataUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<API.ResultMetricsVo>(`${process.env.DEV}/Metrics/getAppsDashboardData`, {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 获取图表数据 GET /Metrics/getChartsData */
export async function getChartsDataUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getChartsDataUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<API.ResultListMetricsVo>(`${process.env.DEV}/Metrics/getChartsData`, {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 指标获取 GET /Metrics/getMetrics */
export async function getMetricsUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getMetricsUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<API.ResultMetricsVo>(`${process.env.DEV}/Metrics/getMetrics`, {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
