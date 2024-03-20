/*
 * @Author: yuxuan-ctrl
 * @Date: 2024-02-05 17:09:13
 * @LastEditors: yuxuan-ctrl 
 * @LastEditTime: 2024-03-20 17:19:36
 * @FilePath: \monitor-sdk\src\utils\calculate.ts
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
import {
  CLSMetric,
  FCPMetric,
  FIDMetric,
  LCPMetric,
  TTFBMetric,
  onCLS,
  onFCP,
  onFID,
  onLCP,
  onTTFB,
} from 'web-vitals';

import {PerformanceResources} from "../types"

export function normalizeUrlForPath(url) {
  // Vue Router在前端处理哈希模式时，实际路由信息位于#后面
  const hashIndex = url.indexOf('#');
  let pathPart;

  if (hashIndex !== -1) {
    // 哈希模式下，提取#之后的内容作为路径
    pathPart = url.substring(hashIndex + 1);
  } else {
    // 历史模式或其他情况，直接使用pathname
    const parser = new URL(url);
    pathPart = parser.pathname;
  }

  // 将路径分割为段落，并规范化动态ID
  // 这里假设动态ID由数字、字母和下划线组成
  const dynamicIdPattern = /^[0-9_]+$/;
  const pathSegments = pathPart.split('/');
  const normalizedPathSegments = pathSegments.map((segment) => {
    return dynamicIdPattern.test(segment) ? ':id' : segment;
  });

  // 重新组合规范化后的路径（去除末尾的"/"）
  const normalizedPath = `${normalizedPathSegments.join('/')}`.replace(
    /\/$/,
    ''
  );

  return normalizedPath;
}

export async function collectWebVitals(delay:number): Promise<{
  fcp: FCPMetric | null;
  lcp: LCPMetric | null;
  ttfb: TTFBMetric | null;
  cls: CLSMetric | null;
  fid: FIDMetric | null;
}> {
  let fcp = null;
  let lcp = null;
  let cls = null;
  let fid = null;
  let ttfb = null;
  //First Contentful Paint (FCP): 首次内容绘制，当浏览器渲染了首个DOM内容元素，可以是文本、图像、SVG等。
  let fcpPromise: Promise<FCPMetric | undefined> = new Promise((resolve) => {
    onFCP((metric) => {
      fcp = metric;
      resolve(metric);
    });
  });

  //Largest Contentful Paint (LCP): 最大内容绘制，衡量网页主要内容加载完成的时间点。
  let lcpPromise: Promise<LCPMetric | undefined> = new Promise((resolve) => {
    onLCP((metric) => {
      lcp = metric;
      resolve(metric);
    });
  });

  //CLS：衡量视觉稳定性
  let clsPromise: Promise<CLSMetric | undefined> = new Promise((resolve) => {
    onCLS((metric) => {
      cls = metric;
      resolve(metric);
    });
  });

  //First Input Delay (FID): 首次输入延迟，用户首次尝试与页面交互时，从点击或触摸到浏览器能够处理该事件之间的时间。
  let fidPromise: Promise<FIDMetric | undefined> = new Promise((resolve) => {
    onFID((metric) => {
      fid = metric;
      resolve(metric);
    });
  });

  //TTFB (Time to First Byte)：服务器响应第一个字节所需的时间。
  let ttfbPromise: Promise<TTFBMetric | undefined> = new Promise((resolve) => {
    onTTFB((metric) => {
      ttfb = metric;
      resolve(metric);
    });
  });

  // 等待所有指标获取完成
  await Promise.race([
    Promise.all([lcpPromise, fcpPromise, ttfbPromise, clsPromise, fidPromise]),
    new Promise((res) => {
      setTimeout(() => res(null), delay);
    }),
  ]);

  return {
    fcp,
    lcp,
    ttfb,
    cls,
    fid,
  };
}


export async function collectSlowResources(SLOW_RESOURCE_THRESHOLD: number): Promise<Record<string, PerformanceResources[]>> {
  const slowResources: Record<string, {
    name: string;
    startTime: number;
    duration: number;
    transferSize: number;
    decodedBodySize: number;
    responseStart: number;
    responseEnd: number;
    initiatorType: string;
  }[]> = {};

  if (typeof window !== 'undefined' && 'PerformanceObserver' in window && 'performance' in window) {
    const observer = new PerformanceObserver((list, observer) => {
      console.log("🚀 ~ observer ~ list:", list)
      list.getEntries().forEach((entry: PerformanceResourceTiming) => {
        if (entry.entryType === 'resource' && entry.duration > SLOW_RESOURCE_THRESHOLD) {
          if (!slowResources[entry.name]) {
            slowResources[entry.name] = [];
          }

          const keyMetrics = {
            name: entry.name,
            startTime: entry.startTime,
            duration: entry.duration,
            transferSize: entry.transferSize,
            decodedBodySize: entry.decodedBodySize,
            responseStart: entry.responseStart,
            responseEnd: entry.responseEnd,
            initiatorType: entry.initiatorType,
          };

          slowResources[entry.name].push(keyMetrics);
        }
      });
    });

    observer.observe({ type: 'resource', buffered: true }); // 观察已经完成的资源加载事件

    // 等待一小段时间以确保获取到所有已加载的资源（可调整等待时间）
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 停止观察新的资源加载事件
    observer.disconnect();
  }

  return slowResources;
}

export function getUserLocation(timeout = 3000) {
  return new Promise((resolve, reject) => {
      const geoOptions = {
          enableHighAccuracy: true,
          timeout: timeout,
          maximumAge: 0
      };

      navigator.geolocation.getCurrentPosition(
          position => {
              resolve({
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude
              });
          },
          error => {
            resolve({
              latitude: 0,
              longitude: 0
          });
          },
          geoOptions
      );
  });
}
