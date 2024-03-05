/*
 * @Author: yuxuan-ctrl
 * @Date: 2024-02-04 09:07:38
 * @LastEditors: yuxuan-ctrl
 * @LastEditTime: 2024-03-05 16:58:43
 * @FilePath: \monitor-ui-2\src\utils\record.ts
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
import rrwebPlayer, { RRwebPlayerOptions } from 'rrweb-player';
import 'rrweb-player/dist/style.css';

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
    const parseData = JSON.parse(dataList).map((item) => JSON.parse(item));

    setTimeout(() => {
      const replayInstance = new rrwebPlayer({
        target: dom, // 可以自定义 DOM 元素
        // 配置项
        props: {
          events: parseData.map((item) => item.data),
          skipInactive: true, //是否快速跳过无用户操作的阶段
          showDebug: false, //是否在回放过程中打印 debug 信息
          showWarning: false, //是否在回放过程中打印警告信息
          autoPlay: false, //是否自动播放
          speedOption: [1, 2, 4, 8], //倍速播放可选值
          ...config?.props,
        },
      });

      replayInstance.addEventListener('finish', (payload) => {
        console.log(payload, 2222);
      });
    }, 100);
  }
}
