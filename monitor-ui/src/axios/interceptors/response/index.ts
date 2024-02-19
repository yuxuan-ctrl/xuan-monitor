/*
 * @Author: yuxuan-ctrl 
 * @Date: 2024-02-19 15:08:56
 * @LastEditors: yuxuan-ctrl 
 * @LastEditTime: 2024-02-19 15:10:30
 * @FilePath: \monitor-ui\src\axios\interceptors\response\index.ts
 * @Description: 
 * 
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved. 
 */
import { get as _get } from "lodash-es";
// 响应拦截（可根据具体业务作出相应的调整）
export default [
  (response) => {
    // apiData 是 API 返回的数据
    let apiData = response.data as any;
    // 这个 Code 是和后端约定的业务 Code repCode是验证码的Code,下行代码顺序不能变apiData.repCode || apiData.errcode
    const code = apiData.repCode || apiData.errcode || apiData.code;
    // 如果没有 Code, 代表这不是项目后端开发的 API
    if (apiData.type === "application/octet-stream") {
      return apiData;
    }
    // excel文件流，return blob文件流
    if (apiData.type === "application/vnd.ms-excel") {
      return apiData;
    }
    //实际返回的对象
    let res = {
      ...apiData,
      success: code === 0,
    };

    if (code === undefined) {
      return Promise.reject(new Error("非本系统的接口"));
    } else {
      switch (code) {
        case 0:
          return res;
        // case 200:
        //   return res;
        case "0000":
          // code === "0000" 代表验证码的Code
          return res;
        default:
          // 不是正确的 Code
          return Promise.reject(response.data);
      }
    }
  },
  (error) => {
    // Status 是 HTTP 状态码
    const status = _get(error, "response.status");
    switch (status) {
      case 400:
        // error.message = "请求错误";
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
    console.log(error);
    return Promise.reject(error);
  },
];
