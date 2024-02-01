/*
 * @Author: yuxuan-ctrl
 * @Date: 2023-12-11 15:04:54
 * @LastEditors: yuxuan-ctrl 
 * @LastEditTime: 2024-01-31 17:07:29
 * @FilePath: \monitor-sdk\src\decorator\index.ts
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */

type EventConfig = string | string[];

export function Listener(config: EventConfig) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    Reflect.defineMetadata("eventConfig", config, target, propertyKey);
    return descriptor;
  };
}

export function initializeEventListeners(Class) {
  const Events = {};
  const methods = Object.getOwnPropertyNames(Class.prototype).filter(
    (methodName) => methodName !== "constructor"
  );
  methods.forEach((methodName) => {
    const method = Class.prototype[methodName].bind(this);
    const eventConfig = Reflect.getMetadata(
      "eventConfig",
      Class.prototype,
      methodName
    );
    if (eventConfig && typeof method === "function") {
      if (Array.isArray(eventConfig)) {
        eventConfig.forEach((eventName) => {
          Events[eventName] = method;
          window.addEventListener(eventName, method);
        });
      } else {
        window.addEventListener(eventConfig, method);
        Events[eventConfig] = method;
      }
    }
  });
}
