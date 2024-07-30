/*
 * @Author: yuxuan-ctrl
 * @Date: 2024-02-04 09:07:38
 * @LastEditors: yuxuan-ctrl
 * @LastEditTime: 2024-02-20 11:19:26
 * @FilePath: \monitor-sdk\src\core\record\index.ts
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
import * as rrweb from 'rrweb';
import rrwebPlayer, { RRwebPlayerOptions } from 'rrweb-player';
// import 'rrweb-player/dist/style.css';
import MessageQueueDBWrapper from '../Message';
import { DB_CONFIG } from '../../config/dbconfig';
import { normalizeUrlForPath, getCurrentUnix } from '../../utils';

interface RecordReplayConfig extends RRwebPlayerOptions {
  props: any;
  startTime?: number | string;
  endTime?: number | string;
}

export default class Record {
  stopFn: any;
  events = [];
  messageWrapper: MessageQueueDBWrapper;

  constructor() {
    this.messageWrapper = MessageQueueDBWrapper.getInstance({
      dbName: 'monitorxq',
      dbVersion: 1,
      storeName: DB_CONFIG.RECORD_STORE_NAME,
    });
  }

  start() {
    const that = this;
    this.stopFn = rrweb.record({
      // 是否忽略输入框内容的变化，默认为false，即默认会记录
      maskInputOptions: {
        password: true,
        text: true,
      },
      emit(event, checkout) {
        // if(checkout) this.rrwebSessionSet();
        // 保存获取到的 event 数据，event里面是序列号后的DOM和鼠标事件等
        that.messageWrapper.enqueue(
          {
            ...event,
            session: new Date().getDate(),
            path: normalizeUrlForPath(window.location.href),
          },
          DB_CONFIG.RECORD_STORE_NAME
        );
      },
      checkoutEveryNms: 10 * 1000, // 每10秒重新制作快照
      checkoutEveryNth: 200, // 每 200 个 event 重新制作快照
    });
    return this.stopFn;
  }

  async replay(dom, config?: RecordReplayConfig) {
    const startTime = config?.startTime || getCurrentUnix() - 300000;
    const endTime = config?.endTime || getCurrentUnix() + 3000;
    const dataList = await this.getRange(startTime, endTime);

    setTimeout(() => {
      const replayInstance = new rrwebPlayer({
        target: dom, // 可以自定义 DOM 元素
        // 配置项
        props: {
          events: dataList.map((item) => item.data),
          skipInactive: false, //是否快速跳过无用户操作的阶段
          showDebug: false, //是否在回放过程中打印 debug 信息
          showWarning: false, //是否在回放过程中打印警告信息
          autoPlay: true, //是否自动播放
          speedOption: [1, 2, 4, 8], //倍速播放可选值
          ...config?.props,
        },
      });

      replayInstance.addEventListener('finish', (payload) => {
        console.log(payload, 2222);
      });
    }, 100);
  }

  async getRange(startTime?, endTime?) {
    const condition =
      startTime && endTime
        ? (item) => {
            return +item.timestamp > +startTime && +item.timestamp < +endTime;
          }
        : () => true;
    const dataList = await this.messageWrapper.query(
      condition,
      DB_CONFIG.RECORD_STORE_NAME,
      { field: 'timestamp', direction: 'asc' }
    );
    return dataList;
  }
}
