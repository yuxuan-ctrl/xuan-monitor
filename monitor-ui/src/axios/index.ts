/*
 * @Author: yuxuanli
 * @Date: 2023-08-01 10:27:13
 * @LastEditors: yuxuan-ctrl 
 * @LastEditTime: 2024-02-19 16:58:49
 * @FilePath: \monitor-ui\src\axios\index.ts
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
// import { getToken } from "@/utils/storage";
import axios, { type AxiosInstance, type AxiosRequestConfig } from "axios";
import { get as _get } from "lodash-es";
import { request as requestIcp, response as responseIcp } from "./interceptors";

/** 创建请求实例 */
function createService() {
  // 创建一个 Axios 实例
  const service = axios.create();
  return service;
}

/** 创建请求方法 */
function createRequestFunction(service: AxiosInstance, baseURL?: string) {
  return function <T>(config: AxiosRequestConfig): Promise<T> {
    const configDefault = {
      headers: {
        // 携带 Token
        // Authorization: getToken("user-token")
        //   ? "Bearer " + getToken("user-token")
        //   : "",
        "Content-Type": _get(
          config,
          "headers.Content-Type",
          "application/json",
        ),
      },
      timeout: 10000,
      baseURL: baseURL,
      // baseURL: "/dsp3-admin/",
      data: {},
    };
    return service(Object.assign(configDefault, config));
  };
}

function get<T>(config: AxiosRequestConfig): Promise<T> {
  return request({
    method: "GET",
    params: {},
    ...config,
  });
}

function post<T>(config: AxiosRequestConfig): Promise<T> {
  return request({
    method: "POST",
    data: {},
    ...config,
  });
}
/** 用于网络请求的实例 */
export const service = createService();

service.interceptors.request.use(requestIcp[0], requestIcp[1]);
service.interceptors.response.use(responseIcp[0], responseIcp[1]);

/** 用于网络请求的方法 */
export const request = createRequestFunction(service,'/api');
/** 其他模块的请求 */
export const otherModuleRequest = createRequestFunction(service, "/");

export { get, post };
