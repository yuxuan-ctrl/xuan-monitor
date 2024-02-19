/*
 * @Author: yuxuan-ctrl 
 * @Date: 2024-02-19 15:08:56
 * @LastEditors: yuxuan-ctrl 
 * @LastEditTime: 2024-02-19 16:46:17
 * @FilePath: \monitor-ui\src\axios\interceptors\request\index.ts
 * @Description: 
 * 
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved. 
 */
// 请求拦截
export default [
  (config: any) => config,
  // 发送失败
  (error: any) => Promise.reject(error),
];
