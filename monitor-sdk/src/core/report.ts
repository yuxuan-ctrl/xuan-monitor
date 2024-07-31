/*
 * @Author: yuxuan-ctrl
 * @Date: 2023-12-11 10:17:23
 * @LastEditors: yuxuan-ctrl 
 * @LastEditTime: 2024-07-31 09:08:30
 * @FilePath: \monitor-sdk\src\core\Report.ts
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
import {
  Request,
  WebSocketManager,
  formatDate,
  getUserLocation,
  isArray,
  normalizeUrlForPath,
  recursiveTimeout,
  getCurrentUnix,
  mapDataProperties,
} from '../utils';
import { MonitorConfig } from '../types';
import MessageQueueDBWrapper from './Message';
import { DB_CONFIG } from '../config/dbconfig';
import UvTracker from './UserViewTracker';

const {
  TRAFFIC_STORE_NAME,
  Error_STORE_NAME,
  ACTION_STORE_NAME,
  RECORD_STORE_NAME,
  INTERFACE_STORE_NAME,
} = DB_CONFIG;

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
  uvTracker: UvTracker;

  constructor(config: MonitorConfig, uvTracker: UvTracker) {
    this.uvTracker = uvTracker;
    this.config = config;
    this.timeInterval = config?.reportFrequency || 5000;
    this.dataRetentionHours = config?.dataRetentionHours || 1;
    this.messageWrapper = MessageQueueDBWrapper.getInstance({
      dbName: 'monitorxq',
      dbVersion: 1,
      storeName: RECORD_STORE_NAME,
    });
  }

  start(baseUrl, useWebSocket = false) {
    this.websocketManager = new WebSocketManager(
      `ws://${baseUrl}/monitor/report`
    );
    this.clearIndex();
    recursiveTimeout(async () => {
      const trafficList = await this.messageWrapper.dequeue(TRAFFIC_STORE_NAME);
      const actionList = await this.messageWrapper.dequeue(ACTION_STORE_NAME);
      const interfaceList = await this.messageWrapper.dequeue(INTERFACE_STORE_NAME);

      if (
        isArray(trafficList) ||
        isArray(actionList) ||
        isArray(interfaceList)
      ) {
        const reportData = {
          appId: this.config.appId,
          userId: await this.uvTracker.getUniqueKey(),
          platform: navigator.platform,
          location: await getUserLocation(3000),
          userAgent: navigator.userAgent,
          timestamp: formatDate(new Date()),
          eventList: mapDataProperties(trafficList),
          actionList: mapDataProperties(actionList),
          interfaceList: mapDataProperties(interfaceList),
          currentEnterPageUrl: normalizeUrlForPath(window.location.href),
        };
        if (useWebSocket && this.websocketManager) {
          //todo webSocket Methods
          this.webSocketReport(reportData);
        } else {
          await this.fetchReport(`${baseUrl}/monitor/report`, reportData);
          this.setSuccessfulStatus(trafficList, actionList, interfaceList);
        }
      }
    }, this.timeInterval);
  }

  setSuccessfulStatus(trafficList, actionList, interfaceList) {
    // 处理每个数组
    const trafficSuccessfulResult = this.mapWithStoreName(
      trafficList,
      TRAFFIC_STORE_NAME
    );
    const actionSuccessfulResult = this.mapWithStoreName(
      actionList,
      ACTION_STORE_NAME
    );
    const interfaceSuccessfulResult = this.mapWithStoreName(
      interfaceList,
      INTERFACE_STORE_NAME
    );

    // 合并所有数组
    const combineSuccessfulResult = [
      ...trafficSuccessfulResult,
      ...actionSuccessfulResult,
      ...interfaceSuccessfulResult,
    ];

    combineSuccessfulResult.forEach((res) => {
      this.messageWrapper.updateStatus(res.id, res.storeName, 'consumed');
    });
  }

  // 创建一个函数来处理数组中的每个元素
  mapWithStoreName(list, storeName) {
    return isArray(list)
      ? list.map((item) => ({ id: item.id, storeName }))
      : [];
  }

  clearIndex() {
    recursiveTimeout(async () => {
      await this.messageWrapper.batchDeleteBeforeDate(
        [
          RECORD_STORE_NAME,
          ACTION_STORE_NAME,
          Error_STORE_NAME,
          TRAFFIC_STORE_NAME,
        ],
        this.dataRetentionHours
      );
    }, this.timeInterval);
  }

  async fetchReport(url, data) {
    const req = new Request();
    const response = await req.post(url, data);
    return response;
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
      RECORD_STORE_NAME,
      {
        field: 'timestamp',
        direction: 'asc',
      }
    );
    return JSON.stringify(dataList.map((item) => JSON.stringify(item)));
  }
}
