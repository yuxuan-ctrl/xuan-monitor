import { Ref } from "vue";
import {
  MaybeRefOrGetter,
  useFetch,
  useWebSocket,
  WebSocketStatus,
} from "../lib/vueuse";

export class Report {
  baseUrl?: String;
  reportUrl?: String;
  method: String;
  headers = {
    "Content-Type": "application/json",
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
          message: "ping",
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
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      ...config,
    });
    return res.json();
  }

  async webSocketReport(config) {
    const status = this.send(config);
    return status;
  }
}
