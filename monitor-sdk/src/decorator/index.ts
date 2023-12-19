/*
 * @Author: yuxuan-ctrl
 * @Date: 2023-12-11 15:04:54
 * @LastEditors: yuxuan-ctrl
 * @LastEditTime: 2023-12-19 10:19:34
 * @FilePath: \monitor-sdk\src\decorator\index.ts
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */

function addEventListener(
  eventName: string,
  originalMethod: (...args: any[]) => void
) {
  if (["pushState", "replaceState"].includes(eventName)) {
    const historyMethod = history[eventName];
    history[eventName] = function () {
      const result = historyMethod.apply(history, arguments);
      originalMethod.apply(this, [eventName, ...arguments]);
      return result;
    };
  } else {
    window.addEventListener(eventName, (...args: any[]) => {
      originalMethod.apply(this, [eventName, ...args]);
    });
  }
}

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
