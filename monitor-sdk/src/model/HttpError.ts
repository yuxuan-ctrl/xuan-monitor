/*
 * @Author: yuxuan-ctrl 
 * @Date: 2024-02-20 16:11:51
 * @LastEditors: yuxuan-ctrl 
 * @LastEditTime: 2024-02-26 15:07:39
 * @FilePath: \monitor-sdk\src\model\HttpError.ts
 * @Description: 
 * 
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved. 
 */
export default class HttpError extends Error {
  status: number;
  responseText: string;
  cause: XMLHttpRequest;
  method: string;
  requestUrl: string;
  data: string;
  stack:string
  constructor(
    status: number,
    method: string,
    requestUrl: string,
    data: string,
    message: string,
    xhr: XMLHttpRequest,
    stack:string
  ) {
    super(message);
    this.name = 'HTTP ERROR';
    this.status = status;
    this.responseText = xhr.responseText;
    this.cause = xhr;
    this.method = method;
    this.requestUrl = requestUrl;
    this.data = data;
    this.stack = stack;
  }
}
