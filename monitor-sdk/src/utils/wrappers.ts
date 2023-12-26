import {debounce} from "./debounce";

// 包裹 fetch API
function wrapFetch(originalFetch, callback) {
  return function wrappedFetch(...args) {
    try {
      return originalFetch
        .apply(this, args)
        .then(async (response) => {
          if (!response.ok) {
            const message = `${response.status} ${response.statusText} at url:${response.url} `;
            const error = new Error(message, response);
            callback(error); // 调用回调函数，将错误传递给上层处理
          }

          return response; // 返回正常的响应
        })
        .catch((error) => {
          // 在这里收集错误信息，例如记录到日志或发送到服务器
          console.error("Error in fetch:", error);
          callback(error); // 调用回调函数，将错误传递给上层处理
          throw error;
        });
    } catch (err) {
      console.log(err);
    }
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
        console.error("Error in setTimeout:", error);
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
            console.error("Error in Promise resolve:", error);
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
            console.error("Error in Promise reject:", error);
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
    if (propName !== "constructor") {
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
    debouncePageChange.call(this, "pushState", ...args);
    if (originalPushState) {
      return originalPushState.apply(history, args);
    }
  };

  history.replaceState = (...args) => {
    debouncePageChange.call(this, "replaceState", ...args);
    if (originalReplaceState) {
      return originalReplaceState.apply(history, args);
    }
  };
}

function wrapXMLHttpRequest(OriginalXMLHttpRequest, callback) {
  function wrappedXMLHttpRequest() {
    const originalRequest = new OriginalXMLHttpRequest();
    console.log("🚀 ~ file: wrappers.ts:134 ~ wrappedXMLHttpRequest ~ originalRequest:", originalRequest)

    // 包裹 open 方法
    const originalOpen = originalRequest.open;
    originalRequest.open = function (...args) {
      try {
        originalOpen.apply(this, args);
      } catch (error) {
        // 在这里收集错误信息，例如记录到日志或发送到服务器
        callback(error); // 调用回调函数，将错误传递给上层处理
        throw error;
      }
    };
    //  // 保存原始的 onreadystatechange 函数
    const originalOnReadyStateChange = originalRequest.onreadystatechange;
    originalRequest.onreadystatechange = function () {
      if (originalRequest.readyState === XMLHttpRequest.DONE) {
        if (originalRequest.status >= 400) {
          const error = new Error(`HTTP Error ${originalRequest.status} config : ${originalRequest.responseText}`);
          error.name = "XHR ERROR";
          error.cause = originalRequest
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
    originalRequest.send = function (...args) {
      try {
        originalSend.apply(this, args);
      } catch (error) {
        // 在这里收集错误信息，例如记录到日志或发送到服务器
        console.error("Error in XMLHttpRequest.send:", error);
        callback(error); // 调用回调函数，将错误传递给上层处理
      }
    };

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
      if (propName !== "constructor") {
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
