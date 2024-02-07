/*
 * @Author: yuxuan-ctrl 
 * @Date: 2023-12-11 10:17:23
 * @LastEditors: yuxuan-ctrl 
 * @LastEditTime: 2024-02-07 14:14:53
 * @FilePath: \monitor-sdk\src\core\Report.ts
 * @Description: 
 * 
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved. 
 */
import { Ref } from 'vue';
import {
  MaybeRefOrGetter,
  useFetch,
  useWebSocket,
  WebSocketStatus,
} from '../lib/vueuse';
import {sendBeacon} from "../utils"
export default class Report {
  baseUrl?: String = '/api';
  reportUrl?: String;
  method: String;
  headers = {
    'Content-Type': 'application/json',
  };
  webSocketData: Ref<any | null>;
  send: (data: string | ArrayBuffer | Blob, useBuffer?: boolean) => boolean;
  status: Ref<WebSocketStatus>;
  useWebSocket: boolean = false;
  timeInterval: number = 60000;

  constructor(config) {
    this.useWebSocket = config?.useWebSocket;
    if (this.useWebSocket) {
      this.initWebSocket(config);
    } else {
      this.initFetch(config);
    }
  }

  start(data) {
    setTimeout(() => {
      // this.useWebSocket
      //   ? this.send(data)
      //   : this.fetchReport({
      //       body: data,
      //     });
    }, this.timeInterval);
  }

  private initWebSocket(config) {
    const { status, data, send } = useWebSocket(
      `ws://${this.reportUrl as MaybeRefOrGetter<string>}`,
      {
        autoReconnect: true,
        heartbeat: {
          message: 'ping',
          interval: 60000,
          pongTimeout: 60000,
        },
        ...config,
      }
    );
    this.webSocketData = data;
    this.send = send;
    this.status = status;
  }

  private initFetch(config) {
    this.baseUrl = config?.baseUrl;
    this.reportUrl = config?.reportUrl || `/${this.baseUrl}/monitor/report`;
    this.method = config?.method;
    this.headers = {
      ...this.headers,
      ...config?.headers,
    };
  }

  async fetchReport(config?) {
    const res = await useFetch(this.reportUrl as MaybeRefOrGetter<string>, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      ...config,
    });
    return res.json();
  }

  static sendBeacon(
    params: { baseUrl: string },
    formData: FormData
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const result = navigator.sendBeacon(
        `${params.baseUrl}/monitor/errorReport`,
        formData
      );
      result && resolve(result);
      !result && reject(result);
    });
  }
  
  async webSocketReport(config) {
    const status = this.send(config);
    return status;
  }
}
