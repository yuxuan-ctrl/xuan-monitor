import { EventQueueManager } from "../Queue/eventQueueManager";
import { UseFetchOptions, useFetch, useWebSocket } from "@vueuse/core";

export class Report {
  baseUrl?: String;
  reportUrl?: String;
  method: String;
  useWebSocket = false;
  headers = {
    "Content-Type": "application/json",
  };
  constructor(config) {
    this.baseUrl = config?.baseUrl;
    this.reportUrl = config?.reportUrl || `/${this.baseUrl}/monitor/report`;
    this.method = config?.method;
    this.headers = {
      ...this.headers,
      ...config?.headers,
    };
    this.useWebSocket = config?.useWebSocket;
    if (this.useWebSocket) {
    } else {
      useFetch(this.reportUrl);
    }
  }
}
