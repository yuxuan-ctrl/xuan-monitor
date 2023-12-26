import axios, { type AxiosInstance, type AxiosRequestConfig } from "axios";
import { get } from "lodash-es";

/** 创建请求实例 */
function createService() {
  // 创建一个 Axios 实例
  const service = axios.create();
  // 请求拦截
  service.interceptors.request.use(
    (config) => {
      // 取消重复请求
      //  removeSource(config)
      //  config.cancelToken = new CancelToken((c) => {
      //    // 将取消函数存起来
      //    sources.push({ umet: config.url + '&' + config.method, cancel: c })
      //  })
      return config;
    },
    // 发送失败
    (error) => Promise.reject(error)
  );
  // 响应拦截（可根据具体业务作出相应的调整）
  service.interceptors.response.use(
    (response) => {
      // apiData 是 API 返回的数据
      const apiData = response.data as any;
      // 这个 Code 是和后端约定的业务 Code
      const code = apiData.code;
      // 如果没有 Code, 代表这不是项目后端开发的 API
      if (code === 200 || code === 0) {
        return apiData;
      } else {
        ElMessage.error(apiData.msg || "Error");
        return apiData;
      }
    },
    (error) => {
      // Status 是 HTTP 状态码
      const status = get(error, "response.status");
      switch (status) {
        case 400:
          error.message = "请求错误";
          break;
        case 401:
          error.message = "登录超时，请重新登录";
          break;
        case 403:
          error.message = "拒绝访问";
          break;
        case 404:
          error.message = "请求地址出错";
          break;
        case 408:
          error.message = "请求超时";
          break;
        case 500:
          error.message = "服务器内部错误";
          break;
        case 501:
          error.message = "服务未实现";
          break;
        case 502:
          error.message = "网关错误";
          break;
        case 503:
          error.message = "服务不可用";
          break;
        case 504:
          error.message = "网关超时";
          break;
        case 505:
          error.message = "HTTP 版本不受支持";
          break;
        default:
          break;
      }
      ElMessage.error(error.message);
      return Promise.reject(error);
    }
  );
  return service;
}

/** 创建请求方法 */
function createRequestFunction(service: AxiosInstance) {
  return function <T>(config: AxiosRequestConfig): Promise<T> {
    const configDefault = {
      headers: {
        // 携带 Token
        // 'x-dg-username':'gjb',
      },
      timeout: 10000,
      baseURL: "/",
      data: {},
    };
    return service(Object.assign(configDefault, config));
  };
}
function createRequestFunctionFormData(service: AxiosInstance) {
  return function <T>(config: AxiosRequestConfig): Promise<T> {
    let formData = new FormData();
    console.log(config.data);

    for (const item of Object.keys(config.data)) {
      formData.append(item, config.data[item]);
    }
    console.log(formData.get("file"));

    const configDefault = {
      headers: {
        // 携带 Token
        // 'x-dg-username':'gjb',
        Authorization: getToken("access-token") ? "Bearer " + getToken("access-token") ?? "" : "",
        "Content-Type": get(config, "headers.Content-Type", "multipart/form-data"),
      },
      timeout: 10000,
      baseURL: import.meta.env.VITE_BASE_API,
      data: formData,
    };
    return service(Object.assign(configDefault, config));
  };
}

/** 用于网络请求的实例 */
export const service = createService();
/** 用于网络请求的方法 */
export const request = createRequestFunction(service);
export const requestFormData = createRequestFunctionFormData(service);
