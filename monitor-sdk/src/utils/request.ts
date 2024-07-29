import { shouldProcessErrorReport } from '.';

export class Request {
  defaultHeaders: any;
  constructor(defaultHeaders = {}) {
    this.defaultHeaders = defaultHeaders;
  }

  // 封装通用请求方法
  xhrRequest(method, url, data = null, customHeaders = {}) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.open(method, url, true);

      // 合并请求头
      const headers = { ...this.defaultHeaders, ...customHeaders };
      for (const header in headers) {
        if (headers.hasOwnProperty(header)) {
          xhr.setRequestHeader(header, headers[header]);
        }
      }

      xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            let response = JSON.parse(xhr.responseText);
            resolve(response);
          } catch (error) {
            if (shouldProcessErrorReport(xhr.responseURL)) {
              reject(error);
            }
          }
        } else {
          if (shouldProcessErrorReport(xhr.responseURL)) {
            reject(xhr.statusText);
          }
        }
      };

      xhr.onerror = function () {
        if (shouldProcessErrorReport(xhr.responseURL)) {
          reject('Network Error');
        }
      };

      // 根据HTTP方法设置请求体
      if (['POST', 'PUT', 'PATCH'].includes(method.toUpperCase())) {
        xhr.setRequestHeader(
          'Content-Type',
          headers['Content-Type'] || 'application/json'
        );
        xhr.send(JSON.stringify(data));
      } else if (method.toUpperCase() === 'GET') {
        xhr.send(); // GET请求不需要请求体
      } else {
        if (shouldProcessErrorReport(xhr.responseURL)) {
          reject(`Unsupported request method:${method}`);
        }
      }
    });
  }

  // POST方法封装
  post(url, data = {}, customHeaders = {}) {
    return this.xhrRequest('POST', url, data, customHeaders);
  }

  // GET方法封装
  get(url, queryParams = {}, customHeaders = {}) {
    const query = Object.keys(queryParams)
      .map(
        (key) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(queryParams[key])}`
      )
      .join('&');
    const fullUrl = query ? `${url}?${query}` : url;
    return this.xhrRequest('GET', fullUrl, null, customHeaders);
  }
}
