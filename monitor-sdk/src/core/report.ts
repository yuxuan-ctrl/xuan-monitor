/*
 * @Author: yuxuan-ctrl
 * @Date: 2023-12-11 10:17:23
 * @LastEditors: yuxuan-ctrl
 * @LastEditTime: 2024-02-20 17:47:31
 * @FilePath: \monitor-sdk\src\core\Report.ts
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
import {
  Request,
  WebSocketManager,
  formatDate,
  isArray,
  normalizeUrlForPath,
  recursiveTimeout,
} from '../utils';
import { MonitorConfig } from '../types';
import MessageQueueDBWrapper from './Message';
import { DB_CONFIG } from '../config/dbconfig';
export default class Report {
  baseUrl?: String = '/api';
  reportUrl?: String;
  method: String;
  headers = {
    'Content-Type': 'application/json',
  };
  webSocketData: any;
  status: any;
  timeInterval: number;
  dataRetentionHours: number;
  websocketManager: WebSocketManager;
  messageWrapper: any;
  config: MonitorConfig;

  constructor(config: MonitorConfig) {
    this.config = config;
    this.timeInterval = config?.reportFrequency || 10000;
    this.dataRetentionHours = config?.dataRetentionHours || 1;
    this.messageWrapper = MessageQueueDBWrapper.getInstance({
      dbName: 'monitorxq',
      dbVersion: 1,
      storeName: DB_CONFIG.RECORD_STORE_NAME,
    });
  }

  start(baseUrl, useWebSocket = false) {
    this.websocketManager = new WebSocketManager(
      `ws://${baseUrl}/monitor/report`
    );
    this.clearIndex();
    recursiveTimeout(async () => {
      const startTime = new Date().getTime() - 30000;
      const endTime = new Date().getTime() + 30000;
      const trafficList = await this.messageWrapper.dequeue(
        DB_CONFIG.TRAFFIC_STORE_NAME
      );
      const actionList = await this.messageWrapper.dequeue(
        DB_CONFIG.ACTION_STORE_NAME
      );
      if (isArray(trafficList) || isArray(actionList)) {
        const reportData = {
          appId: this.config.appId,
          timestamp: formatDate(new Date()),
          eventList: isArray(trafficList)
            ? trafficList.map((item) => item.data)
            : [],
          actionList: isArray(actionList)
            ? actionList.map((item) => item.data)
            : [],
          record: await this.getRange(startTime, endTime),
        };
        if (useWebSocket && this.websocketManager) {
          this.webSocketReport(reportData);
        } else {
          this.fetchReport(`${baseUrl}/monitor/report`, reportData);
        }
      }
    }, this.timeInterval);
  }

  clearIndex() {
    recursiveTimeout(async () => {
      await this.messageWrapper.batchDeleteBeforeDate(
        [
          DB_CONFIG.RECORD_STORE_NAME,
          DB_CONFIG.ACTION_STORE_NAME,
          DB_CONFIG.Error_STORE_NAME,
          DB_CONFIG.TRAFFIC_STORE_NAME,
        ],
        this.dataRetentionHours
      );
    }, this.timeInterval);
  }

  async fetchReport(url, data) {
    const req = new Request();
    const response = await req.post(url, data);
  }

  async webSocketReport(data: any) {
    if (!this.websocketManager) {
      console.error(
        'WebSocket is not configured. Use the constructor to initialize it.'
      );
      return;
    }

    try {
      // 确保 WebSocket 已经连接
      if (!this.websocketManager.isConnected) {
        await this.websocketManager.start();
      }

      // 发送数据
      this.websocketManager.sendData(data);
    } catch (error) {
      console.error('Error while sending data over WebSocket:', error);
    }
  }

  async getRange(startTime?, endTime?) {
    const condition =
      startTime && endTime
        ? (item) => {
            return (
              +item.timestamp > +startTime &&
              +item.timestamp < +endTime &&
              item.data.path === normalizeUrlForPath(window.location.href)
            );
          }
        : () => true;
    const dataList = await this.messageWrapper.query(
      condition,
      DB_CONFIG.RECORD_STORE_NAME,
      {
        field: 'timestamp',
        direction: 'asc',
      }
    );
    return dataList.map((item) => JSON.stringify(item));
  }
}
