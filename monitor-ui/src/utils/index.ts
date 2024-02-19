/*
 * @Author: yuxuan-ctrl
 * @Date: 2024-02-04 09:07:38
 * @LastEditors: yuxuan-ctrl
 * @LastEditTime: 2024-02-19 18:25:44
 * @FilePath: \monitor-ui\src\utils\index.ts
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
import * as rrweb from "rrweb";
import rrwebPlayer, { RRwebPlayerOptions } from "rrweb-player";
import "rrweb-player/dist/style.css";

interface RecordReplayConfig extends RRwebPlayerOptions {
  startTime?: number | string;
  endTime?: number | string;
}

export default class Record {
  stopFn: any;
  events = [];
  constructor() {}

  // rrwebSessionSet(){

  // }

  async replay(dom, dataList, config?: RecordReplayConfig) {
    const parseData = dataList.map((item) => JSON.parse(item));
    console.log("🚀 ~ Record ~ replay ~  dataList:", parseData);
    console.log(
      "🚀 ~ Record ~ replay ~  dataList:",
      parseData.map((item) => item.data)
    );
    setTimeout(() => {
      const replayInstance = new rrwebPlayer({
        target: dom, // 可以自定义 DOM 元素
        // 配置项
        props: {
          events: parseData.map((item) => item.data),
          skipInactive: false, //是否快速跳过无用户操作的阶段
          showDebug: false, //是否在回放过程中打印 debug 信息
          showWarning: false, //是否在回放过程中打印警告信息
          autoPlay: true, //是否自动播放
          speedOption: [1, 2, 4, 8], //倍速播放可选值
          ...config?.props,
        },
      });

      replayInstance.addEventListener("finish", (payload) => {
        console.log(payload, 2222);
      });
    }, 100);
  }
}
