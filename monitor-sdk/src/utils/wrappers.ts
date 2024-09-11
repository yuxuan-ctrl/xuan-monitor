import { debounce } from './debounce';
import HttpError from '../model/HttpError';
import MessageQueueDBWrapper from '../core/Message';
import { DB_CONFIG } from '../config/dbconfig';
import {
  formatDate,
  getCurrentUnix,
  normalizeUrlForPath,
  createUUid,
} from '../utils';

const REQUEST_HEADER = 'Fi-Request-Id';
const messageWrapper = MessageQueueDBWrapper.getInstance({
  dbName: 'monitorxq',
  dbVersion: 1,
  storeName: DB_CONFIG.INTERFACE_STORE_NAME,
});

const enqueueHttpRequest = function (data) {
  if (!data.config?.enableSuccessLogging && data.status === 200) {
    return;
  }
  if (
    data &&
    !data?.requestUrl.includes('/monitor/report') &&
    !data?.requestUrl.includes('/monitor/errorReport')
  ) {
    const eventData = {
      timestamp: getCurrentUnix(),
      createTime: formatDate(new Date()),
      pageUrl: normalizeUrlForPath(window.location.href),
      type: 'HttpRequest',
      ...data,
    };
    messageWrapper.enqueue(
      { ...eventData, session: new Date().getDate() },
      DB_CONFIG.INTERFACE_STORE_NAME
    );
  }
};

// 包裹 fetch API
function wrapFetch(originalFetch, callback, config) {
  return function wrappedFetch(...args) {
    let startTimeFetch = performance.now();
    const method = args.length > 1 ? args[1]?.method : 'GET';
    let errorContext = new Error().stack;
    try {
      if (Reflect.has(args[1], 'headers')) {
        args[1].headers[REQUEST_HEADER] = createUUid();
      }
      return originalFetch
        .apply(this, args)
        .then(async (response) => {
          let endTimeFetch = performance.now();
          let durationFetch = endTimeFetch - startTimeFetch;
          let requestUrl = typeof args[0] === 'string' ? args[0] : args[0].href;
          const body = args[1]?.body || '';
          const headers = args[1]?.headers || '';
          const res = await response.json();
          enqueueHttpRequest({
            method,
            requestUrl,
            duration: durationFetch.toFixed(2),
            response: JSON.stringify(res),
            status: response.status,
            body,
            headers: JSON.stringify(headers),
            config,
          });
          if (!response.ok && !response.url.includes('/monitor/errorReport')) {
            const error = new HttpError(
              response.status,
              method,
              response.url,
              response,
              `HTTP Error ${response.status} config : ${response.statusText}`,
              response,
              errorContext
            );
            callback(error); // 调用回调函数，将错误传递给上层处理
          }

          return response; // 返回正常的响应
        })
        .catch((error) => {
          // 在这里收集错误信息，例如记录到日志或发送到服务器
          callback(error); // 调用回调函数，将错误传递给上层处理
          throw error;
        });
    } catch (err) {
      console.log(err);
    }
    errorContext = null;
  };
}

// 包裹 setTimeout API
function wrapSetTimeout(originalSetTimeout, callback) {
  return function wrappedSetTimeout(handler, timeout) {
    const wrappedHandler = (...args) => {
      try {
        handler.apply(this, args);
      } catch (error) {
        // 在这里收集错误信息，例如记录到日志或发送到服务器
        callback(error); // 调用回调函数，将错误传递给上层处理
        throw error;
      }
    };

    return originalSetTimeout(wrappedHandler, timeout);
  };
}

// 包裹 Promise API
function wrapPromise(OriginalPromise, callback) {
  function wrappedPromise(executor) {
    return new OriginalPromise((resolve, reject) => {
      executor(
        //resolve
        (value) => {
          try {
            resolve(value);
          } catch (error) {
            // 在这里收集错误信息，例如记录到日志或发送到服务器
            callback(error); // 调用回调函数，将错误传递给上层处理
            // 如果你想让原始的错误继续传播，可以在这里重新抛出错误
            throw error;
          }
        },
        //reject
        (reason) => {
          try {
            reject(reason);
          } catch (error) {
            // 在这里收集错误信息，例如记录到日志或发送到服务器
            callback(error); // 调用回调函数，将错误传递给上层处理
            throw error;
          }
        }
      );
    });
  }

  // 将 OriginalPromise 的静态方法和原型方法复制到 wrappedPromise
  Object.setPrototypeOf(wrappedPromise, OriginalPromise);
  Object.setPrototypeOf(wrappedPromise.prototype, OriginalPromise.prototype);
  Object.getOwnPropertyNames(OriginalPromise).forEach((propName) => {
    const descriptor = Object.getOwnPropertyDescriptor(
      OriginalPromise,
      propName
    );
    if (descriptor) {
      // 尝试复制所有属性，包括只读属性
      Object.defineProperty(wrappedPromise, propName, descriptor);
    }
  });
  Object.getOwnPropertyNames(OriginalPromise.prototype).forEach((propName) => {
    if (propName !== 'constructor') {
      const descriptor = Object.getOwnPropertyDescriptor(
        OriginalPromise.prototype,
        propName
      );
      if (descriptor) {
        Object.defineProperty(wrappedPromise.prototype, propName, descriptor);
      }
    }
  });

  return wrappedPromise;
}

function wrapHistory(history, callback) {
  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;

  const debouncePageChange = debounce((method, ...args) => {
    callback(method, ...args);
  }, 300);

  history.pushState = (...args) => {
    debouncePageChange.call(this, 'pushState', ...args);
    if (originalPushState) {
      return originalPushState.apply(history, args);
    }
  };

  history.replaceState = (...args) => {
    debouncePageChange.call(this, 'replaceState', ...args);
    if (originalReplaceState) {
      return originalReplaceState.apply(history, args);
    }
  };
}

function wrapXMLHttpRequest(OriginalXMLHttpRequest, callback, config) {
  let method = null;
  let data = null;
  let errorContext = '';
  let headers = {};
  function wrappedXMLHttpRequest() {
    let startTime = performance.now();
    const originalRequest = new OriginalXMLHttpRequest();

    // 重写 setRequestHeader 方法
    const originSetRequestHeader = originalRequest.setRequestHeader;
    originalRequest.setRequestHeader = function (name, value) {
      headers[name] = value; // 记录请求头
      // 调用原始的 setRequestHeader 方法
      originSetRequestHeader.call(this, name, value);
    };

    // 包裹 open 方法
    const originalOpen = originalRequest.open;
    OriginalXMLHttpRequest.prototype.open = function (...args) {
      try {
        method = args[0];
        originalOpen.apply(this, args);
      } catch (error) {
        console.log('🚀 ~ wrappedXMLHttpRequest ~ error:', error);
        // 在这里收集错误信息，例如记录到日志或发送到服务器
        callback(error); // 调用回调函数，将错误传递给上层处理
      }
    };

    //  // 保存原始的 onreadystatechange 函数
    const originalOnReadyStateChange = originalRequest.onreadystatechange;

    originalRequest.onreadystatechange = function (event) {
      if(originalRequest.readyState === XMLHttpRequest.OPENED){
        originalRequest.setRequestHeader(REQUEST_HEADER, createUUid());
      }
      if (originalRequest.readyState === XMLHttpRequest.DONE) {
        let endTime = performance.now();
        let duration = endTime - startTime;
        const requestUrl = originalRequest.responseURL;
        console.log(`请求和响应耗时: ${duration.toFixed(2)} 毫秒`);
        enqueueHttpRequest({
          method,
          requestUrl,
          duration: duration.toFixed(2),
          response: originalRequest.response,
          status: originalRequest.status,
          body: data,
          headers: JSON.stringify(headers),
          config,
        });
        if (
          originalRequest.status >= 400 &&
          !requestUrl.includes('/monitor/errorReport')
        ) {
          const error = new HttpError(
            originalRequest.status,
            method,
            data,
            requestUrl,
            `HTTP Error ${originalRequest.status} config : ${originalRequest.responseText}`,
            originalRequest,
            errorContext
          );
          callback(error); // 调用回调函数，将错误传递给上层处理
        }

        // 调用原始的 onreadystatechange 函数
        if (originalOnReadyStateChange) {
          originalOnReadyStateChange.apply(this, arguments);
        }
      }
    };

    // 包裹 send 方法
    const originalSend = originalRequest.send;

    OriginalXMLHttpRequest.prototype.send = function (...args) {
      errorContext = new Error().stack;
      try {
        data = args[0];
        originalSend.apply(this, args);
      } catch (error) {
        // 在这里收集错误信息，例如记录到日志或发送到服务器
        callback(error); // 调用回调函数，将错误传递给上层处理
      }
    };

    method = null;
    data = null;
    errorContext = null;
    return originalRequest;
  }

  // 将 OriginalXMLHttpRequest 的静态方法和原型方法复制到 wrappedXMLHttpRequest
  Object.setPrototypeOf(wrappedXMLHttpRequest, OriginalXMLHttpRequest);
  Object.setPrototypeOf(
    wrappedXMLHttpRequest.prototype,
    OriginalXMLHttpRequest.prototype
  );
  Object.getOwnPropertyNames(OriginalXMLHttpRequest).forEach((propName) => {
    const descriptor = Object.getOwnPropertyDescriptor(
      OriginalXMLHttpRequest,
      propName
    );
    if (descriptor) {
      // 尝试复制所有属性，包括只读属性
      Object.defineProperty(wrappedXMLHttpRequest, propName, descriptor);
    }
  });
  Object.getOwnPropertyNames(OriginalXMLHttpRequest.prototype).forEach(
    (propName) => {
      if (propName !== 'constructor') {
        const descriptor = Object.getOwnPropertyDescriptor(
          OriginalXMLHttpRequest.prototype,
          propName
        );
        if (descriptor) {
          Object.defineProperty(
            wrappedXMLHttpRequest.prototype,
            propName,
            descriptor
          );
        }
      }
    }
  );

  return wrappedXMLHttpRequest;
}

export {
  wrapFetch,
  wrapSetTimeout,
  wrapPromise,
  wrapHistory,
  wrapXMLHttpRequest,
};
