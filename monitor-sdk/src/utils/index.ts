/*
 * @Author: yuxuan-ctrl
 * @Date: 2023-12-05 14:03:01
 * @LastEditors: yuxuan-ctrl
 * @LastEditTime: 2023-12-18 18:12:58
 * @FilePath: \monitor-sdk\src\utils\utils.ts
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
export * from './debounce';
export * from './wrappers';
export * from './layout';
export * from './calculate';

/**
 * @description: Json 转 FormData
 * @param {*} data
 */
export function json2FormData(data) {
  const formData = new FormData();
  Object.keys(data).forEach((key) => {
    let value = null;
    if (value instanceof Blob) {
      value = data[key];
    } else {
      value = JSON.stringify(data[key]);
    }
    formData.append(key, value);
  });
  return formData;
}

/**
 * @description: 生成uuid
 * @return {*}
 */
export function createUUid(): string {
  let now = new Date().getTime();
  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
    /[xy]/g,
    (char) => {
      const rand = (now + Math.random() * 16) % 16 | 0;
      now = Math.floor(now / 16);
      return (char === 'x' ? rand : (rand & 0x3) | 0x8).toString(16);
    }
  );
  return uuid;
}

export function sendBeacon(
  params: { baseUrl: string },
  formData: FormData
): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const result = navigator.sendBeacon(
      `/${params.baseUrl}/monitor/report`,
      formData
    );
    result && resolve(result);
    !result && reject(result);
  });
}

export function getTime(event?): number {
  let ts = event && event.timeStamp > 0 ? event.timeStamp : performance.now();
  return Math.max(Math.round(ts - 0), 0);
}

export function isArray(array: any[]): boolean {
  return Array.isArray(array) && array.length > 0;
}
