/*
 * @Author: yuxuan-ctrl
 * @Date: 2023-12-11 15:04:54
 * @LastEditors: yuxuan-ctrl
 * @LastEditTime: 2023-12-11 16:43:39
 * @FilePath: \monitor-sdk\src\decorator\index.ts
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import { addEventListener } from "../utils/utils";

export function listener(
  event: Array<string> | string,
  element?: Element | Document
) {
  return function (target, name, descriptor) {
    const original = descriptor.value;
    const cancelListenMap = {};
    if (typeof original == "function") {
      descriptor.value = function (...args) {
        console.log("🚀 ~ file: index.ts:22 ~ args:", args);
        original.apply(this, args);
        if (Array.isArray(event)) {
          console.log(event);
          console.log(element);

          event.forEach((singleEvent) => {
            cancelListenMap[singleEvent] = addEventListener.call(
              target,
              singleEvent,
              element
            );
          });
        } else {
          cancelListenMap[event] = addEventListener.call(
            target,
            event,
            element
          );
        }
      };
    }
    return descriptor;
  };
}
